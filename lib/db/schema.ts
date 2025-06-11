import { sql } from 'drizzle-orm';
import { text, integer, boolean, timestamp, pgTable, uuid, varchar, jsonb, primaryKey } from 'drizzle-orm/pg-core';

// Workspaces table
export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: text('type', { enum: ['default', 'team'] }).notNull().default('default'),
  ownerId: text('owner_id').notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
  settings: text('settings'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Workspace members table
export const workspaceMembers = pgTable('workspace_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull(),
  userId: text('user_id').notNull(),
  role: text('role', { enum: ['owner', 'admin', 'member', 'viewer'] }).notNull().default('member'),
  invitedBy: text('invited_by'),
  invitedAt: timestamp('invited_at'),
  joinedAt: timestamp('joined_at'),
  lastSeenAt: timestamp('last_seen_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Forms table
export const forms = pgTable('forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull(),
  createdBy: text('created_by').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  prompt: text('prompt'),
  config: text('config').notNull(), // JSON string
  isConversational: boolean('is_conversational').default(false),
  isPublished: boolean('is_published').default(false),
  version: integer('version').default(1),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Templates table
export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  formSchema: jsonb('form_schema').notNull(),
  category: varchar('category', { length: 100 }),
  isGlobal: boolean('is_global').default(false),
  createdBy: text('created_by'),
  workspaceId: uuid('workspace_id'),
  usageCount: integer('usage_count').default(0),
  cloneCount: integer('clone_count').default(0),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Form-Template relationship tracking
export const formTemplates = pgTable('form_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  formId: uuid('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  templateId: uuid('template_id').notNull().references(() => templates.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Responses table
export const responses = pgTable('responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  formId: uuid('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  data: text('data').notNull(), // JSON string
  metadata: text('metadata'), // JSON string
  completedAt: timestamp('completed_at').defaultNow(),
});

// Conversations table
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  formId: uuid('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  responseId: uuid('response_id').references(() => responses.id, { onDelete: 'cascade' }),
  messages: text('messages').notNull(), // JSON string
  currentFieldIndex: integer('current_field_index').default(0),
  isCompleted: boolean('is_completed').default(false),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// Form analytics table
export const formAnalytics = pgTable('form_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  formId: uuid('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD format
  views: integer('views').default(0),
  starts: integer('starts').default(0),
  completions: integer('completions').default(0),
  avgCompletionTime: integer('avg_completion_time'), // in seconds
});

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  plan: text('plan', { enum: ['free', 'pro', 'enterprise'] }).notNull(),
  status: text('status', { enum: ['active', 'canceled', 'past_due'] }).notNull(),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Type exports
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
export type FormTemplate = typeof formTemplates.$inferSelect;
export type NewFormTemplate = typeof formTemplates.$inferInsert;
export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type FormAnalytic = typeof formAnalytics.$inferSelect;
export type NewFormAnalytic = typeof formAnalytics.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
