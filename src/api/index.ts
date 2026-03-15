import { Hono } from 'hono';
import { cors } from "hono/cors"
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { eq, desc, asc, like, or, and, sql, count, sum } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './database/schema'

// Create main app
const app = new Hono<{ Bindings: Env }>()
  .basePath('api');

app.use(cors({
  origin: "*"
}))

// Helper to get database instance
const getDb = (env: Env) => drizzle(env.DB, { schema })

// Helper to generate unique codes
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BT-${timestamp}-${random}`
}

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

// ============================================
// PRODUCTS API
// ============================================

// Validation schemas
const productCreateSchema = z.object({
  slug: z.string().min(1).max(100),
  nameUk: z.string().min(1).max(200),
  nameEn: z.string().max(200).optional(),
  nameEs: z.string().max(200).optional(),
  descriptionUk: z.string().min(1),
  descriptionEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  category: z.enum(['concentrate', 'accessory', 'dry_tea']).default('concentrate'),
  price1l: z.number().positive(),
  price025l: z.number().positive().optional(),
  image: z.string().optional(),
  effectsUk: z.string().optional(),
  effectsEn: z.string().optional(),
  effectsEs: z.string().optional(),
  brewingTime: z.number().int().positive().optional(),
  temperature: z.number().int().positive().optional(),
  origin: z.string().optional(),
  isActive: z.boolean().default(true)
})

const productUpdateSchema = productCreateSchema.partial()

// GET all products
app.get('/products', async (c) => {
  const db = getDb(c.env)
  const { category, active, search, sort, order, limit, offset } = c.req.query()
  
  try {
    let conditions = []
    
    // Filter by category
    if (category && ['concentrate', 'accessory', 'dry_tea'].includes(category)) {
      conditions.push(eq(schema.products.category, category as schema.ProductCategory))
    }
    
    // Filter by active status
    if (active !== undefined) {
      conditions.push(eq(schema.products.isActive, active === 'true'))
    }
    
    // Search by name
    if (search) {
      conditions.push(
        or(
          like(schema.products.nameUk, `%${search}%`),
          like(schema.products.nameEn, `%${search}%`),
          like(schema.products.slug, `%${search}%`)
        )
      )
    }
    
    // Build query
    let query = db.select().from(schema.products)
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query
    }
    
    // Sorting
    const sortField = sort === 'price' ? schema.products.price1l : 
                      sort === 'name' ? schema.products.nameUk :
                      schema.products.createdAt
    const sortOrder = order === 'asc' ? asc(sortField) : desc(sortField)
    query = query.orderBy(sortOrder) as typeof query
    
    // Pagination
    if (limit) {
      query = query.limit(parseInt(limit)) as typeof query
    }
    if (offset) {
      query = query.offset(parseInt(offset)) as typeof query
    }
    
    const products = await query
    
    // Get total count
    const [{ total }] = await db.select({ total: count() }).from(schema.products)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
    
    return c.json({ products, total, limit: limit ? parseInt(limit) : null, offset: offset ? parseInt(offset) : 0 })
  } catch (error) {
    console.error('Error fetching products:', error)
    return c.json({ error: 'Failed to fetch products' }, 500)
  }
})

// GET single product by slug or ID
app.get('/products/:identifier', async (c) => {
  const db = getDb(c.env)
  const identifier = c.req.param('identifier')
  
  try {
    const isId = /^\d+$/.test(identifier)
    const condition = isId 
      ? eq(schema.products.id, parseInt(identifier))
      : eq(schema.products.slug, identifier)
    
    const [product] = await db.select().from(schema.products).where(condition)
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }
    
    // Get reviews for product
    const reviews = await db.select().from(schema.reviews)
      .where(and(
        eq(schema.reviews.productId, product.id),
        eq(schema.reviews.isApproved, true)
      ))
      .orderBy(desc(schema.reviews.createdAt))
      .limit(10)
    
    return c.json({ product, reviews })
  } catch (error) {
    console.error('Error fetching product:', error)
    return c.json({ error: 'Failed to fetch product' }, 500)
  }
})

// POST create product
app.post('/products', zValidator('json', productCreateSchema), async (c) => {
  const db = getDb(c.env)
  const data = c.req.valid('json')
  
  try {
    // Check for duplicate slug
    const [existing] = await db.select().from(schema.products).where(eq(schema.products.slug, data.slug))
    if (existing) {
      return c.json({ error: 'Product with this slug already exists' }, 400)
    }
    
    const [product] = await db.insert(schema.products).values(data).returning()
    return c.json({ product }, 201)
  } catch (error) {
    console.error('Error creating product:', error)
    return c.json({ error: 'Failed to create product' }, 500)
  }
})

// PUT update product
app.put('/products/:id', zValidator('json', productUpdateSchema), async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  const data = c.req.valid('json')
  
  try {
    // Check if product exists
    const [existing] = await db.select().from(schema.products).where(eq(schema.products.id, id))
    if (!existing) {
      return c.json({ error: 'Product not found' }, 404)
    }
    
    // Check for duplicate slug if updating
    if (data.slug && data.slug !== existing.slug) {
      const [duplicate] = await db.select().from(schema.products).where(eq(schema.products.slug, data.slug))
      if (duplicate) {
        return c.json({ error: 'Product with this slug already exists' }, 400)
      }
    }
    
    const [product] = await db.update(schema.products)
      .set({ ...data, updatedAt: sql`datetime('now')` })
      .where(eq(schema.products.id, id))
      .returning()
    
    return c.json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    return c.json({ error: 'Failed to update product' }, 500)
  }
})

// DELETE product
app.delete('/products/:id', async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  
  try {
    const [product] = await db.delete(schema.products).where(eq(schema.products.id, id)).returning()
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }
    
    return c.json({ message: 'Product deleted successfully', product })
  } catch (error) {
    console.error('Error deleting product:', error)
    return c.json({ error: 'Failed to delete product' }, 500)
  }
})

// ============================================
// USERS API
// ============================================

const userCreateSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  name: z.string().min(1).max(200),
  password: z.string().min(6),
  isAdmin: z.boolean().default(false)
})

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  name: z.string().min(1).max(200).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  isAdmin: z.boolean().optional()
})

// GET all users (admin)
app.get('/users', async (c) => {
  const db = getDb(c.env)
  const { search, tag, sort, order, limit, offset } = c.req.query()
  
  try {
    let conditions = []
    
    // Search by name, email, phone
    if (search) {
      conditions.push(
        or(
          like(schema.users.name, `%${search}%`),
          like(schema.users.email, `%${search}%`),
          like(schema.users.phone, `%${search}%`)
        )
      )
    }
    
    // Filter by tag
    if (tag) {
      conditions.push(like(schema.users.tags, `%"${tag}"%`))
    }
    
    let query = db.select({
      id: schema.users.id,
      email: schema.users.email,
      phone: schema.users.phone,
      name: schema.users.name,
      bonusPoints: schema.users.bonusPoints,
      referralCode: schema.users.referralCode,
      isAdmin: schema.users.isAdmin,
      tags: schema.users.tags,
      notes: schema.users.notes,
      createdAt: schema.users.createdAt,
      lastOrderAt: schema.users.lastOrderAt
    }).from(schema.users)
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query
    }
    
    // Sorting
    const sortField = sort === 'name' ? schema.users.name :
                      sort === 'email' ? schema.users.email :
                      sort === 'bonus' ? schema.users.bonusPoints :
                      sort === 'lastOrder' ? schema.users.lastOrderAt :
                      schema.users.createdAt
    const sortOrder = order === 'asc' ? asc(sortField) : desc(sortField)
    query = query.orderBy(sortOrder) as typeof query
    
    // Pagination
    if (limit) query = query.limit(parseInt(limit)) as typeof query
    if (offset) query = query.offset(parseInt(offset)) as typeof query
    
    const users = await query
    
    // Get totals for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const [orderStats] = await db.select({
        totalOrders: count(),
        totalSpent: sum(schema.orders.total)
      }).from(schema.orders).where(eq(schema.orders.userId, user.id))
      
      return {
        ...user,
        tags: user.tags ? JSON.parse(user.tags) : [],
        totalOrders: orderStats?.totalOrders || 0,
        totalSpent: orderStats?.totalSpent || 0
      }
    }))
    
    const [{ total }] = await db.select({ total: count() }).from(schema.users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
    
    return c.json({ users: usersWithStats, total })
  } catch (error) {
    console.error('Error fetching users:', error)
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

// GET single user
app.get('/users/:id', async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  
  try {
    const [user] = await db.select({
      id: schema.users.id,
      email: schema.users.email,
      phone: schema.users.phone,
      name: schema.users.name,
      bonusPoints: schema.users.bonusPoints,
      referralCode: schema.users.referralCode,
      referredBy: schema.users.referredBy,
      isAdmin: schema.users.isAdmin,
      tags: schema.users.tags,
      notes: schema.users.notes,
      createdAt: schema.users.createdAt,
      lastOrderAt: schema.users.lastOrderAt
    }).from(schema.users).where(eq(schema.users.id, id))
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    // Get order history
    const orders = await db.select().from(schema.orders)
      .where(eq(schema.orders.userId, id))
      .orderBy(desc(schema.orders.createdAt))
      .limit(20)
    
    // Get bonus transactions
    const bonusTransactions = await db.select().from(schema.bonusTransactions)
      .where(eq(schema.bonusTransactions.userId, id))
      .orderBy(desc(schema.bonusTransactions.createdAt))
      .limit(20)
    
    // Get order statistics
    const [orderStats] = await db.select({
      totalOrders: count(),
      totalSpent: sum(schema.orders.total)
    }).from(schema.orders).where(eq(schema.orders.userId, id))
    
    // Get referred users
    const referredUsers = await db.select({
      id: schema.users.id,
      name: schema.users.name,
      createdAt: schema.users.createdAt
    }).from(schema.users).where(eq(schema.users.referredBy, id))
    
    return c.json({
      user: {
        ...user,
        tags: user.tags ? JSON.parse(user.tags) : []
      },
      orders,
      bonusTransactions,
      stats: {
        totalOrders: orderStats?.totalOrders || 0,
        totalSpent: orderStats?.totalSpent || 0
      },
      referredUsers
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return c.json({ error: 'Failed to fetch user' }, 500)
  }
})

// POST create user (registration)
app.post('/users', zValidator('json', userCreateSchema), async (c) => {
  const db = getDb(c.env)
  const data = c.req.valid('json')
  
  try {
    // Check for duplicate email
    const [existing] = await db.select().from(schema.users).where(eq(schema.users.email, data.email))
    if (existing) {
      return c.json({ error: 'User with this email already exists' }, 400)
    }
    
    // Generate referral code
    const referralCode = generateReferralCode()
    
    // In production, you'd hash the password here
    const passwordHash = data.password // TODO: Use bcrypt or similar
    
    const [user] = await db.insert(schema.users).values({
      email: data.email,
      phone: data.phone,
      name: data.name,
      passwordHash,
      referralCode,
      isAdmin: data.isAdmin
    }).returning({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      referralCode: schema.users.referralCode,
      bonusPoints: schema.users.bonusPoints,
      createdAt: schema.users.createdAt
    })
    
    // Add signup bonus
    const [signupBonusRule] = await db.select().from(schema.bonusRules)
      .where(and(
        eq(schema.bonusRules.ruleKey, 'signup_bonus'),
        eq(schema.bonusRules.isActive, true)
      ))
    
    if (signupBonusRule && signupBonusRule.value > 0) {
      await db.insert(schema.bonusTransactions).values({
        userId: user.id,
        amount: Math.floor(signupBonusRule.value),
        type: 'signup',
        reason: 'Бонус за реєстрацію',
        balanceAfter: Math.floor(signupBonusRule.value)
      })
      
      await db.update(schema.users)
        .set({ bonusPoints: Math.floor(signupBonusRule.value) })
        .where(eq(schema.users.id, user.id))
    }
    
    return c.json({ user }, 201)
  } catch (error) {
    console.error('Error creating user:', error)
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

// PUT update user
app.put('/users/:id', zValidator('json', userUpdateSchema), async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  const data = c.req.valid('json')
  
  try {
    const [existing] = await db.select().from(schema.users).where(eq(schema.users.id, id))
    if (!existing) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    // Check for duplicate email if updating
    if (data.email && data.email !== existing.email) {
      const [duplicate] = await db.select().from(schema.users).where(eq(schema.users.email, data.email))
      if (duplicate) {
        return c.json({ error: 'User with this email already exists' }, 400)
      }
    }
    
    const updateData: Record<string, unknown> = { ...data }
    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags)
    }
    
    const [user] = await db.update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, id))
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        phone: schema.users.phone,
        tags: schema.users.tags,
        notes: schema.users.notes
      })
    
    return c.json({ user: { ...user, tags: user.tags ? JSON.parse(user.tags) : [] } })
  } catch (error) {
    console.error('Error updating user:', error)
    return c.json({ error: 'Failed to update user' }, 500)
  }
})

// POST add bonus points to user
app.post('/users/:id/bonus', zValidator('json', z.object({
  amount: z.number().int(),
  reason: z.string().min(1)
})), async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  const { amount, reason } = c.req.valid('json')
  
  try {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id))
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    const newBalance = user.bonusPoints + amount
    
    // Create transaction
    await db.insert(schema.bonusTransactions).values({
      userId: id,
      amount,
      type: 'manual',
      reason,
      balanceAfter: newBalance
    })
    
    // Update user balance
    await db.update(schema.users)
      .set({ bonusPoints: newBalance })
      .where(eq(schema.users.id, id))
    
    return c.json({ 
      message: 'Bonus points updated', 
      previousBalance: user.bonusPoints,
      newBalance,
      change: amount
    })
  } catch (error) {
    console.error('Error adding bonus:', error)
    return c.json({ error: 'Failed to add bonus points' }, 500)
  }
})

// GET export users as CSV
app.get('/users/export/csv', async (c) => {
  const db = getDb(c.env)
  
  try {
    const users = await db.select({
      id: schema.users.id,
      email: schema.users.email,
      phone: schema.users.phone,
      name: schema.users.name,
      bonusPoints: schema.users.bonusPoints,
      createdAt: schema.users.createdAt,
      lastOrderAt: schema.users.lastOrderAt
    }).from(schema.users).orderBy(desc(schema.users.createdAt))
    
    // Build CSV
    const headers = ['ID', 'Email', 'Phone', 'Name', 'Bonus Points', 'Created At', 'Last Order At']
    const rows = users.map(u => [
      u.id,
      u.email,
      u.phone || '',
      u.name,
      u.bonusPoints,
      u.createdAt,
      u.lastOrderAt || ''
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="boostertea-customers-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error exporting users:', error)
    return c.json({ error: 'Failed to export users' }, 500)
  }
})

// ============================================
// ORDERS API
// ============================================

const orderCreateSchema = z.object({
  userId: z.number().optional(),
  items: z.array(z.object({
    productId: z.number(),
    volume: z.enum(['1L', '0.5L', '0.25L']),
    quantity: z.number().int().positive()
  })).min(1),
  promoCode: z.string().optional(),
  bonusPointsToUse: z.number().int().min(0).optional(),
  deliveryMethod: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryWarehouse: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  notes: z.string().optional()
})

const orderUpdateSchema = z.object({
  status: z.enum(['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'processing', 'completed', 'failed', 'refunded']).optional(),
  novaPoshtatTn: z.string().optional(),
  notes: z.string().optional()
})

// GET all orders
app.get('/orders', async (c) => {
  const db = getDb(c.env)
  const { status, userId, search, sort, order, limit, offset } = c.req.query()
  
  try {
    let conditions = []
    
    if (status && ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      conditions.push(eq(schema.orders.status, status as schema.OrderStatus))
    }
    
    if (userId) {
      conditions.push(eq(schema.orders.userId, parseInt(userId)))
    }
    
    if (search) {
      conditions.push(
        or(
          like(schema.orders.orderNumber, `%${search}%`),
          like(schema.orders.customerName, `%${search}%`),
          like(schema.orders.customerEmail, `%${search}%`)
        )
      )
    }
    
    let query = db.select().from(schema.orders)
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query
    }
    
    // Sorting
    const sortField = sort === 'total' ? schema.orders.total :
                      sort === 'status' ? schema.orders.status :
                      schema.orders.createdAt
    const sortOrder = order === 'asc' ? asc(sortField) : desc(sortField)
    query = query.orderBy(sortOrder) as typeof query
    
    if (limit) query = query.limit(parseInt(limit)) as typeof query
    if (offset) query = query.offset(parseInt(offset)) as typeof query
    
    const orders = await query
    
    const [{ total }] = await db.select({ total: count() }).from(schema.orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
    
    return c.json({ orders, total })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return c.json({ error: 'Failed to fetch orders' }, 500)
  }
})

// GET single order
app.get('/orders/:id', async (c) => {
  const db = getDb(c.env)
  const identifier = c.req.param('id')
  
  try {
    const isId = /^\d+$/.test(identifier)
    const condition = isId 
      ? eq(schema.orders.id, parseInt(identifier))
      : eq(schema.orders.orderNumber, identifier)
    
    const [order] = await db.select().from(schema.orders).where(condition)
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    // Get order items
    const items = await db.select().from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order.id))
    
    // Get user info if exists
    let user = null
    if (order.userId) {
      const [u] = await db.select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        phone: schema.users.phone
      }).from(schema.users).where(eq(schema.users.id, order.userId))
      user = u
    }
    
    return c.json({ order, items, user })
  } catch (error) {
    console.error('Error fetching order:', error)
    return c.json({ error: 'Failed to fetch order' }, 500)
  }
})

// POST create order
app.post('/orders', zValidator('json', orderCreateSchema), async (c) => {
  const db = getDb(c.env)
  const data = c.req.valid('json')
  
  try {
    // Fetch products
    const productIds = data.items.map(i => i.productId)
    const products = await db.select().from(schema.products)
      .where(sql`${schema.products.id} IN (${productIds.join(',')})`)
    
    if (products.length !== productIds.length) {
      return c.json({ error: 'One or more products not found' }, 400)
    }
    
    // Calculate prices
    let subtotal = 0
    const orderItems: schema.NewOrderItem[] = []
    
    for (const item of data.items) {
      const product = products.find(p => p.id === item.productId)!
      const unitPrice = item.volume === '0.25L' && product.price025l 
        ? product.price025l 
        : product.price1l
      const totalPrice = unitPrice * item.quantity
      subtotal += totalPrice
      
      orderItems.push({
        orderId: 0, // Will be set after order creation
        productId: item.productId,
        productName: product.nameUk,
        productSlug: product.slug,
        volume: item.volume,
        quantity: item.quantity,
        unitPrice,
        totalPrice
      })
    }
    
    // Apply promo code
    let discount = 0
    let promoCodeId: number | null = null
    
    if (data.promoCode) {
      const [promo] = await db.select().from(schema.promoCodes)
        .where(and(
          eq(schema.promoCodes.code, data.promoCode.toUpperCase()),
          eq(schema.promoCodes.isActive, true)
        ))
      
      if (promo) {
        // Check validity
        const now = new Date().toISOString()
        const isValid = (!promo.expiresAt || promo.expiresAt > now) &&
                       (!promo.startsAt || promo.startsAt <= now) &&
                       (!promo.maxUses || promo.usedCount < promo.maxUses) &&
                       (!promo.minOrder || subtotal >= promo.minOrder)
        
        if (isValid) {
          promoCodeId = promo.id
          
          if (promo.discountType === 'percentage') {
            discount = subtotal * (promo.discountValue / 100)
          } else if (promo.discountType === 'fixed') {
            discount = Math.min(promo.discountValue, subtotal)
          }
        }
      }
    }
    
    // Apply bonus points
    let bonusPointsUsed = 0
    if (data.userId && data.bonusPointsToUse && data.bonusPointsToUse > 0) {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, data.userId))
      if (user && user.bonusPoints >= data.bonusPointsToUse) {
        // 1 bonus point = 1 UAH
        bonusPointsUsed = Math.min(data.bonusPointsToUse, subtotal - discount)
      }
    }
    
    const total = subtotal - discount - bonusPointsUsed
    
    // Create order
    const orderNumber = generateOrderNumber()
    const [order] = await db.insert(schema.orders).values({
      orderNumber,
      userId: data.userId,
      subtotal,
      discount,
      total,
      promoCode: data.promoCode?.toUpperCase(),
      promoCodeId,
      bonusPointsUsed,
      deliveryMethod: data.deliveryMethod,
      deliveryAddress: data.deliveryAddress,
      deliveryCity: data.deliveryCity,
      deliveryWarehouse: data.deliveryWarehouse,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      notes: data.notes
    }).returning()
    
    // Create order items
    const itemsWithOrderId = orderItems.map(item => ({ ...item, orderId: order.id }))
    await db.insert(schema.orderItems).values(itemsWithOrderId)
    
    // Update promo code usage
    if (promoCodeId) {
      await db.update(schema.promoCodes)
        .set({ usedCount: sql`${schema.promoCodes.usedCount} + 1` })
        .where(eq(schema.promoCodes.id, promoCodeId))
      
      await db.insert(schema.promoCodeUsage).values({
        promoCodeId,
        userId: data.userId,
        orderId: order.id,
        discountAmount: discount
      })
    }
    
    // Deduct bonus points
    if (bonusPointsUsed > 0 && data.userId) {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, data.userId))
      const newBalance = user!.bonusPoints - bonusPointsUsed
      
      await db.insert(schema.bonusTransactions).values({
        userId: data.userId,
        amount: -bonusPointsUsed,
        type: 'redemption',
        reason: `Списано за замовлення ${orderNumber}`,
        orderId: order.id,
        balanceAfter: newBalance
      })
      
      await db.update(schema.users)
        .set({ bonusPoints: newBalance })
        .where(eq(schema.users.id, data.userId))
    }
    
    // Send Telegram notification for new order (async, don't await to not block response)
    sendNewOrderNotification(db, order, orderItems.map(item => ({
      productName: item.productName,
      volume: item.volume,
      quantity: item.quantity,
      totalPrice: item.totalPrice
    }))).catch(err => console.error('Failed to send order notification:', err))
    
    return c.json({ order, items: orderItems }, 201)
  } catch (error) {
    console.error('Error creating order:', error)
    return c.json({ error: 'Failed to create order' }, 500)
  }
})

// PUT update order
app.put('/orders/:id', zValidator('json', orderUpdateSchema), async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  const data = c.req.valid('json')
  
  try {
    const [existing] = await db.select().from(schema.orders).where(eq(schema.orders.id, id))
    if (!existing) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    const updateData: Record<string, unknown> = { ...data, updatedAt: sql`datetime('now')` }
    
    // Set status timestamps
    if (data.status) {
      const timestampField = {
        processing: 'processedAt',
        paid: 'paidAt',
        shipped: 'shippedAt',
        delivered: 'deliveredAt',
        cancelled: 'cancelledAt'
      }[data.status]
      
      if (timestampField) {
        updateData[timestampField] = sql`datetime('now')`
      }
      
      // If order is delivered, award bonus points
      if (data.status === 'delivered' && existing.userId && existing.status !== 'delivered') {
        const [pointsPerHryvnia] = await db.select().from(schema.bonusRules)
          .where(and(
            eq(schema.bonusRules.ruleKey, 'points_per_hryvnia'),
            eq(schema.bonusRules.isActive, true)
          ))
        
        if (pointsPerHryvnia) {
          const bonusEarned = Math.floor(existing.total * pointsPerHryvnia.value)
          
          if (bonusEarned > 0) {
            const [user] = await db.select().from(schema.users).where(eq(schema.users.id, existing.userId))
            const newBalance = user!.bonusPoints + bonusEarned
            
            await db.insert(schema.bonusTransactions).values({
              userId: existing.userId,
              amount: bonusEarned,
              type: 'purchase',
              reason: `Бонус за замовлення ${existing.orderNumber}`,
              orderId: id,
              balanceAfter: newBalance
            })
            
            await db.update(schema.users)
              .set({ 
                bonusPoints: newBalance,
                lastOrderAt: sql`datetime('now')`
              })
              .where(eq(schema.users.id, existing.userId))
            
            updateData.bonusPointsEarned = bonusEarned
          }
        }
      }
    }
    
    const [order] = await db.update(schema.orders)
      .set(updateData)
      .where(eq(schema.orders.id, id))
      .returning()
    
    // Send notifications for status changes
    if (data.status && data.status !== existing.status) {
      sendOrderStatusNotification(db, order, data.status).catch(err => 
        console.error('Failed to send status notification:', err)
      )
    }
    
    return c.json({ order })
  } catch (error) {
    console.error('Error updating order:', error)
    return c.json({ error: 'Failed to update order' }, 500)
  }
})

// ============================================
// PROMO CODES API
// ============================================

const promoCodeCreateSchema = z.object({
  code: z.string().min(1).max(50).transform(s => s.toUpperCase()),
  discountType: z.enum(['percentage', 'fixed', 'free_shipping', 'free_product']),
  discountValue: z.number().positive(),
  freeProductId: z.number().optional(),
  minOrder: z.number().optional(),
  maxUses: z.number().int().positive().optional(),
  maxUsesPerUser: z.number().int().positive().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional()
})

const promoCodeUpdateSchema = promoCodeCreateSchema.partial()

// GET all promo codes
app.get('/promo-codes', async (c) => {
  const db = getDb(c.env)
  const { active, search } = c.req.query()
  
  try {
    let conditions = []
    
    if (active !== undefined) {
      conditions.push(eq(schema.promoCodes.isActive, active === 'true'))
    }
    
    if (search) {
      conditions.push(like(schema.promoCodes.code, `%${search.toUpperCase()}%`))
    }
    
    let query = db.select().from(schema.promoCodes)
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query
    }
    
    const promoCodes = await query.orderBy(desc(schema.promoCodes.createdAt))
    
    return c.json({ promoCodes })
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return c.json({ error: 'Failed to fetch promo codes' }, 500)
  }
})

// GET promo code usage statistics
app.get('/promo-codes/:id/usage', async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  
  try {
    const [promoCode] = await db.select().from(schema.promoCodes).where(eq(schema.promoCodes.id, id))
    if (!promoCode) {
      return c.json({ error: 'Promo code not found' }, 404)
    }
    
    const usage = await db.select({
      id: schema.promoCodeUsage.id,
      orderId: schema.promoCodeUsage.orderId,
      userId: schema.promoCodeUsage.userId,
      discountAmount: schema.promoCodeUsage.discountAmount,
      usedAt: schema.promoCodeUsage.usedAt,
      orderNumber: schema.orders.orderNumber,
      userName: schema.users.name
    })
      .from(schema.promoCodeUsage)
      .leftJoin(schema.orders, eq(schema.promoCodeUsage.orderId, schema.orders.id))
      .leftJoin(schema.users, eq(schema.promoCodeUsage.userId, schema.users.id))
      .where(eq(schema.promoCodeUsage.promoCodeId, id))
      .orderBy(desc(schema.promoCodeUsage.usedAt))
    
    const [stats] = await db.select({
      totalUsage: count(),
      totalDiscount: sum(schema.promoCodeUsage.discountAmount)
    }).from(schema.promoCodeUsage).where(eq(schema.promoCodeUsage.promoCodeId, id))
    
    return c.json({ promoCode, usage, stats })
  } catch (error) {
    console.error('Error fetching promo code usage:', error)
    return c.json({ error: 'Failed to fetch promo code usage' }, 500)
  }
})

// POST validate promo code
app.post('/promo-codes/validate', zValidator('json', z.object({
  code: z.string(),
  orderTotal: z.number().optional(),
  userId: z.number().optional()
})), async (c) => {
  const db = getDb(c.env)
  const { code, orderTotal, userId } = c.req.valid('json')
  
  try {
    const [promo] = await db.select().from(schema.promoCodes)
      .where(eq(schema.promoCodes.code, code.toUpperCase()))
    
    if (!promo) {
      return c.json({ valid: false, error: 'Промокод не знайдено' })
    }
    
    if (!promo.isActive) {
      return c.json({ valid: false, error: 'Промокод неактивний' })
    }
    
    const now = new Date().toISOString()
    
    if (promo.startsAt && promo.startsAt > now) {
      return c.json({ valid: false, error: 'Промокод ще не активний' })
    }
    
    if (promo.expiresAt && promo.expiresAt < now) {
      return c.json({ valid: false, error: 'Промокод прострочений' })
    }
    
    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return c.json({ valid: false, error: 'Промокод вичерпано' })
    }
    
    if (promo.minOrder && orderTotal && orderTotal < promo.minOrder) {
      return c.json({ valid: false, error: `Мінімальна сума замовлення: ${promo.minOrder}₴` })
    }
    
    // Check per-user limit
    if (promo.maxUsesPerUser && userId) {
      const [{ count: userUsage }] = await db.select({ count: count() })
        .from(schema.promoCodeUsage)
        .where(and(
          eq(schema.promoCodeUsage.promoCodeId, promo.id),
          eq(schema.promoCodeUsage.userId, userId)
        ))
      
      if (userUsage >= promo.maxUsesPerUser) {
        return c.json({ valid: false, error: 'Ви вже використали цей промокод' })
      }
    }
    
    // Calculate discount
    let discountAmount = 0
    if (orderTotal) {
      if (promo.discountType === 'percentage') {
        discountAmount = orderTotal * (promo.discountValue / 100)
      } else if (promo.discountType === 'fixed') {
        discountAmount = Math.min(promo.discountValue, orderTotal)
      }
    }
    
    return c.json({
      valid: true,
      promoCode: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        minOrder: promo.minOrder
      },
      discountAmount
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return c.json({ error: 'Failed to validate promo code' }, 500)
  }
})

// POST create promo code
app.post('/promo-codes', zValidator('json', promoCodeCreateSchema), async (c) => {
  const db = getDb(c.env)
  const data = c.req.valid('json')
  
  try {
    const [existing] = await db.select().from(schema.promoCodes).where(eq(schema.promoCodes.code, data.code))
    if (existing) {
      return c.json({ error: 'Promo code already exists' }, 400)
    }
    
    const [promoCode] = await db.insert(schema.promoCodes).values(data).returning()
    return c.json({ promoCode }, 201)
  } catch (error) {
    console.error('Error creating promo code:', error)
    return c.json({ error: 'Failed to create promo code' }, 500)
  }
})

// PUT update promo code
app.put('/promo-codes/:id', zValidator('json', promoCodeUpdateSchema), async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  const data = c.req.valid('json')
  
  try {
    const [existing] = await db.select().from(schema.promoCodes).where(eq(schema.promoCodes.id, id))
    if (!existing) {
      return c.json({ error: 'Promo code not found' }, 404)
    }
    
    if (data.code && data.code !== existing.code) {
      const [duplicate] = await db.select().from(schema.promoCodes).where(eq(schema.promoCodes.code, data.code))
      if (duplicate) {
        return c.json({ error: 'Promo code already exists' }, 400)
      }
    }
    
    const [promoCode] = await db.update(schema.promoCodes)
      .set({ ...data, updatedAt: sql`datetime('now')` })
      .where(eq(schema.promoCodes.id, id))
      .returning()
    
    return c.json({ promoCode })
  } catch (error) {
    console.error('Error updating promo code:', error)
    return c.json({ error: 'Failed to update promo code' }, 500)
  }
})

// DELETE promo code
app.delete('/promo-codes/:id', async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  
  try {
    const [promoCode] = await db.delete(schema.promoCodes).where(eq(schema.promoCodes.id, id)).returning()
    
    if (!promoCode) {
      return c.json({ error: 'Promo code not found' }, 404)
    }
    
    return c.json({ message: 'Promo code deleted successfully' })
  } catch (error) {
    console.error('Error deleting promo code:', error)
    return c.json({ error: 'Failed to delete promo code' }, 500)
  }
})

// ============================================
// BONUS SYSTEM API
// ============================================

// GET bonus rules
app.get('/bonuses/rules', async (c) => {
  const db = getDb(c.env)
  
  try {
    const rules = await db.select().from(schema.bonusRules)
    return c.json({ rules })
  } catch (error) {
    console.error('Error fetching bonus rules:', error)
    return c.json({ error: 'Failed to fetch bonus rules' }, 500)
  }
})

// PUT update bonus rule
app.put('/bonuses/rules/:key', zValidator('json', z.object({
  value: z.number(),
  isActive: z.boolean().optional(),
  description: z.string().optional()
})), async (c) => {
  const db = getDb(c.env)
  const key = c.req.param('key')
  const data = c.req.valid('json')
  
  try {
    const [existing] = await db.select().from(schema.bonusRules).where(eq(schema.bonusRules.ruleKey, key))
    
    if (existing) {
      const [rule] = await db.update(schema.bonusRules)
        .set({ ...data, updatedAt: sql`datetime('now')` })
        .where(eq(schema.bonusRules.ruleKey, key))
        .returning()
      return c.json({ rule })
    } else {
      // Create new rule
      const [rule] = await db.insert(schema.bonusRules).values({
        ruleKey: key,
        ruleName: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: data.value,
        isActive: data.isActive ?? true,
        description: data.description
      }).returning()
      return c.json({ rule }, 201)
    }
  } catch (error) {
    console.error('Error updating bonus rule:', error)
    return c.json({ error: 'Failed to update bonus rule' }, 500)
  }
})

// GET bonus transactions (admin)
app.get('/bonuses/transactions', async (c) => {
  const db = getDb(c.env)
  const { userId, type, limit, offset } = c.req.query()
  
  try {
    let conditions = []
    
    if (userId) {
      conditions.push(eq(schema.bonusTransactions.userId, parseInt(userId)))
    }
    
    if (type && ['signup', 'referral', 'purchase', 'birthday', 'manual', 'redemption'].includes(type)) {
      conditions.push(eq(schema.bonusTransactions.type, type as schema.BonusType))
    }
    
    let query = db.select({
      id: schema.bonusTransactions.id,
      userId: schema.bonusTransactions.userId,
      amount: schema.bonusTransactions.amount,
      type: schema.bonusTransactions.type,
      reason: schema.bonusTransactions.reason,
      orderId: schema.bonusTransactions.orderId,
      balanceAfter: schema.bonusTransactions.balanceAfter,
      createdAt: schema.bonusTransactions.createdAt,
      userName: schema.users.name,
      userEmail: schema.users.email
    })
      .from(schema.bonusTransactions)
      .leftJoin(schema.users, eq(schema.bonusTransactions.userId, schema.users.id))
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query
    }
    
    query = query.orderBy(desc(schema.bonusTransactions.createdAt)) as typeof query
    
    if (limit) query = query.limit(parseInt(limit)) as typeof query
    if (offset) query = query.offset(parseInt(offset)) as typeof query
    
    const transactions = await query
    
    return c.json({ transactions })
  } catch (error) {
    console.error('Error fetching bonus transactions:', error)
    return c.json({ error: 'Failed to fetch bonus transactions' }, 500)
  }
})

// ============================================
// REVIEWS API
// ============================================

const reviewCreateSchema = z.object({
  productId: z.number(),
  userId: z.number().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  text: z.string().optional(),
  reviewerName: z.string().optional()
})

// GET reviews for product
app.get('/reviews', async (c) => {
  const db = getDb(c.env)
  const { productId, approved, limit, offset } = c.req.query()
  
  try {
    let conditions = []
    
    if (productId) {
      conditions.push(eq(schema.reviews.productId, parseInt(productId)))
    }
    
    if (approved !== undefined) {
      conditions.push(eq(schema.reviews.isApproved, approved === 'true'))
    }
    
    let query = db.select().from(schema.reviews)
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query
    }
    
    query = query.orderBy(desc(schema.reviews.createdAt)) as typeof query
    
    if (limit) query = query.limit(parseInt(limit)) as typeof query
    if (offset) query = query.offset(parseInt(offset)) as typeof query
    
    const reviews = await query
    
    return c.json({ reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return c.json({ error: 'Failed to fetch reviews' }, 500)
  }
})

// POST create review
app.post('/reviews', zValidator('json', reviewCreateSchema), async (c) => {
  const db = getDb(c.env)
  const data = c.req.valid('json')
  
  try {
    // Verify product exists
    const [product] = await db.select().from(schema.products).where(eq(schema.products.id, data.productId))
    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }
    
    const [review] = await db.insert(schema.reviews).values(data).returning()
    return c.json({ review }, 201)
  } catch (error) {
    console.error('Error creating review:', error)
    return c.json({ error: 'Failed to create review' }, 500)
  }
})

// PUT approve/reject review
app.put('/reviews/:id', zValidator('json', z.object({
  isApproved: z.boolean()
})), async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  const { isApproved } = c.req.valid('json')
  
  try {
    const [review] = await db.update(schema.reviews)
      .set({ isApproved })
      .where(eq(schema.reviews.id, id))
      .returning()
    
    if (!review) {
      return c.json({ error: 'Review not found' }, 404)
    }
    
    return c.json({ review })
  } catch (error) {
    console.error('Error updating review:', error)
    return c.json({ error: 'Failed to update review' }, 500)
  }
})

// DELETE review
app.delete('/reviews/:id', async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  
  try {
    const [review] = await db.delete(schema.reviews).where(eq(schema.reviews.id, id)).returning()
    
    if (!review) {
      return c.json({ error: 'Review not found' }, 404)
    }
    
    return c.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error deleting review:', error)
    return c.json({ error: 'Failed to delete review' }, 500)
  }
})

// ============================================
// PAYMENT API (Monobank)
// ============================================

// Monobank API constants
const MONOBANK_API_URL = 'https://api.monobank.ua/api/merchant/invoice'

interface MonobankInvoiceRequest {
  amount: number
  ccy?: number
  merchantPaymInfo?: {
    reference?: string
    destination?: string
    comment?: string
    basketOrder?: Array<{
      name: string
      qty: number
      sum: number
      unit?: string
    }>
  }
  redirectUrl?: string
  webHookUrl?: string
  validity?: number
  paymentType?: 'debit' | 'hold'
}

// Create payment invoice
const createPaymentInvoiceSchema = z.object({
  orderId: z.number()
})

app.post('/payment/create-invoice', zValidator('json', createPaymentInvoiceSchema), async (c) => {
  const db = getDb(c.env)
  const { orderId } = c.req.valid('json')
  const monobankToken = c.env.MONOBANK_TOKEN
  
  try {
    // Check if Monobank token is configured
    if (!monobankToken) {
      return c.json({ 
        error: 'Payment system not configured',
        message: 'MONOBANK_TOKEN environment variable is not set'
      }, 503)
    }
    
    // Get order details
    const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, orderId))
    if (!order) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    // Check if order is already paid
    if (order.paymentStatus === 'completed') {
      return c.json({ error: 'Order is already paid' }, 400)
    }
    
    // Get order items
    const items = await db.select().from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, orderId))
    
    // Build invoice request
    const amountInKopecks = Math.round(order.total * 100)
    const baseUrl = c.env.VITE_BASE_URL || 'https://boostertea.com.ua'
    
    const invoiceRequest: MonobankInvoiceRequest = {
      amount: amountInKopecks,
      ccy: 980, // UAH
      merchantPaymInfo: {
        reference: order.orderNumber,
        destination: `Оплата замовлення ${order.orderNumber}`,
        comment: `BoosterTea - Замовлення ${order.orderNumber}`,
        basketOrder: items.map(item => ({
          name: item.productName,
          qty: item.quantity,
          sum: Math.round(item.totalPrice * 100),
          unit: 'шт'
        }))
      },
      redirectUrl: `${baseUrl}/order-success?order=${order.orderNumber}`,
      webHookUrl: `${baseUrl}/api/payment/webhook`,
      validity: 3600, // 1 hour
      paymentType: 'debit'
    }
    
    // Create invoice via Monobank API
    const response = await fetch(`${MONOBANK_API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': monobankToken
      },
      body: JSON.stringify(invoiceRequest)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Monobank API error:', errorText)
      return c.json({ error: 'Failed to create payment invoice', details: errorText }, 500)
    }
    
    const invoiceData = await response.json() as { invoiceId: string; pageUrl: string }
    
    // Update order with payment ID
    await db.update(schema.orders)
      .set({ 
        paymentId: invoiceData.invoiceId,
        paymentMethod: 'monobank',
        paymentStatus: 'processing',
        updatedAt: sql`datetime('now')`
      })
      .where(eq(schema.orders.id, orderId))
    
    return c.json({
      invoiceId: invoiceData.invoiceId,
      pageUrl: invoiceData.pageUrl,
      orderNumber: order.orderNumber
    })
  } catch (error) {
    console.error('Error creating payment invoice:', error)
    return c.json({ error: 'Failed to create payment' }, 500)
  }
})

