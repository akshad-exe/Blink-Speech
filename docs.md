# Blink Speech: Complete Technical Documentation

> **Turning blinks and gaze into voice – communication without boundaries.**

**Blink Speech** is a browser-based assistive communication application that transforms intentional blink patterns and gaze gestures into spoken phrases. Built with modern web technologies, it operates entirely client-side, ensuring user privacy with a zero-install, anonymous-first approach. 👁️‍🗨️ → 🗣️

---

## 📚 **Documentation Navigation**

### 🚀 **Getting Started**
- [**📖 Complete Documentation Suite**](./docs/README.md) - Main documentation hub
- [**🛠️ Installation Guide**](./docs/installation.md) - Setup for development and production
- [**👤 User Guide**](./docs/user-guide.md) - How to use Blink Speech effectively
- [**🔧 Configuration**](./docs/configuration.md) - Environment variables and settings

### 🏗️ **Architecture & Development**
- [**🏛️ System Architecture**](./docs/architecture.md) - Technical design and data flow
- [**💻 Development Guide**](./docs/development-guide.md) - Developer workflows and best practices
- [**🧩 Frontend Components**](./docs/frontend-components.md) - React components and hooks
- [**🔗 API Documentation**](./docs/api-documentation.md) - Backend endpoints and database

### 🔬 **Core Technologies**
- [**👁️ Gesture Detection**](./docs/gesture-detection.md) - Computer vision implementation
- [**🎵 Speech Synthesis**](./docs/speech-synthesis.md) - Text-to-speech integration
- [**🌐 Frontend Architecture**](./docs/frontend.md) - React + Vite implementation

### 🚀 **Operations**
- [**🚀 Deployment Guide**](./docs/deployment.md) - Production deployment strategies
- [**🔍 Troubleshooting**](./docs/troubleshooting.md) - Common issues and solutions

---

