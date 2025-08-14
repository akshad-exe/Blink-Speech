# Gesture Detection Implementation

This document provides detailed technical information about the computer vision and gesture recognition systems that power Blink Speech's core functionality.

## 🔬 Overview

Blink Speech uses a dual-layered approach to gesture detection:

1. **MediaPipe FaceLandmarker** for precise facial landmark detection and blink analysis
2. **WebGazer.js** for real-time gaze tracking and direction detection

The system processes video frames in real-time to detect:
- **Blink Patterns**: Single, double, triple, and long blinks
- **Gaze Directions**: Left, right, up, down, and center
- **Combined Gestures**: Blink patterns combined with gaze directions

## 🧠 Computer Vision Pipeline

### System Architecture

```
Video Stream → MediaPipe → Facial Landmarks → EAR Calculation → Blink Detection
                   ↓
WebGazer → Gaze Coordinates → Calibration → Direction Detection
                   ↓
Pattern Recognition → Gesture Mapping → Speech Synthesis
```

### Processing Flow

1. **Frame Capture**: Video frames captured at 15-30 FPS
2. **Face Detection**: MediaPipe identifies facial landmarks
3. **Feature Extraction**: Calculate Eye Aspect Ratio (EAR) and gaze coordinates
4. **Pattern Recognition**: Analyze temporal patterns for gestures
5. **Action Trigger**: Map detected patterns to phrases and trigger speech

## 👁️ Blink Detection System

### Eye Aspect Ratio (EAR) Method

The system uses the Eye Aspect Ratio method for robust blink detection:

```typescript
// MediaPipe Face Mesh landmark indices for eyes
const LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
const RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144];

export function calculateEAR(landmarks: { x: number; y: number }[]): number {
  if (!landmarks || landmarks.length < 468) {
    return 0.3; // Default open-eye value
  }

  // Calculate EAR for both eyes
  const leftEAR = calculateEyeAspectRatio(landmarks, LEFT_EYE_INDICES);
  const rightEAR = calculateEyeAspectRatio(landmarks, RIGHT_EYE_INDICES);
  
  // Return average EAR
  return (leftEAR + rightEAR) / 2;
}

function calculateEyeAspectRatio(landmarks: { x: number; y: number }[], eyeIndices: number[]): number {
  // Calculate vertical distances between eyelid landmarks
  const v1 = euclideanDistance(landmarks[eyeIndices[1]], landmarks[eyeIndices[5]]);
  const v2 = euclideanDistance(landmarks[eyeIndices[2]], landmarks[eyeIndices[4]]);
  
  // Calculate horizontal distance between eye corners
  const h = euclideanDistance(landmarks[eyeIndices[0]], landmarks[eyeIndices[3]]);
  
  // EAR formula: (v1 + v2) / (2 * h)
  return (v1 + v2) / (2 * h);
}

function euclideanDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
```

### EAR-Based Blink Detection

**Principle**: When eyes are open, EAR is approximately 0.3. During a blink, EAR drops below 0.25.

**Advantages**:
- Robust to lighting variations
- Works across different face sizes and orientations
- Real-time performance
- No additional training required

**Implementation**:
```typescript
const BLINK_THRESHOLD = 0.25;
const blinkTimestamps: number[] = [];

function processBlinks(ear: number) {
  if (ear < BLINK_THRESHOLD) {
    const now = performance.now();
    blinkTimestamps.push(now);
    
    // Clean old timestamps (keep only last 2 seconds)
    const cutoff = now - 2000;
    while (blinkTimestamps.length > 0 && blinkTimestamps[0] < cutoff) {
      blinkTimestamps.shift();
    }
  }
}
```

### Blink Pattern Recognition

The system recognizes four distinct blink patterns:

#### 1. Single Blink
- **Definition**: One blink detected
- **Duration**: Quick natural blink
- **Use Case**: Basic acknowledgment or "Hello"

```typescript
function detectSingleBlink(timestamps: number[]): boolean {
  return timestamps.length === 1;
}
```

#### 2. Double Blink
- **Definition**: Two blinks within 400ms
- **Timing Window**: Both blinks must occur within 400ms
- **Use Case**: Affirmative responses like "Yes"

```typescript
function detectDoubleBlink(timestamps: number[]): boolean {
  if (timestamps.length !== 2) return false;
  
  const timeBetween = timestamps[1] - timestamps[0];
  return timeBetween < 400;
}
```

#### 3. Triple Blink
- **Definition**: Three blinks within 700ms
- **Timing Window**: All three blinks within 700ms
- **Use Case**: Negative responses like "No"

