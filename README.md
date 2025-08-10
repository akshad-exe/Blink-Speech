# Blink Speech (MindLink)

> **Turning blinks and gaze into voice – communication without boundaries.**

## 🛠 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![WebGazer.js](https://img.shields.io/badge/WebGazer.js-FF6F00?style=for-the-badge&logo=javascript&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![localForage](https://img.shields.io/badge/localForage-FFA500?style=for-the-badge&logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-593D88?style=for-the-badge&logo=react&logoColor=white)
![Web Speech API](https://img.shields.io/badge/Web_Speech_API-FF4081?style=for-the-badge&logo=googlechrome&logoColor=white)

---

## 🌍 Vision

Blink Speech (MindLink) was born from a simple yet powerful idea:  
**Everyone deserves a voice.**

By turning intentional blink patterns and gaze gestures into spoken words, we enable communication for people who cannot speak or type — whether due to paralysis, neurological disorders, or temporary medical conditions.

### How it helps

* **Critical care scenarios:** Patients in ICUs, post-surgery recovery, or with locked-in syndrome can express urgent needs without speaking.
* **Accessibility at home:** Individuals with ALS, muscular dystrophy, or other motor impairments can communicate naturally with caregivers.
* **Temporary speech loss:** For people recovering from oral surgery, severe laryngitis, or intubation, Blink Speech serves as a temporary voice.
* **Low-resource settings:** No specialized hardware required — just a webcam and a browser.

While many scenarios benefit from this technology, **its most important role is giving a real-time voice to those who cannot speak in emergencies.**

---
## 📽 Demo & Submission Links

* **Live Demo:** [Click here](#)  
* **Hackathon Submission:** [Click here](#)  

---
## 👨‍💻 **Team Members**

| Role        | Name         | GitHub Profile |
|-------------|--------------|----------------|
| 🧠 **Lead**     | Md Athar Jamal Makki  | [@atharhive](https://github.com/atharhive)       |
| 🎨 **Frontend** | Akshad Jogi  | [@akshad-exe](https://github.com/akshad-exe)     |
| 🛠 **Backend**  | Ayush Sarkar  | [@dev-Ninjaa](https://github.com/dev-Ninjaa)      |


## 🧬 Relation to Medical Science

In medical science, communication barriers can directly affect care outcomes. Our system supports:

* **Rapid response:** Emergency phrases like “Help” or “Pain” can be triggered instantly.
* **Non-verbal diagnostics:** Patterns of blink/gaze can even provide neurologists with additional patient feedback.
* **Remote monitoring:** Combined with telemedicine, allows physicians to interact with patients who have limited movement.

---

## 📌 Real-World Use Cases

* **Hospitals & ICUs:** Bedridden patients can request assistance hands-free.
* **Home care:** Allows caregivers to understand needs without physical interaction.
* **Disaster zones:** People trapped or injured can signal specific phrases if standard communication is impossible.
* **Rehabilitation:** Assists patients regaining speech after strokes or brain injuries.

---

## 🚀 Future Implementations

After our prototype:

* **Web App Hosting:** Deploying a stable, secure hosted version accessible worldwide.
* **Multi-language Support:** Instant speech in any preferred language.
* **Wearable integration:** Running on AR glasses or low-cost camera modules.
* **AI Phrase Prediction:** Suggesting likely phrases based on context.
* **Healthcare integrations:** Direct API links to patient monitoring systems.

---

## ⚙️ How It Works

1. **Camera Access & Calibration:**  
   The user grants webcam access. A quick gaze calibration maps their natural eye positions.

2. **Blink & Gaze Detection:**  
   Using **MediaPipe** and **WebGazer.js**, the system tracks blinks (single, double, triple, long) and gaze directions.

3. **Pattern Mapping:**  
   Detected gestures map to phrases stored in JSON — customizable by the user.

4. **Speech Output:**  
   The mapped phrase is spoken via the **Web Speech API** and displayed in the UI.

5. **Local & Cloud Storage:**  
   Preferences and calibration are stored locally with **localForage**, with optional cloud sync via **Supabase**.

---

## 🧩 Features

* Zero-install, browser-based use
* Fully client-side for privacy
* Customizable “blink language”
* Works with just a webcam
* Offline-ready
* Optional real-time logging via WebSockets

---

## 🔗 Resources

| Category                         | Name & Link                                                                                                       | Purpose                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Eye Tracking**                 | [WebGazer.js](https://webgazer.cs.brown.edu/)                                                                     | Browser-based gaze tracking using webcam, works without extra hardware.         |
| **Eye Tracking**                 | [MediaPipe FaceLandmarker (Web)](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js)    | High-fidelity facial & iris landmark detection in browser via TensorFlow.js.    |
| **Blink Detection**              | [Eye Aspect Ratio (EAR) Method](https://www.pyimagesearch.com/2017/04/24/eye-blink-detection-opencv-python-dlib/) | Technique for blink detection using facial landmarks and aspect ratio.          |
| **Blink Detection Example Code** | [LearnOpenCV Eye Blink Detection](https://github.com/spmallick/learnopencv/tree/master/Eye-Blink-Detection)       | OpenCV + Dlib implementation of EAR blink detection.                            |
| **Speech Output**                | [Web Speech API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)                           | Browser-native Text-to-Speech and speech recognition APIs.                      |
| **Speech Output (Python)**       | [gTTS – Google Text-to-Speech](https://github.com/pndurette/gTTS)                                                 | Server-side text-to-speech library in Python.                                   |
| **Frontend Framework**           | [Next.js](https://nextjs.org/)                                                                                    | React framework for building full-stack web apps.                               |
| **State Management**             | [Zustand](https://zustand-demo.pmnd.rs/)                                                                          | Lightweight state management library for React.                                 |
| **Styling**                      | [Tailwind CSS](https://tailwindcss.com/)                                                                          | Utility-first CSS framework for styling.                                        |
| **Persistent Storage**           | [localForage](https://localforage.github.io/localForage/)                                                         | Wrapper for IndexedDB, WebSQL, and localStorage for storing calibration data.   |
| **Backend & DB**                 | [Supabase](https://supabase.com/)                                                                                 | Backend-as-a-service with PostgreSQL, authentication, and serverless functions. |
| **Real-time Communication**      | [Supabase Realtime](https://supabase.com/docs/guides/realtime)                                                    | WebSocket-based real-time updates from Supabase.                                |
| **Optional SMS API**             | [Twilio SMS API](https://www.twilio.com/docs/sms)                                                                 | Send phrases as SMS messages programmatically.                                  |
| **Computer Vision Library**      | [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)                                             | JavaScript version of OpenCV for image/video analysis.                          |
| **ML Models in JS**              | [TensorFlow.js](https://www.tensorflow.org/js)                                                                    | Run ML models directly in the browser.                                          |
| **Gesture Tracking Example**     | [GazeTracking (Python)](https://github.com/antoinelame/GazeTracking)                                              | Eye movement tracking library for Python, useful for prototyping.               |

---


For more detailed technical information, **visit our [Documentation](#)**.