// Payment webhook (receives status updates from Monobank)
app.post('/payment/webhook', async (c) => {
  const db = getDb(c.env)
  
  try {
    const payload = await c.req.json() as {
      invoiceId: string
      status: string
      failureReason?: string
      reference?: string
      amount: number
      modifiedDate: string
    }
    
    console.log('Monobank webhook received:', payload)
    
    // Find order by payment ID
    const [order] = await db.select().from(schema.orders)
      .where(eq(schema.orders.paymentId, payload.invoiceId))
    
    if (!order) {
      console.error('Order not found for invoice:', payload.invoiceId)
      return c.json({ error: 'Order not found' }, 404)
    }
    
    // Map Monobank status to payment status
    const paymentStatusMap: Record<string, 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'> = {
      'created': 'processing',
      'processing': 'processing',
      'hold': 'completed',
      'success': 'completed',
      'failure': 'failed',
      'expired': 'failed',
      'reversed': 'refunded'
    }
    
    // Map Monobank status to order status
    const orderStatusMap: Record<string, 'pending' | 'processing' | 'paid' | 'cancelled'> = {
      'success': 'paid',
      'hold': 'paid',
      'failure': 'cancelled',
      'expired': 'cancelled',
      'reversed': 'cancelled'
    }
    
    const newPaymentStatus = paymentStatusMap[payload.status] || 'pending'
    const newOrderStatus = orderStatusMap[payload.status]
    
    const updateData: Record<string, unknown> = {
      paymentStatus: newPaymentStatus,
      updatedAt: sql`datetime('now')`
    }
    
    if (newOrderStatus) {
      updateData.status = newOrderStatus
      
      if (newOrderStatus === 'paid') {
        updateData.paidAt = sql`datetime('now')`
      } else if (newOrderStatus === 'cancelled') {
        updateData.cancelledAt = sql`datetime('now')`
      }
    }
    
    // Update order
    await db.update(schema.orders)
      .set(updateData)
      .where(eq(schema.orders.id, order.id))
    
    // If payment successful and user exists, award bonus points
    if (newPaymentStatus === 'completed' && order.userId) {
      const [pointsPerHryvnia] = await db.select().from(schema.bonusRules)
        .where(and(
          eq(schema.bonusRules.ruleKey, 'points_per_hryvnia'),
          eq(schema.bonusRules.isActive, true)
        ))
      
      if (pointsPerHryvnia) {
        const bonusEarned = Math.floor(order.total * pointsPerHryvnia.value)
        
        if (bonusEarned > 0) {
          const [user] = await db.select().from(schema.users).where(eq(schema.users.id, order.userId))
          if (user) {
            const newBalance = user.bonusPoints + bonusEarned
            
            await db.insert(schema.bonusTransactions).values({
              userId: order.userId,
              amount: bonusEarned,
              type: 'purchase',
              reason: `Бонус за замовлення ${order.orderNumber}`,
              orderId: order.id,
              balanceAfter: newBalance
            })
            
            await db.update(schema.users)
              .set({ 
                bonusPoints: newBalance,
                lastOrderAt: sql`datetime('now')`
              })
              .where(eq(schema.users.id, order.userId))
            
            await db.update(schema.orders)
              .set({ bonusPointsEarned: bonusEarned })
              .where(eq(schema.orders.id, order.id))
          }
        }
      }
    }
    
    return c.json({ status: 'ok' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return c.json({ error: 'Webhook processing failed' }, 500)
  }
})

// Get payment status
app.get('/payment/status/:invoiceId', async (c) => {
  const db = getDb(c.env)
  const invoiceId = c.req.param('invoiceId')
  const monobankToken = c.env.MONOBANK_TOKEN
  
  try {
    // Get order by payment ID
    const [order] = await db.select().from(schema.orders)
      .where(eq(schema.orders.paymentId, invoiceId))
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    // If Monobank token available, fetch current status
    if (monobankToken) {
      try {
        const response = await fetch(`${MONOBANK_API_URL}/status?invoiceId=${invoiceId}`, {
          method: 'GET',
          headers: {
            'X-Token': monobankToken
          }
        })
        
        if (response.ok) {
          const statusData = await response.json() as { status: string; failureReason?: string }
          return c.json({
            invoiceId,
            orderNumber: order.orderNumber,
            monobankStatus: statusData.status,
            paymentStatus: order.paymentStatus,
            orderStatus: order.status,
            failureReason: statusData.failureReason
          })
        }
      } catch (e) {
        console.error('Failed to fetch Monobank status:', e)
      }
    }
    
    // Return stored status
    return c.json({
      invoiceId,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status
    })
  } catch (error) {
    console.error('Error fetching payment status:', error)
    return c.json({ error: 'Failed to fetch payment status' }, 500)
  }
})

// ============================================
// NOVA POSHTA API (Proxy to avoid CORS)
// ============================================

const NOVA_POSHTA_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

// Nova Poshta proxy endpoint
app.post('/novaposhta', async (c) => {
  const novaPoshtaApiKey = c.env.NOVA_POSHTA_API_KEY;
  
  if (!novaPoshtaApiKey) {
    return c.json({ 
      success: false, 
      data: [],
      errors: ['Nova Poshta API key not configured'],
      warnings: [],
      info: {}
    }, 503);
  }
  
  try {
    const body = await c.req.json() as {
      modelName: string;
      calledMethod: string;
      methodProperties?: Record<string, unknown>;
    };
    
    const response = await fetch(NOVA_POSHTA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: novaPoshtaApiKey,
        modelName: body.modelName,
        calledMethod: body.calledMethod,
        methodProperties: body.methodProperties || {},
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Nova Poshta API error: ${response.status}`);
    }
    
    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Nova Poshta API error:', error);
    return c.json({ 
      success: false, 
      data: [],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      warnings: [],
      info: {}
    }, 500);
  }
});

// GET cities by search query
app.post('/novaposhta/cities', async (c) => {
  const novaPoshtaApiKey = c.env.NOVA_POSHTA_API_KEY;
  
  if (!novaPoshtaApiKey) {
    return c.json({ 
      success: false, 
      data: [],
      errors: ['Nova Poshta API key not configured'],
      warnings: [],
      info: {}
    }, 503);
  }
  
  try {
    const { query, limit = 20 } = await c.req.json() as { query: string; limit?: number };
    
    if (!query || query.length < 2) {
      return c.json({ success: true, data: [], errors: [], warnings: [], info: {} });
    }
    
    const response = await fetch(NOVA_POSHTA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: novaPoshtaApiKey,
        modelName: 'Address',
        calledMethod: 'searchSettlements',
        methodProperties: {
          CityName: query,
          Limit: limit,
          Page: 1,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Nova Poshta API error: ${response.status}`);
    }
    
    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Nova Poshta cities search error:', error);
    return c.json({ 
      success: false, 
      data: [],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      warnings: [],
      info: {}
    }, 500);
  }
});