```typescript
function detectTripleBlink(timestamps: number[]): boolean {
  if (timestamps.length !== 3) return false;
  
  const time1 = timestamps[1] - timestamps[0];
  const time2 = timestamps[2] - timestamps[1];
  const totalTime = timestamps[2] - timestamps[0];
  
  return time1 < 400 && time2 < 400 && totalTime < 700;
}
```

#### 4. Long Blink
- **Definition**: Single blink held for >800ms
- **Implementation**: Detect when EAR stays below threshold for extended period
- **Use Case**: "Thank you" or "Stop"

```typescript
function detectLongBlink(ear: number, duration: number): boolean {
  return ear < BLINK_THRESHOLD && duration > 800;
}
```

## 👀 Gaze Tracking System

### WebGazer.js Integration

WebGazer provides real-time gaze prediction using webcam video:

```typescript
// Initialize WebGazer
WebGazer.setRegression('ridge')
  .setTracker('clmtrackr')
  .setGazeListener((data: any) => {
    if (data && data.x !== null && data.y !== null) {
      processGazeData(data.x, data.y);
    }
  })
  .begin();
```

### Calibration System

**Purpose**: Map user's natural gaze to screen coordinates

**Process**:
1. User looks at 5 calibration points
2. System records gaze coordinates at each point
3. Calculates center point and threshold values
4. Stores calibration data locally

```typescript
interface CalibrationPoint {
  x: number;
  y: number;
  screenX: number;
  screenY: number;
}

interface CalibrationData {
  centerX: number;
  centerY: number;
  threshold: number;
  points: CalibrationPoint[];
  timestamp: number;
}

function calibrateGaze(points: CalibrationPoint[]): CalibrationData {
  // Calculate weighted center based on calibration points
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  
  // Calculate threshold based on point spread
  const distances = points.map(p => 
    Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2)
  );
  const threshold = Math.max(100, Math.max(...distances) * 0.7);
  
  return {
    centerX,
    centerY,
    threshold,
    points,
    timestamp: Date.now()
  };
}
```

### Gaze Direction Detection

Convert gaze coordinates to directional commands:

```typescript
type GazeDirection = 'lookLeft' | 'lookRight' | 'lookUp' | 'lookDown' | 'center';

export function getGazeDirection(x?: number, y?: number): GazeDirection {
  // Get current gaze data if coordinates not provided
  if (x === undefined || y === undefined) {
    const gazeData = getWebGazerData();
    if (!gazeData) return 'center';
    x = gazeData.x;
    y = gazeData.y;
  }

  // Use calibration data or screen center as fallback
  const centerX = calibrationData?.centerX ?? window.innerWidth / 2;
  const centerY = calibrationData?.centerY ?? window.innerHeight / 2;
  const threshold = calibrationData?.threshold ?? 100;
  
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  
  // Check if gaze is within center threshold
  if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
    return 'center';
  }
  
  // Determine primary direction based on larger displacement
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'lookRight' : 'lookLeft';
  } else {
    return deltaY > 0 ? 'lookDown' : 'lookUp';
  }
}
```

## 🔄 Pattern Recognition Engine

### Combined Gesture Detection

The system combines blink patterns with gaze directions for rich communication:

```typescript
interface GesturePattern {
  blinks: 'single' | 'double' | 'triple' | 'long';
  gaze: GazeDirection;
  key: string;
}

function detectPattern(blinkTimestamps: number[], gazeDirection: GazeDirection): string | null {
  const now = performance.now();
  
  // Filter recent blinks (within 2 seconds)
  const recentBlinks = blinkTimestamps.filter(timestamp => now - timestamp < 2000);
  
  if (recentBlinks.length === 0) return null;
  
  let blinkPattern: string;
  
  // Determine blink pattern
  if (recentBlinks.length === 1) {
    const blinkAge = now - recentBlinks[0];
    blinkPattern = blinkAge > 800 ? 'longBlink' : 'singleBlink';
  } else if (recentBlinks.length === 2) {
    const timeBetween = recentBlinks[1] - recentBlinks[0];
    blinkPattern = timeBetween < 400 ? 'doubleBlink' : 'singleBlink';
  } else if (recentBlinks.length === 3) {
    const time1 = recentBlinks[1] - recentBlinks[0];
    const time2 = recentBlinks[2] - recentBlinks[1];
    blinkPattern = (time1 < 400 && time2 < 400) ? 'tripleBlink' : 'singleBlink';
  } else {
    return null; // Too many blinks, ignore
  }
  
  // Create gesture key
  return gazeDirection === 'center' 
    ? blinkPattern 
    : `${blinkPattern}_${gazeDirection}`;
}
```

