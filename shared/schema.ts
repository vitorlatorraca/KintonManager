import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, json, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userTypeEnum = pgEnum('user_type', ['CUSTOMER', 'MANAGER', 'ADMIN']);
export const qrCodeStatusEnum = pgEnum('qr_code_status', ['ACTIVE', 'EXPIRED', 'USED']);
export const stampStatusEnum = pgEnum('stamp_status', ['ACTIVE', 'REDEEMED', 'EXPIRED']);
export const rewardTypeEnum = pgEnum('reward_type', ['GYOZA_FREE', 'DISCOUNT_10', 'DISCOUNT_15', 'SPECIAL_ITEM']);
export const rewardStatusEnum = pgEnum('reward_status', ['AVAILABLE', 'REDEEMED', 'EXPIRED']);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  userType: userTypeEnum("user_type").notNull().default('CUSTOMER'),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

// Customer Codes table (replacing QR Codes)
export const customerCodes = pgTable("customer_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(), // 6-digit numeric code
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: qrCodeStatusEnum("status").notNull().default('ACTIVE'),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  usedAt: timestamp("used_at"),
});

// Stamps table
export const stamps = pgTable("stamps", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  customerCodeId: uuid("customer_code_id").unique().references(() => customerCodes.id),
  createdById: uuid("created_by_id").notNull().references(() => users.id),
  status: stampStatusEnum("status").notNull().default('ACTIVE'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  redeemedAt: timestamp("redeemed_at"),
});

// Rewards table
export const rewards = pgTable("rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  rewardType: rewardTypeEnum("reward_type").notNull(),
  status: rewardStatusEnum("status").notNull().default('AVAILABLE'),
  stampsUsed: integer("stamps_used").notNull().default(10),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Redemptions table
export const redemptions = pgTable("redemptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  rewardId: uuid("reward_id").notNull().unique().references(() => rewards.id, { onDelete: 'cascade' }),
  processedById: uuid("processed_by_id").notNull().references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// System Config table
export const systemConfig = pgTable("system_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  stampsForReward: integer("stamps_for_reward").notNull().default(10),
  qrCodeExpirationMinutes: integer("qr_code_expiration_minutes").notNull().default(60),
  rewardExpirationDays: integer("reward_expiration_days").notNull().default(30),
  isMaintenanceMode: boolean("is_maintenance_mode").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Audit Logs table
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: json("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Stores table
export const stores = pgTable("stores", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  stamps: many(stamps),
  qrCodes: many(qrCodes),
  rewards: many(rewards),
  redemptions: many(redemptions),
  stampsCreated: many(stamps, { relationName: 'StampCreatedBy' }),
  redemptionsProcessed: many(redemptions, { relationName: 'RedemptionProcessedBy' }),
}));

export const customerCodesRelations = relations(customerCodes, ({ one }) => ({
  user: one(users, {
    fields: [customerCodes.userId],
    references: [users.id],
  }),
  stamp: one(stamps),
}));

export const stampsRelations = relations(stamps, ({ one }) => ({
  user: one(users, {
    fields: [stamps.userId],
    references: [users.id],
  }),
  customerCode: one(customerCodes, {
    fields: [stamps.customerCodeId],
    references: [customerCodes.id],
  }),
  createdBy: one(users, {
    fields: [stamps.createdById],
    references: [users.id],
    relationName: 'StampCreatedBy',
  }),
  redemption: one(redemptions),
}));

export const rewardsRelations = relations(rewards, ({ one }) => ({
  user: one(users, {
    fields: [rewards.userId],
    references: [users.id],
  }),
  redemption: one(redemptions),
}));

export const redemptionsRelations = relations(redemptions, ({ one, many }) => ({
  user: one(users, {
    fields: [redemptions.userId],
    references: [users.id],
  }),
  reward: one(rewards, {
    fields: [redemptions.rewardId],
    references: [rewards.id],
  }),
  processedBy: one(users, {
    fields: [redemptions.processedById],
    references: [users.id],
    relationName: 'RedemptionProcessedBy',
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export const insertCustomerCodeSchema = createInsertSchema(customerCodes).omit({
  id: true,
  createdAt: true,
  usedAt: true,
});

export const insertStampSchema = createInsertSchema(stamps).omit({
  id: true,
  createdAt: true,
  redeemedAt: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
});

export const insertRedemptionSchema = createInsertSchema(redemptions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CustomerCode = typeof customerCodes.$inferSelect;
export type InsertCustomerCode = z.infer<typeof insertCustomerCodeSchema>;
export type Stamp = typeof stamps.$inferSelect;
export type InsertStamp = z.infer<typeof insertStampSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Redemption = typeof redemptions.$inferSelect;
export type InsertRedemption = z.infer<typeof insertRedemptionSchema>;
export type SystemConfig = typeof systemConfig.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type Store = typeof stores.$inferSelect;
