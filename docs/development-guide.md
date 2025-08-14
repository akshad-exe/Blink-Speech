# Development Guide

This guide covers everything you need to know about developing, contributing to, and extending Blink Speech.

## 🏗️ Development Environment

### Prerequisites

Ensure you have completed the [Installation Guide](./installation.md) before proceeding with development.

### Project Structure Overview

```
Blink-Speech/
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Route components
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript definitions
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── backend/                    # Next.js API backend
│   ├── pages/                 # API route handlers
│   └── package.json           # Backend dependencies
├── docs/                      # Documentation
└── README.md                  # Project overview
```

### Development Workflow

1. **Feature Branch Workflow**: Create feature branches from `main`
2. **Commit Convention**: Follow conventional commits
3. **Code Review**: All changes reviewed via pull requests
4. **Testing**: Ensure all tests pass before merging
5. **Documentation**: Update docs for any new features

## 💻 Frontend Development

### Tech Stack Details

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks + Context API
- **Routing**: React Router DOM
- **Data Fetching**: TanStack Query for server state

### Key Directories

#### `src/components/`

**UI Components** (`src/components/ui/`)
- Base components built on Radix UI
- Consistent design system implementation
- Accessibility features included

**Landing Components** (`src/components/landing/`)
- Hero section with feature highlights
- Accessibility features showcase
- Call-to-action components

**Session Components** (`src/components/session/`)
- Gesture grid interface
- Phrase preview display
- Mapping editor
- Video feed overlay

#### `src/hooks/`

**useGestureSpeech** - Main gesture detection hook
```typescript
export function useGestureSpeech(
  mapping: Record<string, string>, 
  options: GestureSpeechOptions = {}
) {
  // MediaPipe and WebGazer integration
  // Real-time gesture detection
  // Speech synthesis triggering
}
```

**use-toast** - Toast notification system
```typescript
const { toast } = useToast();
toast({
  title: "Success",
  description: "Gesture mapping updated"
});
```

#### `src/pages/`

**Index.tsx** - Landing page
- Hero section
- Feature highlights
- Getting started flow

**Calibration.tsx** - Gaze calibration interface
- 5-point calibration system
- Visual feedback
- Progress tracking

**Session.tsx** - Main application interface
- Video feed management
- Gesture detection controls
- Real-time phrase display

#### `src/utils/`

**earUtils.ts** - Eye Aspect Ratio calculations
```typescript
export function calculateEAR(landmarks: { x: number; y: number }[]): number {
  // MediaPipe landmark processing
  // EAR computation for blink detection
}
```

**gazeUtils.ts** - Gaze direction detection
```typescript
export function getGazeDirection(x?: number, y?: number): string {
  // WebGazer coordinate processing
  // Calibrated direction calculation
}
```

**speechSynthesis.ts** - Text-to-speech wrapper
```typescript
export function speakPhrase(text: string) {
  // Web Speech API integration
  // Error handling and fallbacks
}
```

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

### Code Style Guidelines

#### TypeScript Best Practices

1. **Explicit Types**: Use explicit types for function parameters and returns
```typescript
// Good
function calculateEAR(landmarks: Landmark[]): number {
  return result;
}

// Avoid
function calculateEAR(landmarks: any): any {
  return result;
}
```

2. **Interface Definitions**: Define interfaces for complex objects
```typescript
interface GestureMapping {
  [gesture: string]: string;
}

interface CalibrationData {
  centerX: number;
  centerY: number;
  threshold: number;
}
```

3. **Union Types**: Use union types for controlled values
```typescript
type GazeDirection = 'lookLeft' | 'lookRight' | 'lookUp' | 'lookDown' | 'center';
```

#### React Best Practices

1. **Custom Hooks**: Extract reusable logic into custom hooks
2. **Component Composition**: Prefer composition over inheritance
3. **Prop Types**: Always define prop interfaces
4. **Error Boundaries**: Implement error boundaries for critical sections

#### CSS/Tailwind Guidelines

1. **Utility Classes**: Prefer Tailwind utilities over custom CSS
2. **Responsive Design**: Use mobile-first responsive patterns
3. **Accessibility**: Include focus states and ARIA attributes
4. **Consistent Spacing**: Use Tailwind spacing scale

