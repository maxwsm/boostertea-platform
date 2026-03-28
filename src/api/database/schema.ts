import { pgTable, text, integer, real, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  bonusPoints: integer('bonus_points').notNull().default(0),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('order_number').notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  status: text('status').notNull().default('pending'),
  amountTotal: real('amount_total').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  deliveryMethod: text('delivery_method'),
  deliveryCity: text('delivery_city'),
  deliveryWarehouse: text('delivery_warehouse'),
  paymentStatus: text('payment_status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const orderItems = pgTable('order_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
  totalPrice: real('total_price').notNull()
});
