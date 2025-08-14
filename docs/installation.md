# Installation Guide

This guide will walk you through setting up Blink Speech for development and production environments.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Node.js**: Version 18.0 or higher
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+, or Edge 80+
- **Camera**: Webcam with minimum 720p resolution
- **Memory**: At least 2GB RAM available
- **Network**: HTTPS required for camera access (development server included)

### Required Tools
- **Git**: Version control system
- **Package Manager**: npm, yarn, or pnpm (pnpm recommended)
- **Code Editor**: VS Code recommended with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/atharhive/Blink-Speech.git
cd Blink-Speech
```

### 2. Install Dependencies

#### Frontend Setup
```bash
cd frontend
pnpm install
# or
npm install
# or
yarn install
```

#### Backend Setup
```bash
cd ../backend
pnpm install
# or
npm install
# or
yarn install
```

### 3. Environment Configuration

#### Frontend Environment Variables
Create `frontend/.env.local`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics and monitoring
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
```

#### Backend Environment Variables
Create `backend/.env`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twilio SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Development Configuration
NODE_ENV=development
PORT=3001
```

### 4. Database Setup

#### Supabase Configuration
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to find your URL and keys
3. Execute the following SQL in the SQL Editor:

```sql
-- Create patterns table for gesture mappings
CREATE TABLE patterns (
    sid TEXT PRIMARY KEY,
    mapping JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for better query performance
CREATE INDEX idx_patterns_sid ON patterns(sid);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;

-- Create a policy for anonymous access (adjust as needed)
CREATE POLICY "Allow anonymous access" ON patterns
    FOR ALL USING (true);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update timestamps
CREATE TRIGGER update_patterns_updated_at 
    BEFORE UPDATE ON patterns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Start Development Servers

#### Terminal 1 - Frontend Server
```bash
cd frontend
pnpm dev
# or
npm run dev
# or
yarn dev
```
The frontend will be available at `https://localhost:5173`

#### Terminal 2 - Backend Server
```bash
cd backend
pnpm dev
# or
npm run dev
# or
yarn dev
```
The backend API will be available at `http://localhost:3001`

### 6. Verify Installation

1. **Open your browser** to `https://localhost:5173`
2. **Allow camera permissions** when prompted
3. **Complete the calibration** process
4. **Test gesture detection** in the session interface

## 🔧 Development Setup

### IDE Configuration

#### VS Code Settings
Create `.vscode/settings.json` in the project root:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

#### VS Code Extensions
Install the following extensions:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

### Git Hooks Setup
Set up pre-commit hooks to ensure code quality:

```bash
# Install husky for git hooks
cd frontend
pnpm add -D husky lint-staged

# Initialize husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

Add to `frontend/package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### Environment-Specific Configuration

#### Development
```env
# frontend/.env.development
VITE_API_BASE_URL=http://localhost:3001
VITE_LOG_LEVEL=debug
VITE_ENABLE_DEVTOOLS=true
```

#### Production
```env
# frontend/.env.production
VITE_API_BASE_URL=https://your-api-domain.com
VITE_LOG_LEVEL=error
VITE_ENABLE_DEVTOOLS=false
```

## 🌐 Production Deployment

### Frontend Deployment (Vercel)

1. **Build the project**:
```bash
cd frontend
pnpm build
```

2. **Deploy to Vercel**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

3. **Configure environment variables** in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Backend Deployment (Vercel Functions)

1. **Configure vercel.json** in backend directory:
```json
{
  "functions": {
    "pages/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/pages/$1"
    }
  ]
}
```

2. **Deploy**:
```bash
cd backend
vercel --prod
```

### Alternative: Docker Deployment

#### Dockerfile for Frontend
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
  
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
```

## 🔍 Troubleshooting

### Common Issues

#### Camera Access Denied
**Problem**: Browser denies camera access
**Solution**: 
- Ensure you're accessing via HTTPS (or localhost)
- Check browser permissions in Settings
- Try a different browser

#### MediaPipe Model Loading Failed
**Problem**: TensorFlow.js models fail to load
**Solution**:
```bash
# Clear browser cache
# Check network connectivity
# Verify HTTPS is enabled
```

#### Build Errors
**Problem**: TypeScript compilation errors
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript version
npx tsc --version

# Regenerate types
npm run build
```

#### WebGazer Initialization Failed
**Problem**: Gaze tracking doesn't work
**Solution**:
- Ensure good lighting conditions
- Check camera quality and positioning
- Allow sufficient initialization time

### Performance Issues

#### High CPU Usage
- Reduce video resolution in `getUserMedia` constraints
- Adjust detection frequency in `useGestureSpeech` hook
- Close other browser tabs during usage

#### Memory Leaks
- Ensure proper cleanup in `useEffect` hooks
- Stop video streams on component unmount
- Monitor browser dev tools memory tab

### Development Tips

1. **Enable verbose logging**:
```typescript
// Add to your .env.development
VITE_LOG_LEVEL=debug
```

2. **Test with different cameras**:
- Built-in laptop cameras
- External USB webcams
- Different resolutions and frame rates

3. **Profile performance**:
```bash
# Use React DevTools Profiler
# Monitor TensorFlow.js performance
# Check WebGazer accuracy
```

## 📦 Package Scripts

### Frontend Scripts
```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview",
  "type-check": "tsc --noEmit"
}
```

### Backend Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

## 🔒 Security Considerations

### Development Security
- Never commit `.env` files to version control
- Use different API keys for development and production
- Implement proper CORS policies
- Enable HTTPS in development environment

### Production Security
- Configure proper environment variables
- Enable security headers
- Implement rate limiting
- Use HTTPS certificates
- Regular security audits

---

You're now ready to start developing with Blink Speech! Check the [Development Guide](./development-guide.md) for detailed development workflows and best practices.