### Performance Optimization

#### Bundle Optimization

```typescript
// Lazy load heavy components
const Session = lazy(() => import('./pages/Session'));

// Code splitting for routes
const router = createBrowserRouter([
  {
    path: '/session',
    element: <Suspense fallback={<Loading />}><Session /></Suspense>
  }
]);
```

#### Memory Management

```typescript
// Cleanup video streams
useEffect(() => {
  return () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };
}, []);
```

#### ML Model Optimization

```typescript
// Efficient MediaPipe initialization
const detector = await createDetector(SupportedModels.MediaPipeFaceMesh, {
  runtime: 'tfjs',
  refineLandmarks: true,
  maxFaces: 1 // Limit to single face for performance
});
```

## 🔧 Backend Development

### API Structure

The backend uses Next.js API routes for server functionality:

```
backend/pages/
└── sendSMS.ts              # Twilio SMS integration
```

### API Development Patterns

#### SMS Integration Example

```typescript
// pages/sendSMS.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, phrase } = req.body;

  try {
    await client.messages.create({
      body: phrase,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send SMS' });
  }
}
```

#### Error Handling Patterns

```typescript
// Standard error response
const errorResponse = (res: NextApiResponse, message: string, status = 500) => {
  return res.status(status).json({ 
    error: message,
    timestamp: new Date().toISOString()
  });
};

// Input validation
if (!to || !phrase) {
  return errorResponse(res, 'Missing required fields: to, phrase', 400);
}
```

### Database Operations

#### Supabase Integration

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// CRUD operations
export async function saveGestureMapping(sid: string, mapping: object) {
  const { data, error } = await supabase
    .from('patterns')
    .upsert({ sid, mapping }, { onConflict: 'sid' });
    
  if (error) throw error;
  return data;
}
```

## 🧪 Testing Strategy

### Frontend Testing

#### Unit Testing with Vitest

```typescript
// utils/earUtils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateEAR } from './earUtils';

describe('calculateEAR', () => {
  it('should calculate correct EAR for open eyes', () => {
    const mockLandmarks = generateMockLandmarks();
    const ear = calculateEAR(mockLandmarks);
    expect(ear).toBeGreaterThan(0.2);
  });
});
```

#### Component Testing with React Testing Library

```typescript
// components/GestureGrid.test.tsx
import { render, screen } from '@testing-library/react';
import { GestureGrid } from './GestureGrid';

test('renders gesture options', () => {
  const mapping = { singleBlink: 'Hello' };
  render(<GestureGrid mapping={mapping} />);
  
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

#### Integration Testing

```typescript
// hooks/useGestureSpeech.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useGestureSpeech } from './useGestureSpeech';

test('detects blink patterns correctly', async () => {
  const mapping = { singleBlink: 'Hello' };
  const { result } = renderHook(() => useGestureSpeech(mapping));
  
  // Mock gesture detection
  // Assert speech synthesis triggered
});
```

### Backend Testing

#### API Route Testing

```typescript
// pages/api/sendSMS.test.ts
import handler from './sendSMS';
import { createMocks } from 'node-mocks-http';

describe('/api/sendSMS', () => {
  it('sends SMS successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { to: '+1234567890', phrase: 'Test message' }
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});
```

### End-to-End Testing

#### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    permissions: ['camera'],
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
  },
});
```

#### E2E Test Examples

```typescript
// e2e/gesture-detection.spec.ts
import { test, expect } from '@playwright/test';

test('complete user flow', async ({ page, context }) => {
  // Grant camera permissions
  await context.grantPermissions(['camera']);
  
  await page.goto('/');
  await page.click('text=Start Session');
  
  // Complete calibration
  // Test gesture detection
  // Verify speech output
});
```

## 🎨 UI/UX Development

### Design System

#### Color Palette

```css
/* Tailwind custom colors */
:root {
  --primary: 212 100% 47%;
  --primary-foreground: 0 0% 98%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 90%;
  --destructive: 0 84% 60%;
}
```

#### Typography Scale

```typescript
// tailwind.config.ts
export default {
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
    }
  }
};
```

#### Component Variants

```typescript
// Using class-variance-authority (cva)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Accessibility Guidelines

#### ARIA Implementation