### Gesture Mapping System

Map detected patterns to phrases:

```typescript
interface GestureMapping {
  [gestureKey: string]: string;
}

const defaultMapping: GestureMapping = {
  // Basic blinks
  'singleBlink': 'Hello',
  'doubleBlink': 'Yes',
  'tripleBlink': 'No',
  'longBlink': 'Thank you',
  
  // Directional combinations
  'singleBlink_lookLeft': 'I need help',
  'singleBlink_lookRight': 'I\'m okay',
  'singleBlink_lookUp': 'Please',
  'singleBlink_lookDown': 'Stop',
  
  'doubleBlink_lookLeft': 'Nurse',
  'doubleBlink_lookRight': 'Doctor',
  'doubleBlink_lookUp': 'Water please',
  'doubleBlink_lookDown': 'I\'m tired',
  
  'tripleBlink_lookLeft': 'Family',
  'tripleBlink_lookRight': 'Emergency',
  'tripleBlink_lookUp': 'More',
  'tripleBlink_lookDown': 'Less',
  
  'longBlink_lookLeft': 'Pain',
  'longBlink_lookRight': 'Comfortable',
  'longBlink_lookUp': 'Hot',
  'longBlink_lookDown': 'Cold'
};

function mapGestureToPhrase(gestureKey: string, mapping: GestureMapping): string | null {
  return mapping[gestureKey] || null;
}
```

## ⚙️ Performance Optimization

### Frame Rate Management

```typescript
class FrameRateManager {
  private targetFps: number = 15;
  private lastFrameTime: number = 0;
  private frameInterval: number;
  
  constructor(targetFps: number = 15) {
    this.targetFps = targetFps;
    this.frameInterval = 1000 / targetFps;
  }
  
  shouldProcessFrame(): boolean {
    const now = performance.now();
    if (now - this.lastFrameTime >= this.frameInterval) {
      this.lastFrameTime = now;
      return true;
    }
    return false;
  }
  
  adaptFrameRate(cpuUsage: number) {
    if (cpuUsage > 0.8) {
      this.targetFps = Math.max(10, this.targetFps - 1);
    } else if (cpuUsage < 0.5) {
      this.targetFps = Math.min(30, this.targetFps + 1);
    }
    this.frameInterval = 1000 / this.targetFps;
  }
}
```

### Memory Management

```typescript
class GestureDetector {
  private blinkHistory: number[] = [];
  private maxHistoryLength: number = 50;
  
  addBlinkTimestamp(timestamp: number) {
    this.blinkHistory.push(timestamp);
    
    // Keep only recent history
    const cutoff = timestamp - 5000; // 5 seconds
    this.blinkHistory = this.blinkHistory.filter(t => t > cutoff);
    
    // Limit maximum history length
    if (this.blinkHistory.length > this.maxHistoryLength) {
      this.blinkHistory = this.blinkHistory.slice(-this.maxHistoryLength);
    }
  }
  
  cleanup() {
    this.blinkHistory = [];
  }
}
```

### Model Optimization

```typescript
// Optimize MediaPipe configuration for performance
const detectorConfig = {
  runtime: 'tfjs',
  refineLandmarks: true,
  maxFaces: 1, // Limit to single face for performance
  flipHorizontal: false,
  staticImageMode: false,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
};
```

## 🔧 Debugging and Diagnostics

### Performance Monitoring

```typescript
class PerformanceMonitor {
  private frameProcessingTimes: number[] = [];
  private detectionLatencies: number[] = [];
  
  recordFrameProcessing(duration: number) {
    this.frameProcessingTimes.push(duration);
    if (this.frameProcessingTimes.length > 100) {
      this.frameProcessingTimes.shift();
    }
  }
  
  recordDetectionLatency(latency: number) {
    this.detectionLatencies.push(latency);
    if (this.detectionLatencies.length > 50) {
      this.detectionLatencies.shift();
    }
  }
  
  getAverageFrameTime(): number {
    if (this.frameProcessingTimes.length === 0) return 0;
    return this.frameProcessingTimes.reduce((a, b) => a + b) / this.frameProcessingTimes.length;
  }
  
  getAverageLatency(): number {
    if (this.detectionLatencies.length === 0) return 0;
    return this.detectionLatencies.reduce((a, b) => a + b) / this.detectionLatencies.length;
  }
  
  getFPS(): number {
    const avgFrameTime = this.getAverageFrameTime();
    return avgFrameTime > 0 ? 1000 / avgFrameTime : 0;
  }
}
```

### Debug Visualization