// GET warehouses by city ref
app.post('/novaposhta/warehouses', async (c) => {
  const novaPoshtaApiKey = c.env.NOVA_POSHTA_API_KEY;
  
  if (!novaPoshtaApiKey) {
    return c.json({ 
      success: false, 
      data: [],
      errors: ['Nova Poshta API key not configured'],
      warnings: [],
      info: {}
    }, 503);
  }
  
  try {
    const { cityRef, typeOfWarehouseRef, limit = 500 } = await c.req.json() as { 
      cityRef: string; 
      typeOfWarehouseRef?: string;
      limit?: number;
    };
    
    if (!cityRef) {
      return c.json({ success: true, data: [], errors: [], warnings: [], info: {} });
    }
    
    const methodProperties: Record<string, unknown> = {
      CityRef: cityRef,
      Limit: limit,
      Page: 1,
    };
    
    if (typeOfWarehouseRef) {
      methodProperties.TypeOfWarehouseRef = typeOfWarehouseRef;
    }
    
    const response = await fetch(NOVA_POSHTA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: novaPoshtaApiKey,
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Nova Poshta API error: ${response.status}`);
    }
    
    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Nova Poshta warehouses fetch error:', error);
    return c.json({ 
      success: false, 
      data: [],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      warnings: [],
      info: {}
    }, 500);
  }
});

// Track package by TTN
app.post('/novaposhta/track', async (c) => {
  const novaPoshtaApiKey = c.env.NOVA_POSHTA_API_KEY;
  
  if (!novaPoshtaApiKey) {
    return c.json({ 
      success: false, 
      data: [],
      errors: ['Nova Poshta API key not configured'],
      warnings: [],
      info: {}
    }, 503);
  }
  
  try {
    const { ttn } = await c.req.json() as { ttn: string };
    
    if (!ttn) {
      return c.json({ success: false, data: [], errors: ['TTN required'], warnings: [], info: {} }, 400);
    }
    
    const response = await fetch(NOVA_POSHTA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: novaPoshtaApiKey,
        modelName: 'TrackingDocument',
        calledMethod: 'getStatusDocuments',
        methodProperties: {
          Documents: [{ DocumentNumber: ttn }],
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Nova Poshta API error: ${response.status}`);
    }
    
    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Nova Poshta tracking error:', error);
    return c.json({ 
      success: false, 
      data: [],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      warnings: [],
      info: {}
    }, 500);
  }
});

