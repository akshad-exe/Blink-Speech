# Deployment Guide

This guide covers deploying Blink Speech to production environments with best practices for security, performance, and reliability.

## 🚀 Deployment Overview

Blink Speech consists of two main components:
- **Frontend**: React application built with Vite
- **Backend**: Next.js API routes for server functionality

### Recommended Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFlare    │    │     Vercel      │    │    Supabase     │
│     CDN         │───▶│   Frontend +    │───▶│   Database      │
│                 │    │   API Routes    │    │   + Auth        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Twilio      │
                       │   SMS Service   │
                       └─────────────────┘
```

## 📋 Pre-deployment Checklist

### Environment Setup
- [ ] Production environment variables configured
- [ ] Supabase project created and configured
- [ ] SSL certificates ready (for custom domains)
- [ ] DNS records configured
- [ ] Monitoring and analytics setup

### Code Preparation
- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Bundle size optimized
- [ ] Security headers configured
- [ ] Error handling implemented
- [ ] Performance optimizations applied

### Database Setup
- [ ] Supabase database schema deployed
- [ ] Row-level security policies configured
- [ ] Database indexes created
- [ ] Backup strategy implemented

## 🌐 Vercel Deployment (Recommended)

Vercel provides excellent support for React + Next.js applications with automatic HTTPS, global CDN, and serverless functions.

### 1. Project Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel
```

### 2. Configuration Files

#### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
        "outputDirectory": "dist"
      }
    },
    {
      "src": "backend/pages/api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/pages/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "functions": {
    "backend/pages/api/**/*.ts": {
      "runtime": "@vercel/node@3",
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(self), microphone=(), geolocation=(), payment=()"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://yourdomain.com"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/((?!api).*)",
      "destination": "/frontend/$1"
    }
  ]
}
```

### 3. Environment Variables

Configure in Vercel dashboard or via CLI:

```bash
# Production environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add TWILIO_ACCOUNT_SID production
vercel env add TWILIO_AUTH_TOKEN production
vercel env add TWILIO_PHONE_NUMBER production
```

### 4. Deploy

```bash
# Deploy to production
vercel --prod

# Custom domain setup
vercel domains add yourdomain.com
```

## 🐳 Docker Deployment

For containerized deployments or custom hosting environments.

### Frontend Dockerfile

```dockerfile
# Multi-stage build for frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source and build
COPY frontend/ .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# Production image
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy source
COPY backend/ .

# Build if needed
RUN npm run build || true

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3001

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
      args:
        - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
        - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - TWILIO_PHONE_NUMBER=${TWILIO_PHONE_NUMBER}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Optional: Redis for caching
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

## ☁️ Alternative Deployment Options

### Netlify

```toml
# netlify.toml
[build]
  base = "frontend/"
  publish = "dist/"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend.vercel.app/api/:splat"
  status = 200
  force = true

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### AWS S3 + CloudFront

```bash
#!/bin/bash
# deploy-aws.sh

# Build the application
cd frontend
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

## 🗄️ Database Deployment

### Supabase Setup

1. **Create Project**
```bash
# Using Supabase CLI
supabase init
supabase start
supabase db reset
```

2. **Deploy Schema**
```sql
-- Create tables
CREATE TABLE patterns (
    sid TEXT PRIMARY KEY,
    mapping JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_patterns_sid ON patterns(sid);
CREATE INDEX idx_patterns_created_at ON patterns(created_at);

-- Enable RLS
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous read access" ON patterns
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert" ON patterns
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update" ON patterns
    FOR UPDATE USING (true) WITH CHECK (true);
```

3. **Production Configuration**
```sql
-- Set up production policies
DROP POLICY IF EXISTS "Allow anonymous read access" ON patterns;
DROP POLICY IF EXISTS "Allow anonymous insert" ON patterns;
DROP POLICY IF EXISTS "Allow anonymous update" ON patterns;

-- More restrictive policies for production
CREATE POLICY "Authenticated users can manage their patterns" ON patterns
    FOR ALL USING (auth.uid()::text = sid);
```

## 🔒 Security Configuration

### SSL/TLS Setup

