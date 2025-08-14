# Configuration Guide

This document details all configuration options, environment variables, and settings for Blink Speech across development, staging, and production environments.

## 📋 Environment Variables

### Frontend Configuration

#### Required Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Metadata
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=Blink Speech
```

#### Optional Variables

```env
# Development Configuration
VITE_LOG_LEVEL=info
VITE_ENABLE_DEVTOOLS=true
VITE_API_BASE_URL=http://localhost:3001

# Performance Configuration
VITE_TARGET_FPS=15
VITE_MAX_DETECTION_HISTORY=50
VITE_BLINK_THRESHOLD=0.25

# Feature Flags
VITE_ENABLE_SMS=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_OVERLAY=false

# Gesture Detection Configuration
VITE_COOLDOWN_MS=1000
VITE_CALIBRATION_POINTS=5
VITE_GAZE_THRESHOLD=100

# Speech Synthesis Configuration
VITE_DEFAULT_SPEECH_RATE=1.0
VITE_DEFAULT_SPEECH_PITCH=1.0
VITE_DEFAULT_SPEECH_VOLUME=1.0
```

### Backend Configuration

#### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NODE_ENV=production
PORT=3001
```

#### Optional Variables

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Security Configuration
JWT_SECRET=your_jwt_secret_key
API_SECRET=your_api_secret_key

# Rate Limiting Configuration
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Logging Configuration
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true

# Performance Configuration
MAX_REQUEST_SIZE=1mb
REQUEST_TIMEOUT=30000

# CORS Configuration
CORS_ORIGIN=https://your-domain.com
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_CREDENTIALS=true
```

## ⚙️ Application Configuration

### Frontend Configuration Files

#### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    https: true, // Required for camera access
    host: true,
    cors: true,
  },
  build: {
    target: 'esnext',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ml: ['@tensorflow/tfjs', '@tensorflow-models/face-landmarks-detection'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-button'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['webgazer', '@tensorflow/tfjs-backend-webgl'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});
```

#### `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
```

### Backend Configuration Files

#### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/pages/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

## 🔧 Runtime Configuration

### Application Settings

#### Default Gesture Mappings

```typescript
export const DEFAULT_GESTURE_MAPPING = {
  // Basic patterns
  singleBlink: 'Hello',
  doubleBlink: 'Yes',
  tripleBlink: 'No',
  longBlink: 'Thank you',
  
  // Directional combinations
  singleBlink_lookLeft: 'I need help',
  singleBlink_lookRight: 'I\'m okay',
  singleBlink_lookUp: 'Please',
  singleBlink_lookDown: 'Stop',
  
  doubleBlink_lookLeft: 'Nurse',
  doubleBlink_lookRight: 'Doctor',
  doubleBlink_lookUp: 'Water please',
  doubleBlink_lookDown: 'I\'m tired',
  
  tripleBlink_lookLeft: 'Family',
  tripleBlink_lookRight: 'Emergency',
  tripleBlink_lookUp: 'More',
  tripleBlink_lookDown: 'Less'
};
```

#### Performance Settings

```typescript
export interface PerformanceConfig {
  targetFps: number;
  blinkThreshold: number;
  gazeThreshold: number;
  cooldownMs: number;
  maxHistoryLength: number;
  adaptiveThresholding: boolean;
  frameSkipThreshold: number;
}

export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  targetFps: parseInt(import.meta.env.VITE_TARGET_FPS) || 15,
  blinkThreshold: parseFloat(import.meta.env.VITE_BLINK_THRESHOLD) || 0.25,
  gazeThreshold: parseInt(import.meta.env.VITE_GAZE_THRESHOLD) || 100,
  cooldownMs: parseInt(import.meta.env.VITE_COOLDOWN_MS) || 1000,
  maxHistoryLength: parseInt(import.meta.env.VITE_MAX_DETECTION_HISTORY) || 50,
  adaptiveThresholding: import.meta.env.VITE_ADAPTIVE_THRESHOLDING === 'true',
  frameSkipThreshold: 0.8 // Skip frames if CPU usage > 80%
};
```

#### Speech Synthesis Settings

```typescript
export interface SpeechConfig {
  rate: number;
  pitch: number;
  volume: number;
  language: string;
  voiceIndex: number;
}

