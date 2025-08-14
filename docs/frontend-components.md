# Frontend Components Documentation

This document provides detailed information about all React components, hooks, and utilities in the Blink Speech frontend application.

## 🏗️ Architecture Overview

The frontend is built with **React 18**, **TypeScript**, and **Vite**, following modern React patterns with hooks, context, and functional components.

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React hooks + Context API
- **Data Fetching**: TanStack Query

## 📁 Directory Structure

```
src/
├── components/
│   ├── ui/                 # Base UI components (Radix UI)
│   ├── landing/           # Landing page components
│   └── session/           # Session interface components
├── hooks/                 # Custom React hooks
├── pages/                 # Route components
├── utils/                 # Utility functions
├── api/                   # API client functions
└── types/                 # TypeScript definitions
```

## 🧩 Core Components

### Pages Components

#### `Index.tsx` - Landing Page

The main landing page component that introduces users to Blink Speech.

```typescript
import HeroSection from "@/components/landing/HeroSection";
import AccessibilityFeatures from "@/components/landing/AccessibilityFeatures";
import GetStartedSection from "@/components/landing/GetStartedSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AccessibilityFeatures />
      <GetStartedSection />
    </div>
  );
};
```

**Features:**
- Hero section with call-to-action
- Feature highlights
- Getting started flow
- Responsive design

#### `Calibration.tsx` - Gaze Calibration Interface

Handles the 5-point gaze calibration process essential for accurate detection.

```typescript
interface CalibrationPoint {
  x: number;
  y: number;
  id: number;
}

const Calibration = () => {
  const [currentPoint, setCurrentPoint] = useState(0);
  const [calibrationPoints, setCalibrationPoints] = useState<CalibrationPoint[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const handlePointClick = (point: CalibrationPoint) => {
    // Save calibration point
    setCalibrationPoints(prev => [...prev, point]);
    
    if (currentPoint < 4) {
      setCurrentPoint(prev => prev + 1);
    } else {
      completeCalibration();
    }
  };
  
  const completeCalibration = () => {
    // Calculate calibration center and save to localStorage
    const centerX = calibrationPoints.reduce((sum, p) => sum + p.x, 0) / calibrationPoints.length;
    const centerY = calibrationPoints.reduce((sum, p) => sum + p.y, 0) / calibrationPoints.length;
    
    localStorage.setItem('blinkSpeechCalibration', JSON.stringify({
      centerX,
      centerY,
      threshold: 100,
      points: calibrationPoints,
      timestamp: Date.now()
    }));
    
    setIsComplete(true);
  };
  
  // Component JSX...
};
```

**Features:**
- 5-point calibration system
- Visual feedback for current point
- Progress tracking
- Calibration data persistence
- Error handling and retry logic

#### `Session.tsx` - Main Application Interface

The primary interface where users perform gesture detection and communication.

```typescript
const Session = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [gestureMapping, setGestureMapping] = useState(defaultMapping);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  
  // Initialize gesture detection
  const { videoRef, isInitialized, isDetecting } = useGestureSpeech(
    gestureMapping,
    {
      onGestureDetected: handleGestureDetected,
      onPhraseSpoken: handlePhraseSpoken
    }
  );
  
  const handleGestureDetected = (gesture: string) => {
    const phrase = gestureMapping[gesture];
    if (phrase) {
      setCurrentPhrase(phrase);
      if (isSpeechEnabled) {
        speakPhrase(phrase);
      }
    }
  };
  
  // Component JSX with video feed, gesture grid, controls...
};
```

**Features:**
- Real-time gesture detection
- Video feed management
- Speech synthesis controls
- Gesture mapping customization
- Camera permission handling
- Settings panel

### Landing Page Components

#### `HeroSection.tsx`

```typescript
const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Turning blinks and gaze into{" "}
          <span className="text-blue-600">voice</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Communication without boundaries for those who cannot speak or type.
          Use eye movements to express yourself through speech synthesis.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/calibration')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Start Session
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToFeatures()}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};
```

#### `AccessibilityFeatures.tsx`

Showcases the accessibility benefits and use cases.

```typescript
const AccessibilityFeatures = () => {
  const features = [
    {
      icon: <Eye className="h-8 w-8 text-blue-600" />,
      title: "Eye-Based Communication",
      description: "Use natural blink patterns and gaze directions to communicate"
    },
    {
      icon: <Mic className="h-8 w-8 text-green-600" />,
      title: "Speech Synthesis",
      description: "Convert gestures to spoken words using Web Speech API"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Privacy First",
      description: "All processing happens locally - no video data transmitted"
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
```

