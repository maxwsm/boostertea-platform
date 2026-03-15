import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

/**
 * BoosterTea E-commerce Database Schema
 * Complete schema for Ukrainian premium tea concentrates platform
 */

// Product categories
export const PRODUCT_CATEGORIES = ['concentrate', 'accessory', 'dry_tea'] as const
export type ProductCategory = typeof PRODUCT_CATEGORIES[number]

// Order statuses
export const ORDER_STATUSES = ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'] as const
export type OrderStatus = typeof ORDER_STATUSES[number]

// Payment statuses
export const PAYMENT_STATUSES = ['pending', 'processing', 'completed', 'failed', 'refunded'] as const
export type PaymentStatus = typeof PAYMENT_STATUSES[number]

// Discount types
export const DISCOUNT_TYPES = ['percentage', 'fixed', 'free_shipping', 'free_product'] as const
export type DiscountType = typeof DISCOUNT_TYPES[number]

// Bonus transaction types
export const BONUS_TYPES = ['signup', 'referral', 'purchase', 'birthday', 'manual', 'redemption'] as const
export type BonusType = typeof BONUS_TYPES[number]

// Volume options
export const VOLUME_OPTIONS = ['1L', '0.5L', '0.25L'] as const
export type VolumeOption = typeof VOLUME_OPTIONS[number]

/**
 * Products table - stores all tea concentrates, accessories, and dry tea
 */
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  
  // Multilingual names
  nameUk: text('name_uk').notNull(),
  nameEn: text('name_en'),
  nameEs: text('name_es'),
  
  // Multilingual descriptions
  descriptionUk: text('description_uk').notNull(),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  
  category: text('category', { enum: PRODUCT_CATEGORIES }).notNull().default('concentrate'),
  
  // Pricing (in UAH - hryvnia)
  price1l: real('price_1l').notNull(),
  price025l: real('price_025l'),
  
  // Image URL
  image: text('image'),
  
  // Multilingual effects/benefits
  effectsUk: text('effects_uk'),
  effectsEn: text('effects_en'),
  effectsEs: text('effects_es'),
  
  // Brewing information
  brewingTime: integer('brewing_time'), // in seconds
  temperature: integer('temperature'), // in Celsius
  origin: text('origin'),
  
  // SKU and logistics information
  sku: text('sku').unique(), // Unique product code like 'BT-PU-1L-001'
  weightGrams: integer('weight_grams'), // Weight in grams for shipping calculations
  dimensions: text('dimensions'), // Package dimensions like '10x10x25cm'
  barcode: text('barcode'), // EAN/UPC barcode for inventory management
  
  // Status
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  
  // Timestamps
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`)
})

/**
 * Users table - customer accounts
 */
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  
  // Bonus/Loyalty program
  bonusPoints: integer('bonus_points').notNull().default(0),
  
  // Referral system
  referralCode: text('referral_code').unique(),
  referredBy: integer('referred_by').references(() => users.id),
  
  // Admin flag
  isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
  
  // Customer segments/tags (JSON array)
  tags: text('tags'), // ['VIP', 'New', 'Inactive'] stored as JSON
  
  // Notes for admin
  notes: text('notes'),
  
  // Timestamps
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  lastOrderAt: text('last_order_at')
})

/**
 * Orders table - customer orders
 */
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderNumber: text('order_number').notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  
  // Order status
  status: text('status', { enum: ORDER_STATUSES }).notNull().default('pending'),
  
  // Financials (in UAH)
  subtotal: real('subtotal').notNull(),
  discount: real('discount').notNull().default(0),
  total: real('total').notNull(),
  
  // Promo code used
  promoCode: text('promo_code'),
  promoCodeId: integer('promo_code_id').references(() => promoCodes.id),
  
  // Bonus points used/earned
  bonusPointsUsed: integer('bonus_points_used').notNull().default(0),
  bonusPointsEarned: integer('bonus_points_earned').notNull().default(0),
  
  // Delivery information
  deliveryMethod: text('delivery_method'), // 'nova_poshta', 'ukrposhta', 'pickup', etc.
  deliveryAddress: text('delivery_address'),
  deliveryCity: text('delivery_city'),
  deliveryWarehouse: text('delivery_warehouse'), // Nova Poshta warehouse number
  novaPoshtatTn: text('nova_poshta_ttn'), // Tracking number
  
  // Payment
  paymentStatus: text('payment_status', { enum: PAYMENT_STATUSES }).notNull().default('pending'),
  paymentId: text('payment_id'), // External payment processor ID
  paymentMethod: text('payment_method'),
  
  // Contact info (for guest checkout)
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone'),
  
  // Admin notes
  notes: text('notes'),
  
  // Status history timestamps
  processedAt: text('processed_at'),
  paidAt: text('paid_at'),
  shippedAt: text('shipped_at'),
  deliveredAt: text('delivered_at'),
  cancelledAt: text('cancelled_at'),
  
  // Timestamps
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`)
})

