# Database Schema

## Overview
Using SQLite for development, will migrate to Turso for production.
Authentication handled by Clerk (user data stored in Clerk).

## Tables

### Forms
Stores form configurations created by users.

```sql
CREATE TABLE forms (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL, -- Clerk user ID
  name TEXT NOT NULL,
  description TEXT,
  prompt TEXT, -- Original AI prompt
  config JSON NOT NULL, -- Form field configuration
  is_conversational BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forms_user_id ON forms(user_id);
```

### Form Responses
Stores all form submissions.

```sql
CREATE TABLE responses (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  data JSON NOT NULL, -- Response data
  metadata JSON, -- IP, user agent, etc.
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (form_id) REFERENCES forms(id)
);

CREATE INDEX idx_responses_form_id ON responses(form_id);
CREATE INDEX idx_responses_completed_at ON responses(completed_at);
```

### Conversations
Stores conversational form sessions.

```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  response_id TEXT REFERENCES responses(id) ON DELETE CASCADE,
  messages JSON NOT NULL, -- Array of conversation messages
  current_field_index INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  
  FOREIGN KEY (form_id) REFERENCES forms(id),
  FOREIGN KEY (response_id) REFERENCES responses(id)
);

CREATE INDEX idx_conversations_form_id ON conversations(form_id);
```

### Form Analytics
Aggregated analytics for forms.

```sql
CREATE TABLE form_analytics (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  starts INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0,
  avg_completion_time INTEGER, -- in seconds
  
  FOREIGN KEY (form_id) REFERENCES forms(id),
  UNIQUE(form_id, date)
);

CREATE INDEX idx_form_analytics_form_date ON form_analytics(form_id, date);
```

### Subscriptions
Track user subscriptions (synced with Stripe).

```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL UNIQUE, -- Clerk user ID
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
```

## JSON Schema Examples

### Form Config JSON
```json
{
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "What's your name?",
      "placeholder": "John Doe",
      "required": true,
      "validation": {
        "minLength": 2,
        "maxLength": 50
      }
    },
    {
      "id": "field_2",
      "type": "email",
      "label": "What's your email?",
      "placeholder": "john@example.com",
      "required": true
    },
    {
      "id": "field_3",
      "type": "select",
      "label": "How did you hear about us?",
      "options": [
        { "value": "google", "label": "Google" },
        { "value": "friend", "label": "Friend" },
        { "value": "social", "label": "Social Media" }
      ],
      "required": false
    }
  ],
  "settings": {
    "submitText": "Submit",
    "successMessage": "Thank you for your submission!"
  }
}
```

### Response Data JSON
```json
{
  "field_1": "John Doe",
  "field_2": "john@example.com",
  "field_3": "google"
}
```

### Conversation Messages JSON
```json
[
  {
    "type": "bot",
    "content": "Hi! Let's get started. What's your name?",
    "timestamp": "2024-01-27T10:00:00Z"
  },
  {
    "type": "user",
    "content": "John Doe",
    "timestamp": "2024-01-27T10:00:05Z"
  },
  {
    "type": "bot",
    "content": "Nice to meet you, John! What's your email?",
    "timestamp": "2024-01-27T10:00:06Z"
  }
]
```

## Migration Plan
1. Start with SQLite for rapid development
2. When ready for production, migrate to Turso (edge-hosted SQLite)
3. Minimal code changes required (same SQL syntax)
4. Better performance and global distribution