// ============================================
// DASHBOARD STATS API (Admin)
// ============================================

app.get('/stats/dashboard', async (c) => {
  const db = getDb(c.env)
  
  try {
    // Total orders
    const [orderStats] = await db.select({
      totalOrders: count(),
      totalRevenue: sum(schema.orders.total)
    }).from(schema.orders).where(eq(schema.orders.status, 'delivered'))
    
    // Pending orders
    const [pendingStats] = await db.select({
      count: count()
    }).from(schema.orders).where(eq(schema.orders.status, 'pending'))
    
    // Total customers
    const [customerStats] = await db.select({
      count: count()
    }).from(schema.users).where(eq(schema.users.isAdmin, false))
    
    // Total products
    const [productStats] = await db.select({
      count: count()
    }).from(schema.products).where(eq(schema.products.isActive, true))
    
    // Recent orders
    const recentOrders = await db.select().from(schema.orders)
      .orderBy(desc(schema.orders.createdAt))
      .limit(5)
    
    // Top products by order count
    const topProducts = await db.select({
      productId: schema.orderItems.productId,
      productName: schema.orderItems.productName,
      totalQuantity: sum(schema.orderItems.quantity),
      totalRevenue: sum(schema.orderItems.totalPrice)
    })
      .from(schema.orderItems)
      .groupBy(schema.orderItems.productId, schema.orderItems.productName)
      .orderBy(desc(sum(schema.orderItems.quantity)))
      .limit(5)
    
    return c.json({
      stats: {
        totalOrders: orderStats?.totalOrders || 0,
        totalRevenue: orderStats?.totalRevenue || 0,
        pendingOrders: pendingStats?.count || 0,
        totalCustomers: customerStats?.count || 0,
        activeProducts: productStats?.count || 0
      },
      recentOrders,
      topProducts
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return c.json({ error: 'Failed to fetch dashboard stats' }, 500)
  }
})

// ============================================
// NOTIFICATIONS API
// ============================================

// GET notification settings
app.get('/notifications/settings', async (c) => {
  const db = getDb(c.env)
  
  try {
    // Get or create settings
    let [settings] = await db.select().from(schema.notificationSettings).limit(1)
    
    if (!settings) {
      // Create default settings
      const [newSettings] = await db.insert(schema.notificationSettings).values({
        telegramEnabled: false,
        newOrderEnabled: true,
        paymentReceivedEnabled: true,
        orderShippedEnabled: true,
        emailEnabled: false
      }).returning()
      settings = newSettings
    }
    
    // Mask the bot token for security (show only last 4 characters)
    const maskedToken = settings.telegramBotToken 
      ? `${'•'.repeat(Math.max(0, settings.telegramBotToken.length - 4))}${settings.telegramBotToken.slice(-4)}`
      : null
    
    return c.json({
      settings: {
        ...settings,
        telegramBotToken: maskedToken,
        hasToken: !!settings.telegramBotToken
      }
    })
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return c.json({ error: 'Failed to fetch notification settings' }, 500)
  }
})

// PUT update notification settings
app.put('/notifications/settings', zValidator('json', z.object({
  telegramBotToken: z.string().optional(),
  telegramChatId: z.string().optional(),
  telegramEnabled: z.boolean().optional(),
  newOrderEnabled: z.boolean().optional(),
  paymentReceivedEnabled: z.boolean().optional(),
  orderShippedEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  emailRecipient: z.string().email().optional().nullable()
})), async (c) => {
  const db = getDb(c.env)
  const data = c.req.valid('json')
  
  try {
    // Get existing settings
    let [existing] = await db.select().from(schema.notificationSettings).limit(1)
    
    if (!existing) {
      // Create new settings
      const [settings] = await db.insert(schema.notificationSettings).values({
        ...data,
        updatedAt: sql`datetime('now')`
      }).returning()
      
      return c.json({ settings, message: 'Settings created' })
    }
    
    // Update existing settings
    // If telegramBotToken is empty string or starts with •, don't update it
    const updateData = { ...data, updatedAt: sql`datetime('now')` }
    if (!data.telegramBotToken || data.telegramBotToken.startsWith('•')) {
      delete updateData.telegramBotToken
    }
    
    const [settings] = await db.update(schema.notificationSettings)
      .set(updateData)
      .where(eq(schema.notificationSettings.id, existing.id))
      .returning()
    
    return c.json({ settings, message: 'Settings updated' })
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return c.json({ error: 'Failed to update notification settings' }, 500)
  }
})

// POST send Telegram notification
app.post('/notifications/telegram', zValidator('json', z.object({
  message: z.string().min(1),
  parseMode: z.enum(['MarkdownV2', 'HTML', 'Markdown']).optional().default('MarkdownV2'),
  type: z.string().optional().default('manual'),
  orderId: z.number().optional()
})), async (c) => {
  const db = getDb(c.env)
  const { message, parseMode, type, orderId } = c.req.valid('json')
  
  try {
    // Get settings
    const [settings] = await db.select().from(schema.notificationSettings).limit(1)
    
    if (!settings || !settings.telegramBotToken || !settings.telegramChatId) {
      return c.json({ 
        success: false, 
        error: 'Telegram not configured. Please set bot token and chat ID in settings.' 
      }, 400)
    }
    
    if (!settings.telegramEnabled) {
      return c.json({ 
        success: false, 
        error: 'Telegram notifications are disabled.' 
      }, 400)
    }
    
    // Send to Telegram
    const response = await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: settings.telegramChatId,
        text: message,
        parse_mode: parseMode,
      }),
    })
    
    const result = await response.json() as { ok: boolean; description?: string }
    
    // Log the notification
    await db.insert(schema.notificationLog).values({
      type,
      channel: 'telegram',
      orderId,
      success: result.ok,
      errorMessage: result.ok ? null : result.description,
      messagePreview: message.substring(0, 200)
    })
    
    if (!result.ok) {
      return c.json({ 
        success: false, 
        error: result.description || 'Failed to send message' 
      }, 500)
    }
    
    return c.json({ success: true, message: 'Notification sent successfully' })
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    }, 500)
  }
})