#### Let's Encrypt with Certbot
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(self), microphone=(), geolocation=(), payment=()" always;

    # Serve static files
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy API requests
    location /api/ {
        proxy_pass http://backend:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Environment Security

```bash
# .env.production
NODE_ENV=production

# Use strong, unique values
JWT_SECRET=$(openssl rand -base64 32)
API_SECRET=$(openssl rand -base64 32)

# Database URLs with connection pooling
SUPABASE_SERVICE_ROLE_KEY=your_secure_service_role_key

# Enable security features
ENABLE_RATE_LIMITING=true
ENABLE_REQUEST_LOGGING=true
ENABLE_CORS_PROTECTION=true

# Monitoring
ENABLE_HEALTH_CHECKS=true
HEALTH_CHECK_INTERVAL=30000
```

## 📊 Monitoring & Analytics

### Health Monitoring

```typescript
// backend/pages/api/health.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      database: await checkDatabaseHealth(),
      twilio: checkTwilioHealth(),
      storage: checkStorageHealth()
    }
  };

  const isHealthy = Object.values(health.services).every(
    service => service === 'healthy' || service === 'connected'
  );

  res.status(isHealthy ? 200 : 503).json(health);
}
```

### Error Tracking with Sentry

```bash
npm install @sentry/node @sentry/react
```

```typescript
// Sentry configuration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter sensitive data
    if (event.user) {
      delete event.user.ip_address;
    }
    return event;
  }
});
```

### Performance Monitoring

```typescript
// Performance metrics collection
const performanceMonitor = {
  trackPageLoad: () => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalPageLoad: navigation.loadEventEnd - navigation.fetchStart
        };
        
        // Send to analytics service
        analytics.track('page_load_performance', metrics);
      });
    }
  },

  trackGestureDetection: (latency: number) => {
    analytics.track('gesture_detection_latency', { latency });
  }
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
      
      - name: Run tests
        run: |
          cd frontend && npm run test
          cd ../backend && npm run test
      
      - name: Build
        run: |
          cd frontend && npm run build
          cd ../backend && npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  notify:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Notify deployment
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
            -H 'Content-type: application/json' \
            --data '{"text":"Blink Speech deployed successfully to production!"}'
```

## 🛡️ Production Hardening

### Rate Limiting

```typescript
// Implement rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
```

### Input Validation

```typescript
import Joi from 'joi';

const schemas = {
  smsRequest: Joi.object({
    to: Joi.string().pattern(/^\+[1-9]\d{1,14}$/).required(),
    phrase: Joi.string().min(1).max(160).required()
  }),
  
  gestureMapping: Joi.object().pattern(
    Joi.string(),
    Joi.string().max(100)
  )
};

export const validateInput = (schema: Joi.ObjectSchema, data: any) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(`Validation failed: ${error.message}`);
  }
  return value;
};
```

## 🔄 Rollback Strategy

### Blue-Green Deployment

```bash
#!/bin/bash
# blue-green-deploy.sh

CURRENT_ENV=$(vercel ls --scope=your-team | grep "production" | awk '{print $1}')
NEW_ENV="staging"

echo "Current production: $CURRENT_ENV"
echo "Deploying to staging environment..."

# Deploy to staging
vercel --target=staging

# Run health checks
curl -f https://staging.yourdomain.com/api/health

if [ $? -eq 0 ]; then
    echo "Health check passed. Promoting to production..."
    vercel promote --scope=your-team
    echo "Deployment successful!"
else
    echo "Health check failed. Aborting deployment."
    exit 1
fi
```

### Database Migrations

```sql
-- Always use transactions for migrations
BEGIN;

-- Add new columns with defaults
ALTER TABLE patterns 
ADD COLUMN version INTEGER DEFAULT 1;

-- Create new indexes
CREATE INDEX CONCURRENTLY idx_patterns_version ON patterns(version);

-- Update existing data if needed
UPDATE patterns SET version = 1 WHERE version IS NULL;

-- Only commit if everything succeeded
COMMIT;
```

## 📋 Production Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] SSL certificates installed and tested
- [ ] Database migrations applied
- [ ] Monitoring and alerting setup
- [ ] Backup strategy implemented
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] Performance benchmarks met

### Post-Launch
- [ ] Monitor application logs
- [ ] Check error rates and performance metrics
- [ ] Verify all features working correctly
- [ ] Test disaster recovery procedures
- [ ] Update documentation
- [ ] Notify team of successful deployment

### Ongoing Maintenance
- [ ] Regular security updates
- [ ] Database maintenance and optimization
- [ ] Performance monitoring and optimization
- [ ] Backup verification
- [ ] Capacity planning and scaling

This deployment guide ensures a secure, scalable, and maintainable production deployment of Blink Speech with comprehensive monitoring and maintenance procedures.
