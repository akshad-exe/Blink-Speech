# Frontend Architecture & Implementation

This document provides a comprehensive overview of the Blink Speech frontend architecture, built with React 18, TypeScript, and Vite.

## 🏗️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: Radix UI primitives with Tailwind CSS
- **State Management**: React hooks + Context API
- **Routing**: React Router DOM
- **Data Fetching**: TanStack Query
- **Computer Vision**: MediaPipe + WebGazer.js
- **ML Framework**: TensorFlow.js

## 📱 Application Structure

### Core Pages

1. **Landing Page (`/`)**: Introduction and onboarding
2. **Calibration (`/calibration`)**: 5-point gaze calibration system
3. **Session (`/session`)**: Main gesture detection interface

### Key Features

- **Real-time Gesture Detection**: Eye blink patterns and gaze directions
- **Speech Synthesis**: Web Speech API integration
- **Customizable Mappings**: User-defined gesture-to-phrase mappings
- **Local Data Persistence**: IndexedDB via localForage
- **Privacy-First**: All processing happens client-side
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🎯 Core Functionality

### Gesture Recognition Pipeline

1. **Video Capture**: Access user's webcam with permissions
2. **Face Detection**: MediaPipe identifies facial landmarks
3. **Feature Extraction**: Calculate Eye Aspect Ratio (EAR)
4. **Pattern Recognition**: Detect blink sequences and gaze directions
5. **Mapping**: Convert gestures to phrases using user configuration
6. **Speech Output**: Synthesize speech using Web Speech API

### Supported Gestures

- **Single Blink**: Quick acknowledgment
- **Double Blink**: "Yes" responses
- **Triple Blink**: "No" responses  
- **Long Blink**: "Thank you" or "Stop"
- **Combined Gestures**: Blinks + gaze directions for complex communication

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- Modern browser with camera support
- HTTPS (required for camera access)

### Quick Start

```bash
cd frontend
npm install
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Environment Variables

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional
VITE_TARGET_FPS=15
VITE_BLINK_THRESHOLD=0.25
VITE_LOG_LEVEL=info
```

### Performance Settings

- **Target FPS**: 15 (adjustable based on device capabilities)
- **Detection Threshold**: 0.25 EAR for blink detection
- **Cooldown Period**: 1000ms between gesture detections
- **History Length**: 50 recent detection events

## 📊 Performance Optimization

### Bundle Optimization

- **Code Splitting**: Lazy loading for heavy components
- **Manual Chunks**: Separate bundles for vendor, ML, and UI libraries
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Compress images and fonts

### Runtime Optimization

- **Frame Rate Management**: Adaptive FPS based on device performance
- **Memory Management**: Efficient cleanup of video streams and ML models
- **Gesture Filtering**: Noise reduction and pattern validation
- **Caching**: Local storage for calibration and user preferences

## 🔒 Privacy & Security

### Data Protection

- **No Video Transmission**: All video processing happens locally
- **Local Storage**: Calibration data stored only on user's device
- **Optional Cloud Sync**: User controls data synchronization
- **Anonymous Sessions**: No personal information required

### Security Features

- **HTTPS Enforcement**: Required for camera access
- **Content Security Policy**: Prevents XSS attacks
- **Input Validation**: Sanitize all user inputs
- **Secure Headers**: Protection against common web vulnerabilities

## 🎨 User Interface

### Design System

- **Component Library**: Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System preference detection

### Key Components

- **GestureGrid**: Visual representation of available gestures
- **PhrasePreview**: Display current detected phrase
- **MappingEditor**: Customize gesture-to-phrase mappings
- **CalibrationDots**: Interactive calibration interface
- **VideoFeed**: Camera preview with gesture feedback

## 🧪 Testing Strategy

### Unit Tests

- **Utility Functions**: EAR calculation, gesture detection
- **Component Logic**: State management, event handling
- **Performance Functions**: Frame rate management, memory cleanup

### Integration Tests

- **Gesture Detection Pipeline**: End-to-end gesture recognition
- **Speech Synthesis**: Audio output verification
- **Data Persistence**: Local storage operations

### E2E Tests

- **User Flows**: Complete application workflows
- **Camera Permissions**: Browser permission handling
- **Cross-browser Compatibility**: Chrome, Firefox, Safari, Edge

## 📚 Additional Resources

- [Frontend Components Documentation](./frontend-components.md)
- [Gesture Detection Implementation](./gesture-detection.md)
- [Configuration Guide](./configuration.md)
- [Development Guide](./development-guide.md)

For detailed component documentation and API references, see the linked documentation files above.