// POST test Telegram notification
app.post('/notifications/telegram/test', async (c) => {
  const db = getDb(c.env)
  
  try {
    const [settings] = await db.select().from(schema.notificationSettings).limit(1)
    
    if (!settings || !settings.telegramBotToken || !settings.telegramChatId) {
      return c.json({ 
        success: false, 
        error: 'Telegram not configured. Please set bot token and chat ID first.' 
      }, 400)
    }
    
    const testMessage = `🧪 *Тестове повідомлення*\n\n` +
      `✅ Telegram сповіщення налаштовані правильно\\!\n\n` +
      `📦 Ви отримуватимете сповіщення про:\n` +
      `  • Нові замовлення\n` +
      `  • Отримані платежі\n` +
      `  • Відправлені замовлення\n\n` +
      `🍵 *BoosterTea Admin*`
    
    const response = await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: settings.telegramChatId,
        text: testMessage,
        parse_mode: 'MarkdownV2',
      }),
    })
    
    const result = await response.json() as { ok: boolean; description?: string }
    
    // Log the test notification
    await db.insert(schema.notificationLog).values({
      type: 'test',
      channel: 'telegram',
      success: result.ok,
      errorMessage: result.ok ? null : result.description,
      messagePreview: 'Test notification'
    })
    
    if (!result.ok) {
      return c.json({ 
        success: false, 
        error: result.description || 'Failed to send test message' 
      }, 500)
    }
    
    return c.json({ success: true, message: 'Test notification sent successfully!' })
  } catch (error) {
    console.error('Error sending test notification:', error)
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    }, 500)
  }
})