export const DEFAULT_SPEECH_CONFIG: SpeechConfig = {
  rate: parseFloat(import.meta.env.VITE_DEFAULT_SPEECH_RATE) || 1.0,
  pitch: parseFloat(import.meta.env.VITE_DEFAULT_SPEECH_PITCH) || 1.0,
  volume: parseFloat(import.meta.env.VITE_DEFAULT_SPEECH_VOLUME) || 1.0,
  language: 'en-US',
  voiceIndex: 0
};
```

### Calibration Settings

```typescript
export interface CalibrationConfig {
  pointCount: number;
  pointSize: number;
  animationDuration: number;
  minDistance: number;
  timeout: number;
  retryCount: number;
}

export const DEFAULT_CALIBRATION_CONFIG: CalibrationConfig = {
  pointCount: parseInt(import.meta.env.VITE_CALIBRATION_POINTS) || 5,
  pointSize: 20,
  animationDuration: 500,
  minDistance: 100,
  timeout: 30000, // 30 seconds
  retryCount: 3
};
```

## 🌍 Environment-Specific Configuration

### Development Environment

```env
# frontend/.env.development
NODE_ENV=development
VITE_LOG_LEVEL=debug
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_DEBUG_OVERLAY=true
VITE_API_BASE_URL=http://localhost:3001
VITE_TARGET_FPS=30
VITE_ENABLE_HOT_RELOAD=true
```

### Staging Environment

```env
# frontend/.env.staging
NODE_ENV=staging
VITE_LOG_LEVEL=info
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_DEBUG_OVERLAY=false
VITE_API_BASE_URL=https://staging-api.blinkSpeech.com
VITE_TARGET_FPS=20
VITE_ENABLE_ANALYTICS=true
```

### Production Environment

```env
# frontend/.env.production
NODE_ENV=production
VITE_LOG_LEVEL=error
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_DEBUG_OVERLAY=false
VITE_API_BASE_URL=https://api.blinkSpeech.com
VITE_TARGET_FPS=15
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

## 🔒 Security Configuration

### Content Security Policy

```typescript
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for WebGazer
    'https://cdn.jsdelivr.net',
    'https://unpkg.com'
  ],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:'],
  'media-src': ["'self'", 'blob:'],
  'connect-src': [
    "'self'",
    'https://your-project.supabase.co',
    'wss://your-project.supabase.co'
  ],
  'worker-src': ["'self'", 'blob:'],
  'child-src': ["'self'"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};
```

### HTTPS Configuration

```typescript
export const HTTPS_CONFIG = {
  force: process.env.NODE_ENV === 'production',
  trustProxy: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
};
```

## 📊 Logging Configuration

### Log Levels

```typescript
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  format: 'json' | 'text';
  maxFileSize: number;
  maxFiles: number;
}

export const DEFAULT_LOG_CONFIG: LogConfig = {
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableFile: process.env.NODE_ENV === 'production',
  enableRemote: process.env.NODE_ENV === 'production',
  format: process.env.NODE_ENV === 'development' ? 'text' : 'json',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5
};
```

### Logger Implementation

```typescript
class Logger {
  private config: LogConfig;
  
  constructor(config: LogConfig = DEFAULT_LOG_CONFIG) {
    this.config = config;
  }
  
  private log(level: LogLevel, message: string, data?: any) {
    if (level > this.config.level) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: LogLevel[level],
      message,
      data
    };
    
    if (this.config.enableConsole) {
      console.log(JSON.stringify(logEntry, null, 2));
    }
    
    if (this.config.enableFile) {
      // Write to file
    }
    
    if (this.config.enableRemote) {
      // Send to remote logging service
    }
  }
  
  error(message: string, data?: any) {
    this.log(LogLevel.ERROR, message, data);
  }
  
  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }
  
  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }
  
  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }
}

export const logger = new Logger();
```