### Session Components

#### `GestureGrid.tsx`

Displays available gestures and their mapped phrases.

```typescript
interface GestureGridProps {
  mapping: Record<string, string>;
  onGestureSelect?: (gesture: string) => void;
  activeGesture?: string;
}

export const GestureGrid: React.FC<GestureGridProps> = ({
  mapping,
  onGestureSelect,
  activeGesture
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {Object.entries(mapping).map(([gesture, phrase]) => (
        <GestureCard
          key={gesture}
          gesture={gesture}
          phrase={phrase}
          isActive={activeGesture === gesture}
          onClick={() => onGestureSelect?.(gesture)}
        />
      ))}
    </div>
  );
};

const GestureCard: React.FC<{
  gesture: string;
  phrase: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ gesture, phrase, isActive, onClick }) => {
  const gestureDisplay = formatGestureName(gesture);
  
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Perform ${gestureDisplay} gesture to say "${phrase}"`}
      className={cn(
        "p-4 rounded-lg border-2 transition-all duration-200",
        "hover:bg-gray-50 focus:ring-2 focus:ring-blue-500",
        isActive 
          ? "border-green-500 bg-green-50" 
          : "border-gray-200 bg-white"
      )}
    >
      <div className="text-sm font-medium text-gray-700 mb-1">
        {gestureDisplay}
      </div>
      <div className="text-lg font-semibold text-gray-900">
        "{phrase}"
      </div>
    </button>
  );
};
```

#### `PhrasePreview.tsx`

Shows the last detected phrase and provides manual speech trigger.

```typescript
interface PhrasePreviewProps {
  phrase: string;
  isEnabled: boolean;
  onSpeak: () => void;
  onClear: () => void;
}

export const PhrasePreview: React.FC<PhrasePreviewProps> = ({
  phrase,
  isEnabled,
  onSpeak,
  onClear
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Current Phrase
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSpeak}
            disabled={!phrase || !isEnabled}
            aria-label="Speak current phrase"
          >
            <Volume2 className="h-4 w-4 mr-1" />
            Speak
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={!phrase}
            aria-label="Clear current phrase"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="min-h-[60px] flex items-center">
        {phrase ? (
          <p className="text-2xl font-medium text-gray-800 leading-relaxed">
            "{phrase}"
          </p>
        ) : (
          <p className="text-gray-500 italic">
            Perform a gesture to generate speech...
          </p>
        )}
      </div>
      
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {phrase && `Current phrase: ${phrase}`}
      </div>
    </div>
  );
};
```

#### `MappingEditor.tsx`

Allows users to customize gesture-to-phrase mappings.

```typescript
interface MappingEditorProps {
  mapping: Record<string, string>;
  onUpdate: (newMapping: Record<string, string>) => void;
}