// GET notification log
app.get('/notifications/log', async (c) => {
  const db = getDb(c.env)
  const { limit = '20', offset = '0', type, channel } = c.req.query()
  
  try {
    let conditions = []
    
    if (type) {
      conditions.push(eq(schema.notificationLog.type, type))
    }
    
    if (channel) {
      conditions.push(eq(schema.notificationLog.channel, channel))
    }
    
    let query = db.select().from(schema.notificationLog)
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query
    }
    
    const logs = await query
      .orderBy(desc(schema.notificationLog.sentAt))
      .limit(parseInt(limit))
      .offset(parseInt(offset))
    
    const [{ total }] = await db.select({ total: count() }).from(schema.notificationLog)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
    
    return c.json({ logs, total })
  } catch (error) {
    console.error('Error fetching notification log:', error)
    return c.json({ error: 'Failed to fetch notification log' }, 500)
  }
})

// Helper function to send new order notification
const sendNewOrderNotification = async (
  db: ReturnType<typeof getDb>,
  order: schema.Order,
  items: { productName: string; volume: string; quantity: number; totalPrice: number }[]
) => {
  try {
    const [settings] = await db.select().from(schema.notificationSettings).limit(1)
    
    if (!settings?.telegramEnabled || !settings?.newOrderEnabled || 
        !settings?.telegramBotToken || !settings?.telegramChatId) {
      return
    }
    
    const itemsList = items
      .map(item => `  • ${item.productName} ${item.volume} x${item.quantity} — ${item.totalPrice.toLocaleString()}₴`)
      .join('\n')
    
    // Build message without markdown for reliability
    let message = `📦 Нове замовлення ${order.orderNumber}\n\n`
    message += `👤 Клієнт: ${order.customerName || 'Не вказано'}\n`
    message += `📱 Телефон: ${order.customerPhone || 'Не вказано'}\n`
    
    if (order.customerEmail) {
      message += `📧 Email: ${order.customerEmail}\n`
    }
    
    message += `\n🍵 Товари:\n${itemsList}\n`
    message += `\n💰 Сума: ${order.total.toLocaleString()}₴`
    
    if (order.promoCode) {
      message += `\n🏷️ Промокод: ${order.promoCode}`
    }
    
    if (order.bonusPointsUsed > 0) {
      message += `\n⭐ Бонусів використано: ${order.bonusPointsUsed}`
    }
    
    if (order.deliveryMethod) {
      message += `\n\n🚚 Доставка: ${order.deliveryMethod}`
      if (order.deliveryCity) {
        message += `\n📍 Місто: ${order.deliveryCity}`
      }
      if (order.deliveryWarehouse) {
        message += `\n🏢 Відділення: ${order.deliveryWarehouse}`
      }
    }
    
    const response = await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: settings.telegramChatId,
        text: message,
      }),
    })
    
    const result = await response.json() as { ok: boolean; description?: string }
    
    // Log the notification
    await db.insert(schema.notificationLog).values({
      type: 'new_order',
      channel: 'telegram',
      orderId: order.id,
      success: result.ok,
      errorMessage: result.ok ? null : result.description,
      messagePreview: message.substring(0, 200)
    })
  } catch (error) {
    console.error('Error sending order notification:', error)
  }
}

