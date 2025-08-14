# Blink Speech - Complete Documentation

> **Turning blinks and gaze into voice – communication without boundaries.**

Welcome to the comprehensive documentation for **Blink Speech**, an assistive communication tool that transforms eye blink patterns and gaze gestures into spoken phrases using computer vision and speech synthesis.

## 📚 Documentation Structure

This documentation is organized into the following sections:

### 🏗️ **Architecture & Design**
- [**Architecture Overview**](./architecture.md) - System design, data flow, and technical architecture
- [**Frontend Components**](./frontend-components.md) - React components, hooks, and utilities
- [**API Documentation**](./api-documentation.md) - Backend endpoints, database schema, and integrations

### 🚀 **Getting Started**
- [**Installation Guide**](./installation.md) - Complete setup for development and production
- [**User Guide**](./user-guide.md) - How to use the application effectively
- [**Configuration**](./configuration.md) - Environment variables and settings

### 💻 **Development**
- [**Development Guide**](./development-guide.md) - Developer setup, workflows, and contribution guidelines
- [**Gesture Detection**](./gesture-detection.md) - Computer vision implementation and algorithms
- [**Speech Synthesis**](./speech-synthesis.md) - Text-to-speech implementation details

### 🚀 **Deployment & Operations**
- [**Deployment Guide**](./deployment.md) - Production deployment instructions
- [**Troubleshooting**](./troubleshooting.md) - Common issues and solutions

---

## 🎯 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/akshad-exe/Blink-Speech.git
   cd Blink-Speech
   ```

2. **Follow the [Installation Guide](./installation.md)** for detailed setup instructions

3. **Read the [User Guide](./user-guide.md)** to learn how to use the application

4. **Check [Development Guide](./development-guide.md)** if you want to contribute

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18 + Vite | Modern web application framework |
| **UI Library** | Radix UI + Tailwind CSS | Accessible components and styling |
| **Computer Vision** | MediaPipe + WebGazer.js | Eye tracking and blink detection |
| **Machine Learning** | TensorFlow.js | Face landmark detection |
| **Backend** | Next.js API Routes | RESTful API endpoints |
| **Database** | Supabase (PostgreSQL) | User data and gesture mappings |
| **Authentication** | Supabase Auth | User session management |
| **Storage** | IndexedDB (localForage) | Local data persistence |
| **Speech** | Web Speech API | Text-to-speech synthesis |
| **SMS** | Twilio | Emergency SMS notifications |
| **Deployment** | Vercel | Hosting and CI/CD |

---

## 🏥 Use Cases & Impact

### Primary Use Cases
- **Critical Care**: ICU patients, post-surgery recovery, locked-in syndrome
- **Accessibility**: ALS, muscular dystrophy, motor impairments
- **Temporary Conditions**: Post-surgery, severe laryngitis, intubation recovery
- **Emergency Situations**: When traditional communication is impossible

### Key Features
- ✅ **Zero Installation** - Works in any modern web browser
- ✅ **Privacy First** - All processing happens client-side
- ✅ **Customizable** - User-defined gesture-to-phrase mappings
- ✅ **Offline Ready** - Core functionality works without internet
- ✅ **Responsive** - Works on desktop, tablet, and mobile devices
- ✅ **Accessible** - WCAG compliant interface design

---

## 🤝 Team

| Role | Name | GitHub |
|------|------|---------|
| 🧠 **Lead** | Md Athar Jamal Makki | [@atharhive](https://github.com/atharhive) |
| 🎨 **Frontend** | Akshad Jogi | [@akshad-exe](https://github.com/akshad-exe) |
| 🛠 **Backend** | Ayush Sarkar | [@dev-Ninjaa](https://github.com/dev-Ninjaa) |

---

## 📋 Quick Reference

### Common Gesture Patterns
- **Single Blink**: Basic acknowledgment
- **Double Blink**: "Yes" or confirmation
- **Triple Blink**: "No" or denial
- **Long Blink**: "Thank you" or "Stop"
- **Blink + Gaze**: Directional commands (help, water, etc.)

### Performance Specifications
- **Detection Latency**: <150ms
- **Speech Output**: <1s after pattern recognition
- **Browser Support**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Hardware Requirements**: Webcam, 2GB RAM minimum

---

## 🔗 External Resources

- [**Live Demo**](https://blink-speech.vercel.app) - Try the application
- [**Project Repository**](https://github.com/akshad-exe/Blink-Speech) - Source code
- [**Issue Tracker**](https://github.com/akshad-exe/Blink-Speech/issues) - Report bugs or request features
- [**WebGazer.js Documentation**](https://webgazer.cs.brown.edu/) - Eye tracking library
- [**MediaPipe Face Mesh**](https://google.github.io/mediapipe/solutions/face_mesh.html) - Facial landmark detection

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

---

**Need help?** Check our [Troubleshooting Guide](./troubleshooting.md) or [open an issue](https://github.com/akshad-exe/Blink-Speech/issues/new).