export const MappingEditor: React.FC<MappingEditorProps> = ({
  mapping,
  onUpdate
}) => {
  const [editingGesture, setEditingGesture] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  
  const handleStartEdit = (gesture: string) => {
    setEditingGesture(gesture);
    setEditValue(mapping[gesture] || "");
  };
  
  const handleSaveEdit = () => {
    if (editingGesture && editValue.trim()) {
      onUpdate({
        ...mapping,
        [editingGesture]: editValue.trim()
      });
    }
    setEditingGesture(null);
    setEditValue("");
  };
  
  const handleCancelEdit = () => {
    setEditingGesture(null);
    setEditValue("");
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Customize Mappings</h3>
      
      <div className="space-y-2">
        {Object.entries(mapping).map(([gesture, phrase]) => (
          <div key={gesture} className="flex items-center gap-2 p-2 border rounded">
            <div className="min-w-[120px] text-sm font-medium text-gray-700">
              {formatGestureName(gesture)}
            </div>
            
            {editingGesture === gesture ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Enter phrase..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-between">
                <span className="text-gray-900">"{phrase}"</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStartEdit(gesture)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🎣 Custom Hooks

### `useGestureSpeech.ts` - Main Detection Hook

The core hook that handles gesture detection and speech synthesis.

```typescript
interface GestureSpeechOptions {
  onGestureDetected?: (gesture: string) => void;
  onPhraseSpoken?: (phrase: string) => void;
  blinkThreshold?: number;
  cooldownMs?: number;
}

export function useGestureSpeech(
  mapping: Record<string, string>, 
  options: GestureSpeechOptions = {}
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [detector, setDetector] = useState<mp.FaceLandmarksDetector | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const blinkTimestamps = useRef<number[]>([]);
  const lastSpokenTime = useRef<number>(0);
  
  const {
    onGestureDetected,
    onPhraseSpoken,
    blinkThreshold = 0.25,
    cooldownMs = 1000
  } = options;
  
  // Initialize MediaPipe and WebGazer
  useEffect(() => {
    async function init() {
      try {
        // Initialize TensorFlow.js backend
        await tf.setBackend('webgl');
        await tf.ready();
        
        // Create MediaPipe detector
        const model = mp.SupportedModels.MediaPipeFaceMesh;
        const det = await mp.createDetector(model, {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 1
        });
        setDetector(det);
        
        // Setup video stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        
        // Initialize WebGazer
        WebGazer.setRegression('ridge')
          .setTracker('clmtrackr')
          .setGazeListener((data: any) => {
            if (data && data.x !== null && data.y !== null) {
              setCalibrationData(data.x, data.y, 100);
            }
          })
          .begin();
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize gesture detection:', error);
      }
    }
    
    init();
    
    return () => {
      WebGazer.end();
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Pattern detection logic
  const detectPattern = useCallback((blinks: number[], gazeDir: string): string | null => {
    const now = performance.now();
    const recentBlinks = blinks.filter(timestamp => now - timestamp < 2000);
    
    if (recentBlinks.length === 0) return null;
    
    // Single blink patterns
    if (recentBlinks.length === 1) {
      return gazeDir !== 'center' ? `singleBlink_${gazeDir}` : 'singleBlink';
    }
    
    // Double blink patterns
    if (recentBlinks.length === 2) {
      const timeBetween = recentBlinks[1] - recentBlinks[0];
      if (timeBetween < 400) {
        return gazeDir !== 'center' ? `doubleBlink_${gazeDir}` : 'doubleBlink';
      }
    }
    
    // Triple blink patterns
    if (recentBlinks.length === 3) {
      const time1 = recentBlinks[1] - recentBlinks[0];
      const time2 = recentBlinks[2] - recentBlinks[1];
      if (time1 < 400 && time2 < 400) {
        return gazeDir !== 'center' ? `tripleBlink_${gazeDir}` : 'tripleBlink';
      }
    }
    
    return null;
  }, []);
  
  // Main detection loop
  useEffect(() => {
    if (!isInitialized || !detector) return;
    
    let animationId: number;
    setIsDetecting(true);
    
    async function detect() {
      if (!videoRef.current || videoRef.current.readyState !== 4) {
        animationId = requestAnimationFrame(detect);
        return;
      }
      
      try {
        const faces = await detector.estimateFaces(videoRef.current);
        
        if (faces.length > 0) {
          const landmarks = faces[0].keypoints;
          const ear = calculateEAR(landmarks);
          const gazeDir = getGazeDirection();
          
          // Detect blink
          if (ear < blinkThreshold) {
            const now = performance.now();
            blinkTimestamps.current.push(now);
            
            // Clean old timestamps
            blinkTimestamps.current = blinkTimestamps.current.filter(
              timestamp => now - timestamp < 2000
            );
          }
          
          // Check for pattern
          const pattern = detectPattern(blinkTimestamps.current, gazeDir);
          if (pattern && pattern in mapping) {
            const now = performance.now();
            if (now - lastSpokenTime.current > cooldownMs) {
              const phrase = mapping[pattern];
              
              onGestureDetected?.(pattern);
              speakPhrase(phrase);
              onPhraseSpoken?.(phrase);
              
              lastSpokenTime.current = now;
              blinkTimestamps.current = []; // Clear after successful detection
            }
          }
        }
      } catch (error) {
        console.error('Detection error:', error);
      }
      
      animationId = requestAnimationFrame(detect);
    }
    
    detect();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      setIsDetecting(false);
    };
  }, [isInitialized, detector, mapping, detectPattern, onGestureDetected, onPhraseSpoken, blinkThreshold, cooldownMs]);
  
  // Load calibration data
  useEffect(() => {
    const calibrationData = localStorage.getItem('blinkSpeechCalibration');
    if (calibrationData) {
      try {
        const { centerX, centerY, threshold } = JSON.parse(calibrationData);
        setCalibrationData(centerX, centerY, threshold);
      } catch (error) {
        console.error('Failed to load calibration data:', error);
      }
    }
  }, []);
  
  return {
    videoRef,
    isInitialized,
    isDetecting
  };
}
```

### `use-toast.ts` - Toast Notification Hook

Manages toast notifications throughout the application.

```typescript
interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (props: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...props, id }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);
  
  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}
```

## 🛠️ Utility Functions

### Gesture Detection Utilities

**`earUtils.ts`** - Eye Aspect Ratio calculations:
```typescript
// MediaPipe Face Mesh landmark indices for eyes
const LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
const RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144];

export function calculateEAR(landmarks: { x: number; y: number }[]): number {
  if (!landmarks || landmarks.length < 468) {
    return 0.3; // Default value
  }

  const leftEAR = calculateEyeAspectRatio(landmarks, LEFT_EYE_INDICES);
  const rightEAR = calculateEyeAspectRatio(landmarks, RIGHT_EYE_INDICES);
  
  return (leftEAR + rightEAR) / 2;
}

function calculateEyeAspectRatio(landmarks: { x: number; y: number }[], eyeIndices: number[]): number {
  const v1 = euclideanDistance(landmarks[eyeIndices[1]], landmarks[eyeIndices[5]]);
  const v2 = euclideanDistance(landmarks[eyeIndices[2]], landmarks[eyeIndices[4]]);
  const h = euclideanDistance(landmarks[eyeIndices[0]], landmarks[eyeIndices[3]]);
  
  return (v1 + v2) / (2 * h);
}
```

**`gazeUtils.ts`** - Gaze direction detection:
```typescript
interface GazeData {
  x: number;
  y: number;
  confidence: number;
}

let calibrationData: { centerX: number; centerY: number; threshold: number } | null = null;

export function setCalibrationData(centerX: number, centerY: number, threshold: number = 100) {
  calibrationData = { centerX, centerY, threshold };
}

export function getGazeDirection(x?: number, y?: number): string {
  if (x === undefined || y === undefined) {
    const gazeData = getWebGazerData();
    if (gazeData) {
      x = gazeData.x;
      y = gazeData.y;
    } else {
      return 'center';
    }
  }

  const centerX = calibrationData?.centerX ?? window.innerWidth / 2;
  const centerY = calibrationData?.centerY ?? window.innerHeight / 2;
  const threshold = calibrationData?.threshold ?? 100;
  
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  
  if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
    return 'center';
  }
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'lookRight' : 'lookLeft';
  } else {
    return deltaY > 0 ? 'lookDown' : 'lookUp';
  }
}
```

**`speechSynthesis.ts`** - Speech synthesis wrapper:
```typescript
export function speakPhrase(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech Synthesis API not supported in this browser');
  }
}
```

## 🎨 UI Components

### Base Components (from Radix UI)

The application uses a comprehensive set of UI components built on Radix UI primitives:

- **Button** - Various button styles and states
- **Input** - Form inputs with validation
- **Dialog** - Modal dialogs and overlays
- **Toast** - Notification system
- **Card** - Content containers
- **Badge** - Status indicators
- **Separator** - Visual dividers
- **Tooltip** - Contextual help
- **Select** - Dropdown selections
- **Switch** - Toggle controls

### Component Styling

All components use Tailwind CSS with a custom design system:

```typescript
// Example button component
const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## 🔧 Performance Optimizations

### Code Splitting
```typescript
// Lazy load heavy components
const Session = lazy(() => import('./pages/Session'));
const Calibration = lazy(() => import('./pages/Calibration'));

// Route-based splitting
const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/calibration',
    element: <Suspense fallback={<Loading />}><Calibration /></Suspense>
  },
  {
    path: '/session',
    element: <Suspense fallback={<Loading />}><Session /></Suspense>
  }
]);
```

### Memory Management
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

// Cleanup ML models
useEffect(() => {
  return () => {
    detector?.dispose();
  };
}, [detector]);
```

### Optimized Rendering
```typescript
// Memoize expensive calculations
const gesturePattern = useMemo(() => {
  return detectPattern(blinkTimestamps, gazeDirection);
}, [blinkTimestamps, gazeDirection]);

// Callback optimization
const handleGestureDetected = useCallback((gesture: string) => {
  // Handle gesture detection
}, []);
```

This comprehensive documentation covers all the major frontend components, hooks, and utilities in Blink Speech, providing developers with the information needed to understand, maintain, and extend the application.
