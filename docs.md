# Blink Speech (MindLink): Technical Documentation

**Blink Speech** is a browser-based application that transforms intentional blink patterns and gaze gestures into spoken phrases. It operates entirely client-side, ensuring user privacy with a zero-install, anonymous-first approach. 👁️‍🗨️ → 🗣️

---

## Core Concepts

The system translates eye movements into speech by detecting two primary inputs via the user's webcam: **blink patterns** and **gaze direction**. These inputs are then combined to trigger pre-configured or custom phrases.

### Blink & Gaze Detection

The application uses a combination of **MediaPipe FaceLandmarker** for high-fidelity facial landmark tracking and **WebGazer.js** as a fallback.

* **Blink Patterns**: Detected by calculating the **Eye Aspect Ratio (EAR)** from facial landmarks. A sudden drop in EAR below a dynamic threshold registers a blink.
    * **Double-Blink**: Two blinks detected within **400ms**.
    * **Triple-Blink**: Three blinks detected within **700ms**.
    * **Long Blink**: A single blink held for over **800ms**.
* **Gaze Direction**: Determined by tracking the directional delta of the user's gaze from a calibrated center point (e.g., "look-left", "look-right").

### Pattern-to-Phrase Mapping

Detected patterns are mapped to phrases using a simple JSON structure. Users can rely on a default phrase pack or create their own "Personal Blink Language."

* **Mapping Logic**: A combined pattern forms a key (e.g., `"tripleBlink_lookRight"`). The application looks up this key in the mapping file to find the corresponding phrase (e.g., `"Yes"`).
* **Customization**: Users can edit this JSON mapping directly in the UI to assign any phrase to any supported gesture combination.

```json
{
  "doubleBlink_lookLeft": "Help",
  "tripleBlink_lookRight": "Yes",
  "longBlink": "Stop",
  "lookUp": "Water please"
}
```

-----

## Feature Flow

The user journey is designed to be simple and intuitive, from initial setup to active use.

1.  **Landing & Permissions**: The user opens the app and clicks **"Start Session"**. The browser prompts for camera permissions via `navigator.mediaDevices.getUserMedia({video: true})`.
2.  **Session Initialization**: Upon granting permission, a unique session ID (`sid`) is generated using `crypto.randomUUID()` and stored in `localStorage`.
3.  **Gaze Calibration**: The user is guided to click on five sequential dots on the screen. The app captures the gaze coordinates at each click to create a persistent calibration profile, stored locally using **IndexedDB** (via `localForage`).
4.  **Active Session**: The main interface displays a grid of possible gestures and a preview bar for the selected phrase.
5.  **Detection & Speech**:
      * The app continuously processes the video feed to detect blink and gaze patterns.
      * When a valid pattern is recognized, it's matched against the user's mapping (custom or default).
      * The corresponding phrase is spoken aloud using the browser's native **Web Speech API**.
      * The spoken phrase is also displayed in the UI and can trigger an optional WebSocket event for external logging or integration.

-----

## Technical Implementation

### Project Initialization

```bash
# Initialize project and install dependencies
git init blink-speech
cd blink-speech
pnpm init -y
pnpm add next@14 react@18 webgazer @tensorflow-models/face-landmarks-detection @tensorflow/tfjs supabase-js localforage tailwindcss zustand

# Setup environment variables in .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # For edge functions
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

-----

## Tech Stack

-----

## Resources

| Component | Description & Official Link |
| :--- | :--- |
| **MediaPipe FaceLandmarker** | High-fidelity face/iris landmarks for robust EAR calculation. <br/> [ai.google.dev/edge/mediapipe](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js) |
| **WebGazer.js** | In-browser gaze tracking, used as a fallback. <br/> [webgazer.cs.brown.edu](https://webgazer.cs.brown.edu) |
| **Web Speech API** | Browser-native Text-to-Speech (TTS) engine. <br/> [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) |
| **Supabase** | Backend for storing user pattern mappings and logs. <br/> [supabase.com](https://supabase.com) |
| **localForage** | Wrapper for IndexedDB for persistent client-side storage. <br/> [localforage.github.io/localForage](https://localforage.github.io/localForage/) |
| **EAR Blink Detection** | Academic paper on the Eye Aspect Ratio method. <br/> [vision.fe.uni-lj.si](http://vision.fe.uni-lj.si/cvww2016/proceedings/papers/05.pdf) |

```
