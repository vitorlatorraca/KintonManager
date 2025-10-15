import { 
  users, stamps, customerCodes, rewards, redemptions, systemConfig, auditLogs,
  type User, type InsertUser, type Stamp, type InsertStamp, 
  type CustomerCode, type InsertCustomerCode, type Reward, type InsertReward,
  type Redemption, type InsertRedemption, type SystemConfig, type AuditLog
} from "@shared/schema";
import { db } from "./db";
import { eq, and, count, desc, gte, lt } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Customer Codes
  createCustomerCode(customerCodeData: InsertCustomerCode): Promise<CustomerCode>;
  getCustomerCode(code: string): Promise<CustomerCode | undefined>;
  getCustomerCodeById(id: string): Promise<CustomerCode | undefined>;
  updateCustomerCode(id: string, updates: Partial<CustomerCode>): Promise<CustomerCode | undefined>;
  getUserActiveCustomerCode(userId: string): Promise<CustomerCode | undefined>;

  // Stamps
  createStamp(stampData: InsertStamp): Promise<Stamp>;
  getUserStamps(userId: string): Promise<Stamp[]>;
  getUserActiveStampsCount(userId: string): Promise<number>;
  getStampByCustomerCode(customerCodeId: string): Promise<Stamp | undefined>;

  // Rewards
  createReward(rewardData: InsertReward): Promise<Reward>;
  getUserRewards(userId: string): Promise<Reward[]>;
  getUserAvailableRewards(userId: string): Promise<Reward[]>;
  updateReward(id: string, updates: Partial<Reward>): Promise<Reward | undefined>;

  // Redemptions
  createRedemption(redemptionData: InsertRedemption): Promise<Redemption>;
  getUserRedemptions(userId: string): Promise<Redemption[]>;

  // System Config
  getSystemConfig(): Promise<SystemConfig | undefined>;

  // Audit Logs
  createAuditLog(logData: Partial<AuditLog>): Promise<AuditLog>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createCustomerCode(customerCodeData: InsertCustomerCode): Promise<CustomerCode> {
    const [customerCode] = await db.insert(customerCodes).values(customerCodeData).returning();
    return customerCode;
  }

  async getCustomerCode(code: string): Promise<CustomerCode | undefined> {
    const [customerCode] = await db.select().from(customerCodes).where(eq(customerCodes.code, code));
    return customerCode || undefined;
  }

  async getCustomerCodeById(id: string): Promise<CustomerCode | undefined> {
    const [customerCode] = await db.select().from(customerCodes).where(eq(customerCodes.id, id));
    return customerCode || undefined;
  }

  async updateCustomerCode(id: string, updates: Partial<CustomerCode>): Promise<CustomerCode | undefined> {
    const [customerCode] = await db
      .update(customerCodes)
      .set(updates)
      .where(eq(customerCodes.id, id))
      .returning();
    return customerCode || undefined;
  }

  async getUserActiveCustomerCode(userId: string): Promise<CustomerCode | undefined> {
    const [customerCode] = await db
      .select()
      .from(customerCodes)
      .where(
        and(
          eq(customerCodes.userId, userId),
          eq(customerCodes.status, 'ACTIVE'),
          gte(customerCodes.expiresAt, new Date())
        )
      )
      .orderBy(desc(customerCodes.createdAt))
      .limit(1);
    return customerCode || undefined;
  }

  async createStamp(stampData: InsertStamp): Promise<Stamp> {
    const [stamp] = await db.insert(stamps).values(stampData).returning();
    return stamp;
  }

  async getUserStamps(userId: string): Promise<Stamp[]> {
    return db
      .select()
      .from(stamps)
      .where(eq(stamps.userId, userId))
      .orderBy(desc(stamps.createdAt));
  }

  async getUserActiveStampsCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(stamps)
      .where(
        and(
          eq(stamps.userId, userId),
          eq(stamps.status, 'ACTIVE')
        )
      );
    return result.count;
  }

  async getStampByCustomerCode(customerCodeId: string): Promise<Stamp | undefined> {
    const [stamp] = await db
      .select()
      .from(stamps)
      .where(eq(stamps.customerCodeId, customerCodeId));
    return stamp || undefined;
  }

  async createReward(rewardData: InsertReward): Promise<Reward> {
    const [reward] = await db.insert(rewards).values(rewardData).returning();
    return reward;
  }

  async getUserRewards(userId: string): Promise<Reward[]> {
    return db
      .select()
      .from(rewards)
      .where(eq(rewards.userId, userId))
      .orderBy(desc(rewards.createdAt));
  }

  async getUserAvailableRewards(userId: string): Promise<Reward[]> {
    return db
      .select()
      .from(rewards)
      .where(
        and(
          eq(rewards.userId, userId),
          eq(rewards.status, 'AVAILABLE')
        )
      )
      .orderBy(desc(rewards.createdAt));
  }

  async updateReward(id: string, updates: Partial<Reward>): Promise<Reward | undefined> {
    const [reward] = await db
      .update(rewards)
      .set(updates)
      .where(eq(rewards.id, id))
      .returning();
    return reward || undefined;
  }

  async createRedemption(redemptionData: InsertRedemption): Promise<Redemption> {
    const [redemption] = await db.insert(redemptions).values(redemptionData).returning();
    return redemption;
  }

  async getUserRedemptions(userId: string): Promise<Redemption[]> {
    return db
      .select()
      .from(redemptions)
      .where(eq(redemptions.userId, userId))
      .orderBy(desc(redemptions.createdAt));
  }

  async getSystemConfig(): Promise<SystemConfig | undefined> {
    const [config] = await db.select().from(systemConfig).limit(1);
    return config || undefined;
  }

  async createAuditLog(logData: Partial<AuditLog>): Promise<AuditLog> {
    const [log] = await db.insert(auditLogs).values(logData as any).returning();
    return log;
  }
}

export const storage = new DatabaseStorage();