// Helper function to send order status update notification
const sendOrderStatusNotification = async (
  db: ReturnType<typeof getDb>,
  order: schema.Order,
  status: string
) => {
  try {
    const [settings] = await db.select().from(schema.notificationSettings).limit(1)
    
    if (!settings?.telegramEnabled || !settings?.telegramBotToken || !settings?.telegramChatId) {
      return
    }
    
    let message = ''
    let notificationType = ''
    let shouldSend = false
    
    if (status === 'paid' && settings.paymentReceivedEnabled) {
      notificationType = 'payment_received'
      shouldSend = true
      message = `💳 Оплата отримана\n\n`
      message += `📦 Замовлення: ${order.orderNumber}\n`
      message += `👤 Клієнт: ${order.customerName || 'Не вказано'}\n`
      message += `💰 Сума: ${order.total.toLocaleString()}₴\n`
      message += `💳 Спосіб: ${order.paymentMethod || 'Monobank'}`
    } else if (status === 'shipped' && settings.orderShippedEnabled) {
      notificationType = 'order_shipped'
      shouldSend = true
      message = `🚚 Замовлення відправлено\n\n`
      message += `📦 Замовлення: ${order.orderNumber}\n`
      message += `👤 Клієнт: ${order.customerName || 'Не вказано'}\n`
      message += `📱 Телефон: ${order.customerPhone || 'Не вказано'}\n`
      if (order.deliveryCity) {
        message += `📍 Місто: ${order.deliveryCity}\n`
      }
      if (order.novaPoshtatTn) {
        message += `📋 ТТН: ${order.novaPoshtatTn}`
      }
    }
    
    if (!shouldSend || !message) return
    
    const response = await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: settings.telegramChatId,
        text: message,
      }),
    })
    
    const result = await response.json() as { ok: boolean; description?: string }
    
    // Log the notification
    await db.insert(schema.notificationLog).values({
      type: notificationType,
      channel: 'telegram',
      orderId: order.id,
      success: result.ok,
      errorMessage: result.ok ? null : result.description,
      messagePreview: message.substring(0, 200)
    })
  } catch (error) {
    console.error('Error sending status notification:', error)
  }
}

export default app;

// ============================================
// KEYCRM API
// ============================================

let keycrmApiKey: string | null = null;
const KEYCRM_API_BASE = 'https://openapi.keycrm.app/v1';

// Check KeyCRM configuration status
app.get('/keycrm/status', async (c) => {
  return c.json({
    configured: !!keycrmApiKey,
    hasApiKey: !!keycrmApiKey,
  });
});

