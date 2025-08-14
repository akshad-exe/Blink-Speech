# API Documentation

This document provides comprehensive information about Blink Speech's backend API, database schema, and external service integrations.

## 🏗️ API Architecture

### Base Configuration

- **Framework**: Next.js API Routes
- **Runtime**: Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (optional)
- **Deployment**: Vercel Serverless Functions

### API Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## 📡 API Endpoints

### 1. SMS Integration

#### `POST /api/sendSMS`

Send SMS messages using Twilio integration for emergency notifications or phrase sharing.

**Request:**

```http
POST /api/sendSMS
Content-Type: application/json

{
  "to": "+1234567890",
  "phrase": "I need help - sent from Blink Speech"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `to` | string | Yes | Phone number in E.164 format |
| `phrase` | string | Yes | Message content to send |

**Response:**

```json
{
  "success": true,
  "messageId": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

```json
// 400 Bad Request - Missing parameters
{
  "error": "Missing required fields: to, phrase",
  "timestamp": "2024-01-15T10:30:00Z"
}

// 405 Method Not Allowed
{
  "error": "Method not allowed",
  "allowed": ["POST"]
}

// 500 Internal Server Error
{
  "error": "Failed to send SMS",
  "details": "Invalid phone number format"
}
```

**Implementation:**

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed: ['POST']
    });
  }

  const { to, phrase } = req.body;

  // Validation
  if (!to || !phrase) {
    return res.status(400).json({
      error: 'Missing required fields: to, phrase',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const message = await client.messages.create({
      body: phrase,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: to,
    });

    res.status(200).json({ 
      success: true,
      messageId: message.sid,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('SMS sending failed:', error);
    res.status(500).json({ 
      error: 'Failed to send SMS',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

### 2. Gesture Patterns Management (Planned)

#### `GET /api/patterns/:sid`

Retrieve gesture-to-phrase mappings for a specific session/user.

**Request:**

```http
GET /api/patterns/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <token> (optional)
```

**Response:**

```json
{
  "sid": "550e8400-e29b-41d4-a716-446655440000",
  "mapping": {
    "singleBlink": "Hello",
    "doubleBlink": "Yes",
    "tripleBlink": "No",
    "longBlink": "Thank you",
    "singleBlink_lookLeft": "I need help",
    "singleBlink_lookRight": "I'm okay",
    "doubleBlink_lookUp": "Water please",
    "doubleBlink_lookDown": "I'm tired"
  },
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T12:30:00Z"
}
```

#### `POST /api/patterns/:sid`

Save or update gesture mappings for a session/user.

**Request:**

```http
POST /api/patterns/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "mapping": {
    "singleBlink": "Hi there",
    "doubleBlink": "Yes please",
    "tripleBlink": "No thank you"
  }
}
```

**Response:**

```json
{
  "success": true,
  "sid": "550e8400-e29b-41d4-a716-446655440000",
  "updated_at": "2024-01-15T12:45:00Z"
}
```

### 3. Health Check

#### `GET /api/health`

Check API service status and dependencies.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "connected",
    "twilio": "configured",
    "environment": "production"
  },
  "version": "1.0.0"
}
```

## 🗄️ Database Schema

### Supabase Configuration

#### Database Setup

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create patterns table
CREATE TABLE patterns (
    sid TEXT PRIMARY KEY,
    mapping JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_patterns_sid ON patterns(sid);
CREATE INDEX idx_patterns_created_at ON patterns(created_at);
CREATE INDEX idx_patterns_updated_at ON patterns(updated_at);

-- Enable Row Level Security
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
CREATE POLICY "Allow anonymous read access" ON patterns
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert" ON patterns
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update" ON patterns
    FOR UPDATE USING (true) WITH CHECK (true);

-- Optional: Create policy for authenticated users only
-- CREATE POLICY "Authenticated users full access" ON patterns
--     FOR ALL USING (auth.role() = 'authenticated');
```

#### Auto-update Timestamps

```sql
-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update timestamps
CREATE TRIGGER update_patterns_updated_at 
    BEFORE UPDATE ON patterns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Data Types and Constraints

```sql
-- Add constraints for data validation
ALTER TABLE patterns 
ADD CONSTRAINT patterns_sid_format 
CHECK (sid ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

-- Add constraint for mapping structure
ALTER TABLE patterns 
ADD CONSTRAINT patterns_mapping_not_empty 
CHECK (jsonb_typeof(mapping) = 'object' AND mapping != '{}'::jsonb);
```

### Schema Details

#### Patterns Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `sid` | TEXT | PRIMARY KEY, UUID format | Session/User identifier |
| `mapping` | JSONB | NOT NULL, Object | Gesture-to-phrase mappings |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update time |

#### Example Data Structure

```json
{
  "sid": "550e8400-e29b-41d4-a716-446655440000",
  "mapping": {
    "singleBlink": "Hello",
    "doubleBlink": "Yes",
    "tripleBlink": "No",
    "longBlink": "Thank you",
    "singleBlink_lookLeft": "I need help",
    "singleBlink_lookRight": "I'm okay",
    "singleBlink_lookUp": "Please",
    "singleBlink_lookDown": "Stop",
    "doubleBlink_lookLeft": "Nurse",
    "doubleBlink_lookRight": "Doctor",
    "doubleBlink_lookUp": "Water please",
    "doubleBlink_lookDown": "I'm tired",
    "tripleBlink_lookLeft": "Family",
    "tripleBlink_lookRight": "Emergency",
    "tripleBlink_lookUp": "More",
    "tripleBlink_lookDown": "Less",
    "longBlink_lookLeft": "Pain",
    "longBlink_lookRight": "Comfortable",
    "longBlink_lookUp": "Hot",
    "longBlink_lookDown": "Cold"
  },
  "created_at": "2024-01-15T10:00:00+00:00",
  "updated_at": "2024-01-15T12:30:00+00:00"
}
```

## 🔌 External Service Integrations

### Twilio SMS API

#### Configuration

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Usage Patterns

```typescript
import { Twilio } from 'twilio';

class SMSService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendEmergencyMessage(to: string, phrase: string, location?: string) {
    const message = location 
      ? `EMERGENCY: ${phrase} - Location: ${location}`
      : `EMERGENCY: ${phrase}`;

    return await this.client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
  }

  async sendPhraseMessage(to: string, phrase: string) {
    return await this.client.messages.create({
      body: `Blink Speech: "${phrase}"`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
  }
}
```

### Supabase Integration

#### Client Configuration

```typescript
import { createClient } from '@supabase/supabase-js';

// Client-side (anon key)
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side (service role key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

#### Database Operations

```typescript
class PatternService {
  constructor(private supabase: SupabaseClient) {}

  async getPattern(sid: string) {
    const { data, error } = await this.supabase
      .from('patterns')
      .select('*')
      .eq('sid', sid)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch pattern: ${error.message}`);
    }

    return data;
  }

  async savePattern(sid: string, mapping: Record<string, string>) {
    const { data, error } = await this.supabase
      .from('patterns')
      .upsert(
        { sid, mapping },
        { onConflict: 'sid' }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save pattern: ${error.message}`);
    }

    return data;
  }

  async deletePattern(sid: string) {
    const { error } = await this.supabase
      .from('patterns')
      .delete()
      .eq('sid', sid);

    if (error) {
      throw new Error(`Failed to delete pattern: ${error.message}`);
    }
  }
}
```

## 🔒 Security Considerations

### Authentication

#### Session-Based Security

```typescript
// Generate secure session IDs
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export function generateSessionId(): string {
  return uuidv4();
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
```

#### API Rate Limiting

```typescript
// Simple in-memory rate limiting
const rateLimiter = new Map();

export function rateLimit(identifier: string, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimiter.has(identifier)) {
    rateLimiter.set(identifier, []);
  }
  
  const requests = rateLimiter.get(identifier);
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= maxRequests) {
    return false; // Rate limited
  }
  
  recentRequests.push(now);
  rateLimiter.set(identifier, recentRequests);
  return true; // Allow request
}
```

### Input Validation

```typescript
import Joi from 'joi';

const smsSchema = Joi.object({
  to: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be in E.164 format'
    }),
  phrase: Joi.string()
    .min(1)
    .max(160)
    .required()
    .messages({
      'string.min': 'Phrase cannot be empty',
      'string.max': 'Phrase cannot exceed 160 characters'
    })
});

export function validateSMSRequest(data: any) {
  return smsSchema.validate(data);
}
```

### Environment Variables

#### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Application Configuration
NODE_ENV=production
PORT=3001
API_BASE_URL=https://your-domain.com

# Security Configuration
JWT_SECRET=your_jwt_secret
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

## 📊 Monitoring and Analytics

### Health Monitoring

```typescript
export async function checkServiceHealth() {
  const checks = {
    database: await checkDatabaseConnection(),
    twilio: await checkTwilioConfiguration(),
    environment: process.env.NODE_ENV || 'development'
  };

  const isHealthy = Object.values(checks).every(check => 
    check === 'connected' || check === 'configured' || check === 'production'
  );

  return {
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: checks,
    version: process.env.npm_package_version || '1.0.0'
  };
}

async function checkDatabaseConnection() {
  try {
    const { error } = await supabase.from('patterns').select('count').limit(1);
    return error ? 'error' : 'connected';
  } catch {
    return 'disconnected';
  }
}

async function checkTwilioConfiguration() {
  return (
    process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_PHONE_NUMBER
  ) ? 'configured' : 'not_configured';
}
```

### Error Tracking

```typescript
interface APIError {
  message: string;
  stack?: string;
  timestamp: string;
  endpoint: string;
  method: string;
  statusCode: number;
}

export function logError(error: APIError) {
  console.error('API Error:', error);
  
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to Sentry, DataDog, etc.
  }
}
```

## 🚀 Deployment Configuration

### Vercel Configuration

```json
{
  "functions": {
    "backend/pages/api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/backend/pages/api/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Docker Configuration

```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

This API documentation provides a comprehensive reference for all backend functionality in Blink Speech, including security best practices and deployment considerations.
