# **Technical Specification Document (Tech Spec)**
## **Project Name:** Blink Speech (MindLink)
**Version:** 1.0  
**Date:** 11-Aug-2025  
**Author:** Akshad Jogi  

---

## **1. System Overview**
Blink Speech (MindLink) is a client-side, browser-based assistive communication tool that translates blink patterns and gaze gestures into spoken phrases. It uses computer vision for eye tracking and speech synthesis for communication, with full offline support and optional cloud sync.

---

## **2. Scope & Objectives**
- Detect blink patterns and gaze directions in real-time.
- Map gestures to phrases with customizable configurations.
- Provide text-to-speech output and display the phrase in the UI.
- Store user preferences locally with optional cloud backup.

---

## **3. Architecture Overview**
**Frontend:** Next.js 14, React 18, Tailwind CSS, Zustand  
**Detection Layer:** MediaPipe FaceLandmarker (primary), WebGazer.js (fallback)  
**Storage:** localForage (IndexedDB), Supabase (PostgreSQL)  
**Speech:** Web Speech API  
**Optional Integrations:** Supabase Realtime, Twilio SMS API

**Data Flow:**
1. Webcam feed → Detection engine
2. Eye aspect ratio & gaze direction calculated
3. Pattern identified & mapped to phrase
4. Phrase output via Web Speech API and UI
5. Optionally synced to Supabase

---

## **4. Frontend Details**
### Pages:
- **Landing Page:** Session initiation, camera permissions.
- **Calibration Page:** 5-point gaze calibration stored locally.
- **Active Session Page:** Gesture detection, phrase display, mapping editor.

### Components:
- `GestureGrid` (UI for available gestures)
- `PhrasePreview` (displays selected phrase)
- `CalibrationDots` (calibration interface)
- `MappingEditor` (custom mapping UI)

---

## **5. Backend/API Details**
**Base Path:** `/api`

**Endpoints:**
1. `GET /patterns/:sid` → Returns mapping for a session ID.
2. `POST /patterns/:sid` → Saves/updates mapping.

**Database Schema (Supabase):**
| Column | Type | Description |
|--------|------|-------------|
| sid | TEXT (PK) | Session ID |
| mapping | JSONB | Gesture-to-phrase mapping |

---

## **6. Core Logic**
### Blink Detection:
- Uses EAR (Eye Aspect Ratio) to detect blinks.
- Threshold-based classification for single, double, triple, and long blinks.

### Gaze Detection:
- Determines direction based on deviation from calibrated center.

### Pattern Matching:
- Combines blink + gaze data into key (e.g., `doubleBlink_lookLeft`).
- Lookup in mapping JSON.

### Speech Output:
- Web Speech API generates spoken output.
- Phrase displayed in UI.

---

## **7. Tech Stack & Tools**
- **Frontend:** Next.js, React, Tailwind CSS, Zustand
- **Detection:** MediaPipe, WebGazer.js
- **Storage:** localForage, Supabase
- **Speech:** Web Speech API
- **Build:** pnpm, Node.js
- **Deployment:** Vercel/Netlify

---

## **8. Performance Requirements**
- Blink/gaze detection latency <150ms.
- Speech output <1s after pattern recognition.

---

## **9. Security**
- No video data leaves client unless user enables cloud sync.
- HTTPS enforced.
- API keys stored in environment variables.

---

## **10. Deployment Plan**
1. Deploy frontend & backend routes via Vercel.
2. Configure Supabase for database storage.
3. Setup environment variables.

---

## **11. Future Enhancements**
- Multi-language phrase packs.
- Adaptive gesture sensitivity.
- Mobile/tablet support.
- AI-assisted pattern detection.