// Configure KeyCRM API key
app.post('/keycrm/configure', zValidator('json', z.object({
  apiKey: z.string().min(1)
})), async (c) => {
  const { apiKey } = c.req.valid('json');
  
  try {
    // Test the API key
    const testResponse = await fetch(`${KEYCRM_API_BASE}/order/status`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (!testResponse.ok) {
      return c.json({ error: 'Invalid API key' }, 400);
    }
    
    keycrmApiKey = apiKey;
    return c.json({ success: true, message: 'KeyCRM configured successfully' });
  } catch (error) {
    console.error('KeyCRM configure error:', error);
    return c.json({ error: 'Failed to configure KeyCRM' }, 500);
  }
});

// Get orders from KeyCRM
app.get('/keycrm/orders', async (c) => {
  if (!keycrmApiKey) {
    return c.json({ error: 'KeyCRM not configured' }, 400);
  }
  
  const { limit = '20', page = '1', include = 'buyer,products,status' } = c.req.query();
  
  try {
    const response = await fetch(`${KEYCRM_API_BASE}/order?limit=${limit}&page=${page}&include=${include}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${keycrmApiKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`KeyCRM API error: ${response.status}`);
    }
    
    const data = await response.json() as { data: any[]; total: number };
    
    const orders = data.data?.map((order: any) => ({
      id: order.id,
      source_uuid: order.source_uuid,
      status_name: order.status?.name || 'Unknown',
      status_color: order.status?.color || '#666666',
      grand_total: order.grand_total || 0,
      buyer_name: order.buyer?.full_name || 'Unknown',
      buyer_phone: order.buyer?.phone || '',
      created_at: order.created_at,
      products_count: order.products?.length || 0,
      payment_status: order.payment_status || 'not_paid',
    })) || [];
    
    return c.json({ data: orders, total: data.total || 0 });
  } catch (error) {
    console.error('KeyCRM orders error:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Get stats from KeyCRM  
app.get('/keycrm/stats', async (c) => {
  if (!keycrmApiKey) {
    return c.json({ error: 'KeyCRM not configured' }, 400);
  }
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const [allOrdersRes, todayOrdersRes, statusesRes] = await Promise.all([
      fetch(`${KEYCRM_API_BASE}/order?limit=1000&include=products,status`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${keycrmApiKey}` },
      }),
      fetch(`${KEYCRM_API_BASE}/order?limit=100&filter[created_between]=${today} 00:00:00,${today} 23:59:59`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${keycrmApiKey}` },
      }),
      fetch(`${KEYCRM_API_BASE}/order/status`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${keycrmApiKey}` },
      }),
    ]);
    
    const allOrders = (await allOrdersRes.json() as { data: any[]; total: number }).data || [];
    const todayOrders = (await todayOrdersRes.json() as { data: any[] }).data || [];
    const statuses = (await statusesRes.json() as { data: any[] }).data || [];
    
    const totalRevenue = allOrders.reduce((sum: number, o: any) => sum + (o.grand_total || 0), 0);
    const revenueToday = todayOrders.reduce((sum: number, o: any) => sum + (o.grand_total || 0), 0);
    
    const statusMap = new Map(statuses.map((s: any) => [s.id, { name: s.name, color: s.color }]));
    const ordersByStatus: Record<string, { count: number; color: string }> = {};
    
    allOrders.forEach((order: any) => {
      const statusInfo = statusMap.get(order.status_id) || { name: 'Unknown', color: '#666666' };
      const statusName = statusInfo.name;
      if (!ordersByStatus[statusName]) {
        ordersByStatus[statusName] = { count: 0, color: statusInfo.color };
      }
      ordersByStatus[statusName].count++;
    });
    
    const productMap = new Map<string, { quantity: number; revenue: number }>();
    allOrders.forEach((order: any) => {
      order.products?.forEach((product: any) => {
        const existing = productMap.get(product.name) || { quantity: 0, revenue: 0 };
        productMap.set(product.name, {
          quantity: existing.quantity + (product.quantity || 1),
          revenue: existing.revenue + ((product.price || 0) * (product.quantity || 1)),
        });
      });
    });
    
    const topProducts = Array.from(productMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return c.json({
      totalOrders: allOrders.length,
      totalRevenue,
      ordersToday: todayOrders.length,
      revenueToday,
      ordersByStatus,
      topProducts,
    });
  } catch (error) {
    console.error('KeyCRM stats error:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// ============================================
// ANALYTICS API (Mock - would integrate with GA4 Data API)
// ============================================

app.get('/analytics/visitors', async (c) => {
  const { range = 'today' } = c.req.query();
  
  // Mock data - in production would use Google Analytics Data API
  // https://developers.google.com/analytics/devguides/reporting/data/v1
  const stats = {
    activeUsers: Math.floor(Math.random() * 20) + 5,
    totalVisitors: {
      today: 847 + Math.floor(Math.random() * 100),
      yesterday: 923,
      week: 5432,
      month: 21456,
    },
    pageViews: {
      today: 2341 + Math.floor(Math.random() * 200),
      week: 15678,
    },
    avgSessionDuration: '3:24',
    bounceRate: 42.5,
    topPages: [
      { page: '/', views: 1234 },
      { page: '/products', views: 892 },
      { page: '/products/pu-erh', views: 654 },
      { page: '/cart', views: 432 },
      { page: '/b2b', views: 321 },
    ],
    trafficSources: [
      { source: 'Instagram', visitors: 342, percentage: 40.4 },
      { source: 'Google', visitors: 256, percentage: 30.2 },
      { source: 'Direct', visitors: 156, percentage: 18.4 },
      { source: 'TikTok', visitors: 67, percentage: 7.9 },
      { source: 'Facebook', visitors: 26, percentage: 3.1 },
    ],
    devices: [
      { device: 'Mobile', percentage: 68 },
      { device: 'Desktop', percentage: 28 },
      { device: 'Tablet', percentage: 4 },
    ],
    countries: [
      { country: '🇺🇦 Україна', visitors: 756 },
      { country: '🇵🇱 Польща', visitors: 45 },
      { country: '🇩🇪 Німеччина', visitors: 23 },
    ],
    realtimeVisitors: Math.floor(Math.random() * 20) + 5,
  };
  
  return c.json(stats);
});

// ============================================
// SOCIAL MEDIA API (Mock - would integrate with platform APIs)
// ============================================

app.get('/social/stats', async (c) => {
  // Mock data - in production would integrate with:
  // - Instagram Basic Display API / Graph API
  // - TikTok Business API
  // - Telegram Bot API for channel stats
  const stats = {
    instagram: {
      followers: 4521,
      followersChange: 127,
      posts: 156,
      engagement: 4.8,
      reach: 12450,
    },
    tiktok: {
      followers: 8934,
      followersChange: 342,
      videos: 67,
      likes: 45600,
      views: 234500,
    },
    telegram: {
      subscribers: 2156,
      subscribersChange: 45,
      messages: 89,
      views: 34500,
      engagement: 68,
    },
  };
  
  return c.json(stats);
});



// ============================================
// BLOG API
// ============================================

const blogPostSchema = z.object({
  slug: z.string().min(1).max(200),
  titleUk: z.string().min(1),
  titleEn: z.string().optional(),
  titleEs: z.string().optional(),
  excerptUk: z.string().optional(),
  excerptEn: z.string().optional(),
  excerptEs: z.string().optional(),
  contentUk: z.string().min(1),
  contentEn: z.string().optional(),
  contentEs: z.string().optional(),
  category: z.string().default('general'),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  authorName: z.string().default('BoosterTea Team'),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  readingTime: z.number().int().positive().default(5),
  metaTitleUk: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescriptionUk: z.string().optional(),
  metaDescriptionEn: z.string().optional(),
  publishedAt: z.string().optional(),
})

// GET /blog/categories
app.get('/blog/categories', async (c) => {
  const db = getDb(c.env)
  try {
    const all = await db.select({ count: sql<number> })
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.isPublished, true))
    
    const byCategory = await db
      .select({
        category: schema.blogPosts.category,
        count: sql<number>
      })
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.isPublished, true))
      .groupBy(schema.blogPosts.category)
      .orderBy(desc(sql))

    return c.json({
      success: true,
      data: {
        all: Number(all[0]?.count ?? 0),
        categories: byCategory.map(r => ({
          slug: r.category,
          name: r.category,
          count: Number(r.count)
        }))
      }
    })
  } catch (e) {
    return c.json({ success: false, error: 'Failed to fetch categories' }, 500)
  }
})

// GET /blog/posts
app.get('/blog/posts', async (c) => {
  const db = getDb(c.env)
  const { category, featured, search, limit = '12', page = '1' } = c.req.query()
  
  try {
    const offset = (parseInt(page) - 1) * parseInt(limit)
    let conditions = [eq(schema.blogPosts.isPublished, true)]
    
    if (category) conditions.push(eq(schema.blogPosts.category, category))
    if (featured === 'true') conditions.push(eq(schema.blogPosts.isFeatured, true))
    
    const whereClause = and(...conditions)
    
    const [posts, countResult] = await Promise.all([
      db.select({
        id: schema.blogPosts.id,
        slug: schema.blogPosts.slug,
        titleUk: schema.blogPosts.titleUk,
        titleEn: schema.blogPosts.titleEn,
        excerptUk: schema.blogPosts.excerptUk,
        excerptEn: schema.blogPosts.excerptEn,
        category: schema.blogPosts.category,
        tags: schema.blogPosts.tags,
        image: schema.blogPosts.image,
        authorName: schema.blogPosts.authorName,
        isFeatured: schema.blogPosts.isFeatured,
        views: schema.blogPosts.views,
        readingTime: schema.blogPosts.readingTime,
        publishedAt: schema.blogPosts.publishedAt,
        createdAt: schema.blogPosts.createdAt,
      })
      .from(schema.blogPosts)
      .where(whereClause)
      .orderBy(desc(schema.blogPosts.publishedAt), desc(schema.blogPosts.createdAt))
      .limit(parseInt(limit))
      .offset(offset),
      db.select({ total: count() }).from(schema.blogPosts).where(whereClause)
    ])

    const total = Number(countResult[0]?.total ?? 0)

    return c.json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    })
  } catch (e) {
    return c.json({ success: false, error: 'Failed to fetch posts' }, 500)
  }
})

// GET /blog/posts/:slug
app.get('/blog/posts/:slug', async (c) => {
  const db = getDb(c.env)
  const { slug } = c.req.param()
  
  try {
    const posts = await db.select()
      .from(schema.blogPosts)
      .where(and(eq(schema.blogPosts.slug, slug), eq(schema.blogPosts.isPublished, true)))
      .limit(1)
    
    if (!posts.length) return c.json({ success: false, error: 'Post not found' }, 404)
    
    const post = posts[0]
    
    // Increment views
    await db.update(schema.blogPosts)
      .set({ views: post.views + 1 })
      .where(eq(schema.blogPosts.id, post.id))

    // Related posts
    const related = await db.select({
      id: schema.blogPosts.id,
      slug: schema.blogPosts.slug,
      titleUk: schema.blogPosts.titleUk,
      titleEn: schema.blogPosts.titleEn,
      excerptUk: schema.blogPosts.excerptUk,
      image: schema.blogPosts.image,
      category: schema.blogPosts.category,
      publishedAt: schema.blogPosts.publishedAt,
      readingTime: schema.blogPosts.readingTime,
    })
    .from(schema.blogPosts)
    .where(and(
      eq(schema.blogPosts.isPublished, true),
      eq(schema.blogPosts.category, post.category),
      sql
    ))
    .orderBy(desc(schema.blogPosts.publishedAt))
    .limit(3)

    return c.json({ success: true, data: { post, related } })
  } catch (e) {
    return c.json({ success: false, error: 'Failed to fetch post' }, 500)
  }
})

// POST /blog/posts (admin)
app.post('/blog/posts', zValidator('json', blogPostSchema), async (c) => {
  const db = getDb(c.env)
  const data = c.req.valid('json')
  
  try {
    const result = await db.insert(schema.blogPosts).values({
      ...data,
      tags: JSON.stringify(data.tags),
      publishedAt: data.isPublished && !data.publishedAt ? new Date().toISOString() : data.publishedAt,
    }).returning()
    return c.json({ success: true, data: result[0] }, 201)
  } catch (e: any) {
    if (e?.message?.includes('UNIQUE')) {
      return c.json({ success: false, error: 'Slug already exists' }, 409)
    }
    return c.json({ success: false, error: 'Failed to create post' }, 500)
  }
})

// PUT /blog/posts/:id (admin)
app.put('/blog/posts/:id', async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  const data = await c.req.json()
  
  try {
    if (data.tags && Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags)
    if (data.isPublished === true && !data.publishedAt) {
      data.publishedAt = new Date().toISOString()
    }
    data.updatedAt = new Date().toISOString()
    
    const result = await db.update(schema.blogPosts).set(data).where(eq(schema.blogPosts.id, id)).returning()
    if (!result.length) return c.json({ success: false, error: 'Post not found' }, 404)
    return c.json({ success: true, data: result[0] })
  } catch (e) {
    return c.json({ success: false, error: 'Failed to update post' }, 500)
  }
})

// DELETE /blog/posts/:id (admin)
app.delete('/blog/posts/:id', async (c) => {
  const db = getDb(c.env)
  const id = parseInt(c.req.param('id'))
  
  try {
    const result = await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id)).returning()
    if (!result.length) return c.json({ success: false, error: 'Post not found' }, 404)
    return c.json({ success: true, data: result[0] })
  } catch (e) {
    return c.json({ success: false, error: 'Failed to delete post' }, 500)
  }
})