## 🚀 Deployment Configuration

### Docker Configuration

#### Frontend Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Environment variable substitution
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Environment Substitution

```bash
#!/bin/sh
# docker-entrypoint.sh

# Replace environment variables in built files
envsubst '${VITE_SUPABASE_URL} ${VITE_SUPABASE_ANON_KEY}' < /usr/share/nginx/html/index.html > /tmp/index.html
mv /tmp/index.html /usr/share/nginx/html/index.html

exec "$@"
```

### Vercel Configuration

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
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "backend/pages/api/**/*.ts": {
      "runtime": "@vercel/node@3"
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
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🔄 Configuration Management

### Configuration Loader

```typescript
export class ConfigLoader {
  private static instance: ConfigLoader;
  private config: Record<string, any> = {};
  
  private constructor() {
    this.loadConfiguration();
  }
  
  static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }
  
  private loadConfiguration() {
    // Load from environment variables
    this.config = {
      app: {
        name: import.meta.env.VITE_APP_NAME || 'Blink Speech',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: import.meta.env.NODE_ENV || 'development'
      },
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      performance: DEFAULT_PERFORMANCE_CONFIG,
      speech: DEFAULT_SPEECH_CONFIG,
      calibration: DEFAULT_CALIBRATION_CONFIG,
      logging: DEFAULT_LOG_CONFIG
    };
    
    // Validate required configuration
    this.validateConfiguration();
  }
  
  private validateConfiguration() {
    const requiredKeys = [
      'supabase.url',
      'supabase.anonKey'
    ];
    
    for (const key of requiredKeys) {
      if (!this.get(key)) {
        throw new Error(`Required configuration key '${key}' is missing`);
      }
    }
  }
  
  get(key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], this.config);
  }
  
  set(key: string, value: any): void {
    const keys = key.split('.');
    const lastKey = keys.pop()!;
    const obj = keys.reduce((obj, k) => {
      if (!obj[k]) obj[k] = {};
      return obj[k];
    }, this.config);
    obj[lastKey] = value;
  }
  
  getAll(): Record<string, any> {
    return { ...this.config };
  }
}

export const config = ConfigLoader.getInstance();
```

### Environment Variable Validation

```typescript
import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'staging', 'production').required(),
  VITE_SUPABASE_URL: Joi.string().uri().required(),
  VITE_SUPABASE_ANON_KEY: Joi.string().required(),
  VITE_LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  VITE_TARGET_FPS: Joi.number().integer().min(5).max(60).default(15),
  VITE_BLINK_THRESHOLD: Joi.number().min(0.1).max(0.5).default(0.25)
});

export function validateEnvironment() {
  const { error, value } = envSchema.validate(process.env, { 
    allowUnknown: true,
    stripUnknown: true
  });
  
  if (error) {
    throw new Error(`Environment validation failed: ${error.message}`);
  }
  
  return value;
}
```

## 📋 Configuration Checklist

### Pre-deployment Checklist

```markdown
## Environment Configuration

### Required
- [ ] VITE_SUPABASE_URL configured
- [ ] VITE_SUPABASE_ANON_KEY configured
- [ ] SUPABASE_SERVICE_ROLE_KEY configured (backend)
- [ ] NODE_ENV set correctly

### Optional but Recommended
- [ ] TWILIO_* variables (if SMS features enabled)
- [ ] LOG_LEVEL appropriate for environment
- [ ] Performance settings optimized
- [ ] Security headers configured
- [ ] HTTPS/SSL certificates installed

### Validation
- [ ] Environment variables validated
- [ ] Configuration files syntax valid
- [ ] All required services accessible
- [ ] Performance benchmarks met
- [ ] Security scan passed
```

This configuration guide provides comprehensive coverage of all settings, environment variables, and configuration options needed to run Blink Speech effectively across different environments.