## 🛠️ **Current Tech Stack**

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![WebGazer.js](https://img.shields.io/badge/WebGazer.js-FF6F00?style=for-the-badge&logo=javascript&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-4285F4?style=for-the-badge&logo=google&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_API-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Web Speech API](https://img.shields.io/badge/Web_Speech_API-FF4081?style=for-the-badge&logo=googlechrome&logoColor=white)

---

## 🎯 **Quick Start**

1. **📥 Clone & Install**
   ```bash
   git clone https://github.com/atharhive/Blink-Speech.git
   cd Blink-Speech
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **⚙️ Configure Environment**
   - Set up [Supabase](https://supabase.com) project
   - Configure environment variables (see [Configuration Guide](./docs/configuration.md))

3. **🚀 Run Development**
   ```bash
   # Frontend (Terminal 1)
   cd frontend && npm run dev
   
   # Backend (Terminal 2)  
   cd backend && npm run dev
   ```

4. **🎯 Start Using**
   - Open `https://localhost:5173`
   - Allow camera permissions
   - Complete calibration
   - Start communicating with gestures!

---

## 🧠 **Core Concepts**

Blink Speech uses advanced computer vision to translate eye movements into speech by detecting two primary inputs via the user's webcam: **blink patterns** and **gaze directions**. These inputs are combined to trigger pre-configured or fully customizable phrases.

### 🎯 **Supported Gestures**

| Gesture Type | Pattern | Default Phrase | Use Case |
|-------------|---------|----------------|----------|
| **Single Blink** | One quick blink | "Hello" | Acknowledgment |
| **Double Blink** | Two blinks within 400ms | "Yes" | Affirmative |
| **Triple Blink** | Three blinks within 700ms | "No" | Negative |
| **Long Blink** | Hold blink >800ms | "Thank you" | Gratitude |
| **Blink + Gaze** | Any blink + direction | Custom phrases | Complex communication |

### 🌍 **Real-World Applications**

- **🏥 Healthcare**: ICU patients, post-surgery communication, locked-in syndrome
- **♿ Accessibility**: ALS, muscular dystrophy, motor impairments
- **⏰ Temporary**: Speech loss recovery, oral surgery, intubation
- **🚨 Emergency**: When traditional communication fails

### 🔬 **Detection Technology**

**Primary System**: MediaPipe FaceLandmarker for high-precision facial landmark tracking  
**Fallback System**: WebGazer.js for broader browser compatibility

#### **Blink Detection (EAR Method)**
- **Algorithm**: Eye Aspect Ratio (EAR) calculation using facial landmarks
- **Threshold**: Dynamic threshold adjustment (typically ~0.25)
- **Patterns**: Single, double (400ms), triple (700ms), long (800ms+) blinks
- **Accuracy**: >95% detection rate in optimal conditions

#### **Gaze Tracking**
- **Calibration**: 5-point calibration system for personalized tracking
- **Directions**: Left, right, up, down, center detection
- **Precision**: ±100px threshold (adjustable)
- **Persistence**: Calibration data stored locally

### 🗂️ **Gesture-to-Speech Mapping**

**Default Mappings**: Pre-configured essential phrases for immediate use  
**Custom Mappings**: Fully user-customizable through intuitive interface  
**Storage**: Local browser storage with optional cloud sync via Supabase

#### **Mapping Structure**
```json
{
  "singleBlink": "Hello",
  "doubleBlink": "Yes", 
  "tripleBlink": "No",
  "longBlink": "Thank you",
  "singleBlink_lookLeft": "I need help",
  "doubleBlink_lookUp": "Water please",
  "tripleBlink_lookRight": "Emergency",
  "longBlink_lookDown": "I'm tired"
}
```

#### **Customization Features**
- **🎨 Visual Editor**: Point-and-click gesture mapping interface
- **📱 Import/Export**: Share mappings between devices
- **🌐 Multi-language**: Support for any language or phrase
- **🔄 Real-time Updates**: Changes applied instantly

-----

## 🔄 **User Journey & Features**

### **1. 🚀 Onboarding (First-Time Users)**
- **Welcome**: Introduction to Blink Speech capabilities
- **Permissions**: Secure camera access request with clear explanations
- **Calibration**: Interactive 5-point gaze calibration with visual feedback
- **Tutorial**: Optional gesture practice with real-time feedback

### **2. 🎯 Active Session**
- **Live Detection**: Real-time gesture recognition with visual indicators
- **Phrase Preview**: Clear display of detected phrases before speaking
- **Custom Controls**: Speech toggle, volume, rate, and voice selection
- **Mapping Editor**: Live editing of gesture-to-phrase mappings

### **3. 🔧 Advanced Features**
- **Performance Optimization**: Adaptive frame rate and threshold adjustment
- **Accessibility**: High contrast, large text, screen reader compatibility  
- **Emergency Mode**: Quick access to critical communication phrases
- **Data Management**: Export/import settings, cloud sync options

### **4. 🛡️ Privacy & Security**
- **Local Processing**: All video analysis happens on-device
- **No Data Transmission**: Video never leaves your browser
- **Secure Storage**: Encrypted local storage for sensitive settings
- **Anonymous Usage**: No personal information required or collected

-----

---

## ⚡ **Performance & Specifications**

### **System Requirements**
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Hardware**: 2GB RAM, webcam (720p recommended)
- **Network**: HTTPS required (automatic in development)
- **Storage**: ~50MB for full application cache

### **Performance Metrics**
- **Detection Latency**: <150ms from gesture to recognition
- **Speech Latency**: <1s from gesture to audio output
- **Frame Rate**: 15-30 FPS (adaptive based on device)
- **Accuracy**: >95% gesture recognition in optimal conditions

### **Browser Compatibility**
| Feature | Chrome | Firefox | Safari | Edge |
|---------|:------:|:-------:|:------:|:----:|
| MediaPipe | ✅ | ✅ | ✅ | ✅ |
| WebGazer | ✅ | ✅ | ⚠️ | ✅ |
| Speech API | ✅ | ✅ | ✅ | ✅ |
| IndexedDB | ✅ | ✅ | ✅ | ✅ |

---

## 🔧 **Technical Implementation**

### **Current Architecture**

```
┌─────────────────────────────────────────┐
│           CLIENT (Browser)              │
├─────────────────────────────────────────┤
│  React 18 + TypeScript + Vite          │
│  ├─ MediaPipe (Face Landmarks)         │
│  ├─ WebGazer.js (Gaze Tracking)        │
│  ├─ Web Speech API (TTS)               │
│  ├─ LocalForage (Data Storage)         │
│  └─ Radix UI + Tailwind (Interface)    │
└─────────────────────────────────────────┘
                    │ HTTPS/WSS
┌─────────────────────────────────────────┐
│           SERVER (API)                  │
├─────────────────────────────────────────┤
│  Next.js API Routes                    │
│  ├─ Supabase (Database)                │
│  ├─ Twilio (SMS Integration)           │
│  └─ Authentication & Storage           │
└─────────────────────────────────────────┘
```

### **Project Structure**
```
Blink-Speech/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Route components  
│   │   ├── utils/      # Utility functions
│   │   └── types/      # TypeScript definitions
│   └── package.json
├── backend/           # Next.js API routes
│   ├── pages/api/     # API endpoints
│   └── package.json
├── docs/             # Complete documentation
└── README.md         # Project overview
```

### Gesture Recognition Logic

This logic resides in a custom hook (e.g., `hooks/useGestureSpeech.ts`) that processes the video feed.

```ts
// Simplified logic for frame processing
let blinkTimestamps: number[] = [];

async function processFrame(videoElement) {
  // Prefer MediaPipe for high-fidelity landmarks
  const faces = await mediaPipeModel.estimateFaces({ input: videoElement });
  
  if (faces.length > 0) {
    const landmarks = faces[0].scaledMesh;
    const ear = calculateEAR(landmarks); // Calculate Eye Aspect Ratio
    const gazeDir = gazeDirection(landmarks);

    if (ear < DYNAMIC_BLINK_THRESHOLD) {
      blinkTimestamps.push(performance.now());
    }
    // Detect pattern from timestamps and gaze, then speak
    detectPatternAndSpeak(blinkTimestamps, gazeDir); 
  } else {
    // Fallback to WebGazer if MediaPipe fails
    // WebGazer can use brightness of eye patches as a proxy
  }
}
```

### API Endpoints & Data Persistence

Custom phrase mappings are stored in a **Supabase** database and accessed via a Next.js API route.

**Database Schema:**

  * **Table**: `patterns`
  * **Columns**:
      * `sid`: `TEXT PRIMARY KEY`
      * `mapping`: `JSONB`

**API Route**: `pages/api/patterns/[sid].ts`

```ts
// pages/api/patterns/[sid].ts
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { sid } = req.query;

  if (req.method === 'GET') {
    const { data } = await sb.from('patterns').select('mapping').eq('sid', sid).single();
    // Return custom mapping or a default one
    res.status(200).json({ mapping: data?.mapping ?? defaultMapping });
  } 
  else if (req.method === 'POST') {
    const { mapping } = req.body;
    // 'upsert' creates or updates the user's mapping
    await sb.from('patterns').upsert({ sid, mapping }, { onConflict: 'sid' });
    res.status(201).json({ success: true });
  }
}
```

### Text-to-Speech (TTS)

A simple utility function wraps the Web Speech API for easy use.

```ts
// lib/tts.ts
export function speak(text: string, lang = 'en-US') {
  if (!text || typeof window === 'undefined') return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}
```


---

## 🚀 **Getting Started - Next Steps**

### **For Users**
1. 📖 Read the [User Guide](./docs/user-guide.md) for detailed usage instructions
2. 🔧 Check [Troubleshooting](./docs/troubleshooting.md) if you encounter issues
3. ⚙️ Learn about [Configuration](./docs/configuration.md) options

### **For Developers**
1. 🛠️ Follow the [Installation Guide](./docs/installation.md) for setup
2. 💻 Read the [Development Guide](./docs/development-guide.md) for workflows  
3. 🏗️ Understand the [Architecture](./docs/architecture.md) design
4. 🧩 Explore [Component Documentation](./docs/frontend-components.md)

### **For Deployment**
1. 🚀 Follow the [Deployment Guide](./docs/deployment.md) for production
2. 🔒 Review security considerations and best practices
3. 📊 Set up monitoring and analytics

---

## 📚 **Additional Resources**

| Category | Name & Link | Purpose |
|----------|-------------|---------|
| **Eye Tracking** | [WebGazer.js](https://webgazer.cs.brown.edu/) | Browser-based gaze tracking using webcam, works without extra hardware. |
| **Eye Tracking** | [MediaPipe FaceLandmarker (Web)](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js) | High-fidelity facial & iris landmark detection in browser via TensorFlow.js. |
| **Blink Detection** | [Eye Aspect Ratio (EAR) Method](https://www.pyimagesearch.com/2017/04/24/eye-blink-detection-opencv-python-dlib/) | Technique for blink detection using facial landmarks and aspect ratio. |
| **Blink Detection Example Code** | [LearnOpenCV Eye Blink Detection](https://github.com/spmallick/learnopencv/tree/master/Eye-Blink-Detection) | OpenCV + Dlib implementation of EAR blink detection. |
| **Speech Output** | [Web Speech API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) | Browser-native Text-to-Speech and speech recognition APIs. |
| **Speech Output (Python)** | [gTTS – Google Text-to-Speech](https://github.com/pndurette/gTTS) | Server-side text-to-speech library in Python. |
| **Frontend Framework** | [Next.js](https://nextjs.org/) | React framework for building full-stack web apps. |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight state management library for React. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for styling. |
| **Persistent Storage** | [localForage](https://localforage.github.io/localForage/) | Wrapper for IndexedDB, WebSQL, and localStorage for storing calibration data. |
| **Backend & DB** | [Supabase](https://supabase.com/) | Backend-as-a-service with PostgreSQL, authentication, and serverless functions. |
| **Real-time Communication** | [Supabase Realtime](https://supabase.com/docs/guides/realtime) | WebSocket-based real-time updates from Supabase. |
| **Optional SMS API** | [Twilio SMS API](https://www.twilio.com/docs/sms) | Send phrases as SMS messages programmatically. |
| **Computer Vision Library** | [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html) | JavaScript version of OpenCV for image/video analysis. |
| **ML Models in JS** | [TensorFlow.js](https://www.tensorflow.org/js) | Run ML models directly in the browser. |
| **Gesture Tracking Example** | [GazeTracking (Python)](https://github.com/antoinelame/GazeTracking) | Eye movement tracking library for Python, useful for prototyping. |