```typescript
function drawDebugOverlay(canvas: HTMLCanvasElement, landmarks: any[], ear: number, gazeData: any) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Draw facial landmarks
  ctx.fillStyle = 'red';
  landmarks.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Draw eye contours
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  drawEyeContour(ctx, landmarks, LEFT_EYE_INDICES);
  drawEyeContour(ctx, landmarks, RIGHT_EYE_INDICES);
  
  // Display EAR value
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`EAR: ${ear.toFixed(3)}`, 10, 30);
  
  // Display gaze information
  if (gazeData) {
    ctx.fillText(`Gaze: (${gazeData.x}, ${gazeData.y})`, 10, 50);
  }
}
```

## 🎯 Accuracy and Reliability

### Noise Reduction

```typescript
class BlinkFilter {
  private blinkBuffer: boolean[] = [];
  private bufferSize: number = 3;
  
  filterBlink(isBlinking: boolean): boolean {
    this.blinkBuffer.push(isBlinking);
    
    if (this.blinkBuffer.length > this.bufferSize) {
      this.blinkBuffer.shift();
    }
    
    // Require majority consensus
    const blinkCount = this.blinkBuffer.filter(b => b).length;
    return blinkCount > this.bufferSize / 2;
  }
}
```

### Adaptive Thresholding

```typescript
class AdaptiveThreshold {
  private earHistory: number[] = [];
  private historySize: number = 100;
  
  addEAR(ear: number) {
    this.earHistory.push(ear);
    if (this.earHistory.length > this.historySize) {
      this.earHistory.shift();
    }
  }
  
  getAdaptiveThreshold(): number {
    if (this.earHistory.length < 10) {
      return 0.25; // Default threshold
    }
    
    // Calculate baseline EAR (when eyes are open)
    const sortedEARs = [...this.earHistory].sort((a, b) => b - a);
    const openEyeEAR = sortedEARs[Math.floor(sortedEARs.length * 0.75)];
    
    // Set threshold as percentage of open eye EAR
    return openEyeEAR * 0.7;
  }
}
```

### Error Handling

```typescript
class ErrorRecovery {
  private consecutiveErrors: number = 0;
  private maxErrors: number = 5;
  private recoveryCallback: () => void;
  
  constructor(recoveryCallback: () => void) {
    this.recoveryCallback = recoveryCallback;
  }
  
  handleError(error: Error): boolean {
    this.consecutiveErrors++;
    console.warn(`Gesture detection error ${this.consecutiveErrors}:`, error);
    
    if (this.consecutiveErrors >= this.maxErrors) {
      console.error('Too many consecutive errors, attempting recovery');
      this.recoveryCallback();
      this.consecutiveErrors = 0;
      return true; // Recovery attempted
    }
    
    return false; // Continue with errors
  }
  
  recordSuccess() {
    this.consecutiveErrors = 0;
  }
}
```

## 📊 Testing and Validation

### Unit Tests for Core Functions

```typescript
describe('EAR Calculation', () => {
  it('should return correct EAR for open eyes', () => {
    const mockLandmarks = generateOpenEyeLandmarks();
    const ear = calculateEAR(mockLandmarks);
    expect(ear).toBeGreaterThan(0.25);
    expect(ear).toBeLessThan(0.4);
  });
  
  it('should return low EAR for closed eyes', () => {
    const mockLandmarks = generateClosedEyeLandmarks();
    const ear = calculateEAR(mockLandmarks);
    expect(ear).toBeLessThan(0.2);
  });
});

describe('Pattern Detection', () => {
  it('should detect double blink pattern', () => {
    const timestamps = [1000, 1200]; // 200ms apart
    const pattern = detectPattern(timestamps, 'center');
    expect(pattern).toBe('doubleBlink');
  });
  
  it('should detect combined gesture', () => {
    const timestamps = [1000];
    const pattern = detectPattern(timestamps, 'lookLeft');
    expect(pattern).toBe('singleBlink_lookLeft');
  });
});
```

### Integration Testing

```typescript
describe('Gesture Detection Integration', () => {
  it('should complete full detection pipeline', async () => {
    const mockVideoElement = createMockVideoElement();
    const detector = new GestureDetector();
    
    // Mock MediaPipe detection
    const mockFaces = [{ landmarks: generateMockLandmarks() }];
    jest.spyOn(detector, 'estimateFaces').mockResolvedValue(mockFaces);
    
    const result = await detector.processFrame(mockVideoElement);
    expect(result).toBeDefined();
    expect(result.gesture).toBe('singleBlink');
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});
```

This comprehensive documentation covers all aspects of the gesture detection system, from the underlying computer vision algorithms to performance optimization and testing strategies.