/**
 * Order items table - individual items in an order
 */
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id),
  
  // Product details at time of order
  productName: text('product_name').notNull(),
  productSlug: text('product_slug').notNull(),
  
  // Volume and quantity
  volume: text('volume', { enum: VOLUME_OPTIONS }).notNull(),
  quantity: integer('quantity').notNull(),
  
  // Price at time of order (in UAH)
  unitPrice: real('unit_price').notNull(),
  totalPrice: real('total_price').notNull()
})

/**
 * Promo codes table - discount codes
 */
export const promoCodes = sqliteTable('promo_codes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  
  // Discount configuration
  discountType: text('discount_type', { enum: DISCOUNT_TYPES }).notNull(),
  discountValue: real('discount_value').notNull(), // Percentage (0-100) or fixed amount in UAH
  
  // Free product details (when discountType is 'free_product')
  freeProductId: integer('free_product_id').references(() => products.id),
  
  // Usage limits
  minOrder: real('min_order'), // Minimum order amount in UAH
  maxUses: integer('max_uses'), // Total uses allowed, null = unlimited
  maxUsesPerUser: integer('max_uses_per_user'), // Uses per user, null = unlimited
  usedCount: integer('used_count').notNull().default(0),
  
  // Validity period
  startsAt: text('starts_at'),
  expiresAt: text('expires_at'),
  
  // Status
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  
  // Description/notes for admin
  description: text('description'),
  
  // Timestamps
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`)
})

/**
 * Bonus transactions table - tracks all bonus point changes
 */
export const bonusTransactions = sqliteTable('bonus_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Transaction details
  amount: integer('amount').notNull(), // Positive for earned, negative for spent
  type: text('type', { enum: BONUS_TYPES }).notNull(),
  reason: text('reason').notNull(), // Human-readable reason
  
  // Related order (if applicable)
  orderId: integer('order_id').references(() => orders.id),
  
  // Admin who made manual adjustment (if applicable)
  adminId: integer('admin_id').references(() => users.id),
  
  // Running balance after transaction
  balanceAfter: integer('balance_after').notNull(),
  
  // Timestamp
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
})

/**
 * Bonus rules configuration table
 */
export const bonusRules = sqliteTable('bonus_rules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Rule identification
  ruleKey: text('rule_key').notNull().unique(),
  ruleName: text('rule_name').notNull(),
  
  // Rule value (interpretation depends on rule type)
  value: real('value').notNull(),
  
  // Is this rule active?
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  
  // Description for admin
  description: text('description'),
  
  // Timestamps
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`)
})

/**
 * Reviews table - product reviews
 */
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  
  // Review content
  rating: integer('rating').notNull(), // 1-5
  title: text('title'),
  text: text('text'),
  
  // Reviewer info (for display)
  reviewerName: text('reviewer_name'),
  
  // Moderation
  isApproved: integer('is_approved', { mode: 'boolean' }).notNull().default(false),
  
  // Timestamps
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
})

/**
 * User addresses table - saved delivery addresses
 */
export const userAddresses = sqliteTable('user_addresses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Address details
  label: text('label'), // 'Home', 'Office', etc.
  recipientName: text('recipient_name').notNull(),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  warehouse: text('warehouse'), // Nova Poshta warehouse
  
  // Default address flag
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  
  // Timestamps
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
})

/**
 * Promo code usage tracking
 */