```tsx
// Accessible gesture button
<button
  type="button"
  aria-label={`Perform ${gesture} gesture to say "${phrase}"`}
  aria-pressed={isActive}
  onClick={onGestureSelect}
  className={cn(
    "gesture-button",
    isActive && "gesture-button-active"
  )}
>
  {phrase}
</button>
```

#### Keyboard Navigation

```tsx
// Keyboard event handling
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      onActivateGesture();
      break;
    case 'Escape':
      onCancelGesture();
      break;
  }
};
```

#### Screen Reader Support

```tsx
// Live region for gesture feedback
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {lastSpokenPhrase && `Spoke: ${lastSpokenPhrase}`}
</div>
```

## 🔄 Contributing Guidelines

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** following the guidelines below
5. **Test thoroughly** - include tests for new features
6. **Submit a pull request** with a clear description

### Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(gesture): add long blink detection
fix(speech): handle browser compatibility for Web Speech API
docs(api): update Supabase integration guide
```

### Pull Request Guidelines

#### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code is commented where necessary
- [ ] Documentation updated
- [ ] No new warnings introduced
```

#### Review Process

1. **Automated Checks**: Ensure CI passes
2. **Code Review**: At least one team member review
3. **Manual Testing**: Verify functionality works
4. **Documentation Review**: Check docs are updated
5. **Merge**: Squash and merge to main

### Code Review Standards

#### What Reviewers Look For

1. **Functionality**: Does the code work as intended?
2. **Performance**: Are there performance implications?
3. **Security**: Any security vulnerabilities?
4. **Maintainability**: Is the code readable and maintainable?
5. **Testing**: Adequate test coverage?
6. **Documentation**: Is documentation updated?

#### Giving Feedback

- **Be specific**: Point to exact lines and suggest alternatives
- **Be constructive**: Explain why something should be changed
- **Ask questions**: If something is unclear, ask for clarification
- **Acknowledge good work**: Highlight particularly good solutions

## 🚀 Deployment Process

### Development Deployment

```bash
# Deploy to staging
git push origin develop

# Automatic deployment to staging environment
# Run integration tests
# Review deployment
```

### Production Deployment

```bash
# Create release branch
git checkout -b release/v1.0.0

# Update version numbers
npm version minor

# Create pull request to main
# After approval and merge, tag release
git tag v1.0.0
git push origin v1.0.0

# Automatic production deployment
```

### Release Notes

Document changes in each release:

```markdown
# Release v1.0.0

## 🚀 New Features
- Added long blink detection
- Improved gaze tracking accuracy
- Mobile device support

## 🐛 Bug Fixes
- Fixed speech synthesis on Safari
- Corrected calibration data persistence

## 📝 Documentation
- Updated user guide
- Added troubleshooting section
```

## 🔍 Debugging and Troubleshooting

### Common Development Issues

#### MediaPipe Initialization

```typescript
// Debug MediaPipe loading
console.log('TensorFlow.js backend:', tf.getBackend());
console.log('Available backends:', tf.engine().backendNames);

// Check model loading
try {
  const detector = await createDetector(model, detectorConfig);
  console.log('MediaPipe detector created successfully');
} catch (error) {
  console.error('MediaPipe initialization failed:', error);
}
```

#### WebGazer Integration

```typescript
// Debug WebGazer state
if (window.webgazer) {
  console.log('WebGazer initialized:', window.webgazer.isReady());
  console.log('Current prediction:', window.webgazer.getCurrentPrediction());
}
```

#### Performance Profiling

```typescript
// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});
performanceObserver.observe({ entryTypes: ['measure'] });

// Mark performance points
performance.mark('gesture-detection-start');
// ... gesture detection code
performance.mark('gesture-detection-end');
performance.measure('gesture-detection', 'gesture-detection-start', 'gesture-detection-end');
```

### Development Tools

#### Browser DevTools Extensions

- **React Developer Tools**: Component inspection and profiling
- **Redux DevTools**: State management debugging (if using Redux)
- **Lighthouse**: Performance and accessibility auditing

#### VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-playwright.playwright"
  ]
}
```

---

This development guide should give you everything you need to contribute effectively to Blink Speech. Remember to keep the user's needs at the center of all development decisions!
