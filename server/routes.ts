import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { User } from "@shared/schema";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Request validation schemas
const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const qrCodeSchema = z.object({
  userId: z.string().uuid(),
});

const validateQRSchema = z.object({
  code: z.string().min(1, "QR code is required"),
});

const addStampSchema = z.object({
  customerCodeId: z.string().uuid(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware for authentication
  const authenticateUser = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    try {
      // In a real app, you'd verify JWT token here
      // For now, we'll use the token as user ID
      const user = await storage.getUser(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { phone, password, name } = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this phone number' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        phone,
        password: hashedPassword,
        name,
        userType: 'CUSTOMER',
      });

      // Log audit
      await storage.createAuditLog({
        userId: user.id,
        action: 'USER_REGISTERED',
        details: { phone },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.status(201).json({
        user: { id: user.id, phone: user.phone, name: user.name, userType: user.userType },
        token: user.id, // In production, use proper JWT
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { phone, password } = loginSchema.parse(req.body);

      // Find user
      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(401).json({ message: 'Invalid phone number or password' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid phone number or password' });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      // Log audit
      await storage.createAuditLog({
        userId: user.id,
        action: 'USER_LOGIN',
        details: { phone },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        user: { id: user.id, phone: user.phone, name: user.name, userType: user.userType },
        token: user.id, // In production, use proper JWT
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // User routes
  app.get('/api/user/me', authenticateUser, async (req, res) => {
    const user = req.user;
    res.json({
      id: user.id,
      phone: user.phone,
      name: user.name,
      userType: user.userType,
    });
  });

  app.get('/api/user/dashboard', authenticateUser, async (req, res) => {
    try {
      const user = req.user;
      
      // Get active stamps count
      const activeStampsCount = await storage.getUserActiveStampsCount(user.id);
      
      // Get available rewards
      const availableRewards = await storage.getUserAvailableRewards(user.id);
      
      // Get active customer code
      const activeCustomerCode = await storage.getUserActiveCustomerCode(user.id);

      res.json({
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
        },
        stamps: {
          current: activeStampsCount,
          required: 10,
        },
        rewards: availableRewards.map(reward => ({
          id: reward.id,
          type: reward.rewardType,
          status: reward.status,
          createdAt: reward.createdAt,
        })),
        activeCustomerCode: activeCustomerCode ? {
          id: activeCustomerCode.id,
          code: activeCustomerCode.code,
          expiresAt: activeCustomerCode.expiresAt,
        } : null,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Customer Code routes
  app.post('/api/customer-code/generate', authenticateUser, async (req, res) => {
    try {
      const user = req.user;

      if (user.userType !== 'CUSTOMER') {
        return res.status(403).json({ message: 'Only customers can generate codes' });
      }

      // Check if user has an active customer code
      const existingCode = await storage.getUserActiveCustomerCode(user.id);
      if (existingCode) {
        return res.json({
          id: existingCode.id,
          code: existingCode.code,
          expiresAt: existingCode.expiresAt,
        });
      }

      // Get system config for expiration
      const config = await storage.getSystemConfig();
      const expirationMinutes = config?.qrCodeExpirationMinutes || 60;

      // Generate new 6-digit numeric code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

      const customerCode = await storage.createCustomerCode({
        code,
        userId: user.id,
        status: 'ACTIVE',
        expiresAt,
      });

      // Log audit
      await storage.createAuditLog({
        userId: user.id,
        action: 'CUSTOMER_CODE_GENERATED',
        details: { code: customerCode.code },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        id: customerCode.id,
        code: customerCode.code,
        expiresAt: customerCode.expiresAt,
      });
    } catch (error) {
      console.error('Customer code generation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/customer-code/validate', authenticateUser, async (req, res) => {
    try {
      const manager = req.user;
      const { code } = validateQRSchema.parse(req.body);

      if (manager.userType !== 'MANAGER' && manager.userType !== 'ADMIN') {
        return res.status(403).json({ message: 'Only managers can validate customer codes' });
      }

      // Find customer code
      const customerCode = await storage.getCustomerCode(code);
      if (!customerCode) {
        return res.status(404).json({ message: 'Customer code not found' });
      }

      // Check if customer code is valid
      if (customerCode.status !== 'ACTIVE') {
        return res.status(400).json({ message: 'Customer code is not active' });
      }

      if (new Date() > customerCode.expiresAt) {
        // Mark as expired
        await storage.updateCustomerCode(customerCode.id, { status: 'EXPIRED' });
        return res.status(400).json({ message: 'Customer code has expired' });
      }

      // Check if customer code was already used
      const existingStamp = await storage.getStampByCustomerCode(customerCode.id);
      if (existingStamp) {
        return res.status(400).json({ message: 'Customer code has already been used' });
      }

      // Get customer details
      const customer = await storage.getUser(customerCode.userId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      // Get current stamps count
      const currentStampsCount = await storage.getUserActiveStampsCount(customer.id);

      res.json({
        customerCode: {
          id: customerCode.id,
          code: customerCode.code,
          createdAt: customerCode.createdAt,
        },
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          currentStamps: currentStampsCount,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error('Customer code validation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/stamps/add', authenticateUser, async (req, res) => {
    try {
      const manager = req.user;
      const { customerCodeId } = addStampSchema.parse(req.body);

      if (manager.userType !== 'MANAGER' && manager.userType !== 'ADMIN') {
        return res.status(403).json({ message: 'Only managers can add stamps' });
      }

      // Get customer code
      const customerCode = await storage.getCustomerCodeById(customerCodeId);
      if (!customerCode) {
        return res.status(404).json({ message: 'Customer code not found' });
      }

      // Check if stamp already exists
      const existingStamp = await storage.getStampByCustomerCode(customerCode.id);
      if (existingStamp) {
        return res.status(400).json({ message: 'Stamp already added for this customer code' });
      }

      // Create stamp
      const stamp = await storage.createStamp({
        userId: customerCode.userId,
        customerCodeId: customerCode.id,
        createdById: manager.id,
        status: 'ACTIVE',
      });

      // Mark customer code as used
      await storage.updateCustomerCode(customerCode.id, { 
        status: 'USED',
        usedAt: new Date(),
      });

      // Get updated stamps count
      const newStampsCount = await storage.getUserActiveStampsCount(customerCode.userId);

      // Check if user completed 10 stamps
      let rewardCreated = false;
      if (newStampsCount >= 10) {
        // Create reward
        const config = await storage.getSystemConfig();
        const expirationDays = config?.rewardExpirationDays || 30;
        const expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);

        await storage.createReward({
          userId: customerCode.userId,
          rewardType: 'GYOZA_FREE',
          status: 'AVAILABLE',
          stampsUsed: 10,
          expiresAt,
        });

        rewardCreated = true;

        // Log audit
        await storage.createAuditLog({
          userId: customerCode.userId,
          action: 'REWARD_CREATED',
          details: { rewardType: 'GYOZA_FREE', stampsUsed: 10 },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        });
      }

      // Log audit
      await storage.createAuditLog({
        userId: customerCode.userId,
        action: 'STAMP_ADDED',
        details: { 
          stampId: stamp.id,
          customerCodeId: customerCode.id,
          managerId: manager.id,
          newStampsCount,
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        stamp: {
          id: stamp.id,
          createdAt: stamp.createdAt,
        },
        customer: {
          newStampCount: newStampsCount,
        },
        rewardCreated,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error('Add stamp error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Stamps routes
  app.get('/api/stamps/history', authenticateUser, async (req, res) => {
    try {
      const user = req.user;
      const stamps = await storage.getUserStamps(user.id);
      
      res.json(stamps.map(stamp => ({
        id: stamp.id,
        status: stamp.status,
        createdAt: stamp.createdAt,
        redeemedAt: stamp.redeemedAt,
      })));
    } catch (error) {
      console.error('Stamps history error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Rewards routes
  app.get('/api/rewards', authenticateUser, async (req, res) => {
    try {
      const user = req.user;
      const rewards = await storage.getUserRewards(user.id);
      
      res.json(rewards.map(reward => ({
        id: reward.id,
        type: reward.rewardType,
        status: reward.status,
        stampsUsed: reward.stampsUsed,
        createdAt: reward.createdAt,
        expiresAt: reward.expiresAt,
      })));
    } catch (error) {
      console.error('Rewards error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/rewards/:id/redeem', authenticateUser, async (req, res) => {
    try {
      const user = req.user;
      const rewardId = req.params.id;

      if (user.userType !== 'CUSTOMER') {
        return res.status(403).json({ message: 'Only customers can redeem rewards' });
      }

      // Get reward
      const reward = await storage.getUserRewards(user.id);
      const targetReward = reward.find(r => r.id === rewardId);
      
      if (!targetReward) {
        return res.status(404).json({ message: 'Reward not found' });
      }

      if (targetReward.status !== 'AVAILABLE') {
        return res.status(400).json({ message: 'Reward is not available for redemption' });
      }

      if (targetReward.expiresAt && new Date() > targetReward.expiresAt) {
        // Mark as expired
        await storage.updateReward(rewardId, { status: 'EXPIRED' });
        return res.status(400).json({ message: 'Reward has expired' });
      }

      // Update reward status
      await storage.updateReward(rewardId, { status: 'REDEEMED' });

      // Create redemption record
      const redemption = await storage.createRedemption({
        userId: user.id,
        rewardId: rewardId,
        processedById: user.id, // Self-service redemption
      });

      // Log audit
      await storage.createAuditLog({
        userId: user.id,
        action: 'REWARD_REDEEMED',
        details: { 
          rewardId,
          rewardType: targetReward.rewardType,
          redemptionId: redemption.id,
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      res.json({
        redemption: {
          id: redemption.id,
          createdAt: redemption.createdAt,
        },
        reward: {
          id: targetReward.id,
          type: targetReward.rewardType,
        },
      });
    } catch (error) {
      console.error('Reward redemption error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Redemptions routes
  app.get('/api/redemptions/history', authenticateUser, async (req, res) => {
    try {
      const user = req.user;
      const redemptions = await storage.getUserRedemptions(user.id);
      
      res.json(redemptions.map(redemption => ({
        id: redemption.id,
        rewardId: redemption.rewardId,
        notes: redemption.notes,
        createdAt: redemption.createdAt,
      })));
    } catch (error) {
      console.error('Redemptions history error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