export const promoCodeUsage = sqliteTable('promo_code_usage', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  promoCodeId: integer('promo_code_id').notNull().references(() => promoCodes.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  
  // Discount applied
  discountAmount: real('discount_amount').notNull(),
  
  // Timestamp
  usedAt: text('used_at').notNull().default(sql`(datetime('now'))`)
})

/**
 * Notification settings table - admin configuration for notifications
 */
export const notificationSettings = sqliteTable('notification_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Telegram Bot configuration
  telegramBotToken: text('telegram_bot_token'),
  telegramChatId: text('telegram_chat_id'),
  telegramEnabled: integer('telegram_enabled', { mode: 'boolean' }).notNull().default(false),
  
  // Notification types enabled
  newOrderEnabled: integer('new_order_enabled', { mode: 'boolean' }).notNull().default(true),
  paymentReceivedEnabled: integer('payment_received_enabled', { mode: 'boolean' }).notNull().default(true),
  orderShippedEnabled: integer('order_shipped_enabled', { mode: 'boolean' }).notNull().default(true),
  
  // Email notification settings (placeholder)
  emailEnabled: integer('email_enabled', { mode: 'boolean' }).notNull().default(false),
  emailRecipient: text('email_recipient'),
  
  // Timestamps
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`)
})

/**
 * Notification log - tracks sent notifications
 */
export const notificationLog = sqliteTable('notification_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Notification details
  type: text('type').notNull(), // 'new_order', 'payment_received', 'order_shipped', 'test'
  channel: text('channel').notNull(), // 'telegram', 'email', 'browser'
  
  // Related entities
  orderId: integer('order_id').references(() => orders.id),
  
  // Status
  success: integer('success', { mode: 'boolean' }).notNull(),
  errorMessage: text('error_message'),
  
  // Message content
  messagePreview: text('message_preview'),
  
  // Timestamp
  sentAt: text('sent_at').notNull().default(sql`(datetime('now'))`)
})


// ============================================
// BLOG POSTS
// ============================================

export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),

  // Multilingual content
  titleUk: text('title_uk').notNull(),
  titleEn: text('title_en'),
  titleEs: text('title_es'),
  excerptUk: text('excerpt_uk'),
  excerptEn: text('excerpt_en'),
  excerptEs: text('excerpt_es'),
  contentUk: text('content_uk').notNull(),
  contentEn: text('content_en'),
  contentEs: text('content_es'),

  category: text('category').notNull().default('general'),
  tags: text('tags').default('[]'), // JSON array stored as text
  image: text('image'),
  authorName: text('author_name').notNull().default('BoosterTea Team'),
  
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  views: integer('views').notNull().default(0),
  readingTime: integer('reading_time').default(5),

  // SEO
  metaTitleUk: text('meta_title_uk'),
  metaTitleEn: text('meta_title_en'),
  metaDescriptionUk: text('meta_description_uk'),
  metaDescriptionEn: text('meta_description_en'),

  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull().default(sql),
  updatedAt: text('updated_at').notNull().default(sql)
})

export type BlogPost = typeof blogPosts.
export type NewBlogPost = typeof blogPosts.

// Type exports for use in application
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert

export type PromoCode = typeof promoCodes.$inferSelect
export type NewPromoCode = typeof promoCodes.$inferInsert

export type BonusTransaction = typeof bonusTransactions.$inferSelect
export type NewBonusTransaction = typeof bonusTransactions.$inferInsert

export type BonusRule = typeof bonusRules.$inferSelect
export type NewBonusRule = typeof bonusRules.$inferInsert

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert

export type UserAddress = typeof userAddresses.$inferSelect
export type NewUserAddress = typeof userAddresses.$inferInsert

export type PromoCodeUsage = typeof promoCodeUsage.$inferSelect
export type NewPromoCodeUsage = typeof promoCodeUsage.$inferInsert

export type NotificationSettings = typeof notificationSettings.$inferSelect
export type NewNotificationSettings = typeof notificationSettings.$inferInsert

export type NotificationLog = typeof notificationLog.$inferSelect
export type NewNotificationLog = typeof notificationLog.$inferInsert
