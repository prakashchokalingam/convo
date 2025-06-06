import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

// Forms table
export const forms = sqliteTable('forms', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  prompt: text('prompt'),
  config: text('config').notNull(), // JSON string
  isConversational: integer('is_conversational', { mode: 'boolean' }).default(false),
  isPublished: integer('is_published', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Responses table
export const responses = sqliteTable('responses', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  formId: text('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  data: text('data').notNull(), // JSON string
  metadata: text('metadata'), // JSON string
  completedAt: text('completed_at').default(sql`CURRENT_TIMESTAMP`),
});

// Conversations table
export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  formId: text('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  responseId: text('response_id').references(() => responses.id, { onDelete: 'cascade' }),
  messages: text('messages').notNull(), // JSON string
  currentFieldIndex: integer('current_field_index').default(0),
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),
  startedAt: text('started_at').default(sql`CURRENT_TIMESTAMP`),
  completedAt: text('completed_at'),
});

// Form analytics table
export const formAnalytics = sqliteTable('form_analytics', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  formId: text('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD format
  views: integer('views').default(0),
  starts: integer('starts').default(0),
  completions: integer('completions').default(0),
  avgCompletionTime: integer('avg_completion_time'), // in seconds
});

// Subscriptions table
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  plan: text('plan', { enum: ['free', 'pro', 'enterprise'] }).notNull(),
  status: text('status', { enum: ['active', 'canceled', 'past_due'] }).notNull(),
  currentPeriodStart: text('current_period_start'),
  currentPeriodEnd: text('current_period_end'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Type exports
export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type FormAnalytic = typeof formAnalytics.$inferSelect;
export type NewFormAnalytic = typeof formAnalytics.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
