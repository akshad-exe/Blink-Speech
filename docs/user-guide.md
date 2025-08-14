# User Guide

This guide explains how to use Blink Speech effectively for assistive communication through eye blinks and gaze gestures.

## 🎯 Getting Started

### What is Blink Speech?

Blink Speech is a web-based assistive communication tool that converts your eye movements into spoken words. By detecting blink patterns and gaze directions through your camera, it enables hands-free communication for people who cannot speak or type.

### Who Can Use This?

- **Medical patients**: ICU patients, post-surgery recovery, locked-in syndrome
- **People with disabilities**: ALS, muscular dystrophy, paralysis
- **Temporary conditions**: Speech loss from surgery, illness, or injury
- **Emergency situations**: When traditional communication methods fail

## 🚀 First Time Setup

### 1. Access the Application

1. **Open your web browser** (Chrome, Firefox, Safari, or Edge)
2. **Navigate to** the Blink Speech website or run it locally
3. **Ensure HTTPS** is enabled (required for camera access)

### 2. Camera Setup

1. **Position yourself** 18-24 inches from your camera
2. **Ensure good lighting** - face the light source, avoid backlighting
3. **Remove glasses** if they cause glare (optional but recommended)
4. **Sit upright** and keep your head relatively still

### 3. Grant Permissions

When prompted:
1. **Click "Allow"** for camera access
2. **Wait for initialization** (may take 10-30 seconds)
3. **Check video feed** appears correctly

## 🎯 Calibration Process

**⚠️ Important**: Calibration is essential for accurate gaze detection. Complete this carefully.

### Step-by-Step Calibration

1. **Start calibration** by clicking "Start Session" on the homepage
2. **Follow the dots**: Five dots will appear sequentially on screen
3. **Look directly at each dot** and click when you're focused on it
4. **Keep your head still** during the entire process
5. **Complete all five points** for optimal accuracy

### Calibration Tips

- **Take your time** - accuracy is more important than speed
- **Look precisely at the center** of each dot
- **Keep your distance consistent** throughout calibration
- **Recalibrate if needed** - you can repeat this process anytime

### Understanding Calibration Quality

- **Good calibration**: Gaze detection responds accurately to eye movements
- **Poor calibration**: Delayed or incorrect gaze direction detection
- **When to recalibrate**: If gaze detection becomes inaccurate over time

## 👁️ Understanding Gesture Patterns

### Basic Blink Patterns

| Pattern | Description | Default Phrase |
|---------|-------------|----------------|
| **Single Blink** | One quick blink | "Hello" |
| **Double Blink** | Two blinks within 400ms | "Yes" |
| **Triple Blink** | Three blinks within 700ms | "No" |
| **Long Blink** | Hold blink for 800ms+ | "Thank you" |

### Gaze Directions

| Direction | How to Perform |
|-----------|----------------|
| **Look Left** | Move eyes to the left |
| **Look Right** | Move eyes to the right |
| **Look Up** | Move eyes upward |
| **Look Down** | Move eyes downward |
| **Center** | Look straight ahead |

### Combined Gestures

Combine blinks with gaze for more phrases:

| Gesture | Default Phrase |
|---------|----------------|
| **Single Blink + Look Left** | "I need help" |
| **Single Blink + Look Right** | "I'm okay" |
| **Double Blink + Look Up** | "Water please" |
| **Double Blink + Look Down** | "I'm tired" |

## 🎮 Using the Session Interface

### Main Interface Elements

1. **Video Feed**: Shows your camera view (top-right corner)
2. **Gesture Grid**: Displays available gestures and their phrases
3. **Phrase Preview**: Shows the last detected phrase
4. **Control Panel**: Settings and options

### Control Buttons

- **🎤 Speech Toggle**: Enable/disable voice output
- **👁️ Camera Toggle**: Show/hide video feed
- **⚙️ Settings**: Access configuration options
- **🔄 Recalibrate**: Restart calibration process

### Real-Time Feedback

- **Green indicators**: Successful gesture detection
- **Phrase display**: Shows what was spoken
- **Audio output**: Hear the synthesized speech

## 🎯 Performing Gestures Effectively

### Best Practices for Blinks

1. **Natural blinking**: Use your normal blink speed and intensity
2. **Deliberate patterns**: Make intentional, clear blink sequences
3. **Wait between patterns**: Allow 1-2 seconds between different gestures
4. **Avoid rapid blinking**: This may cause false detections

### Gaze Movement Tips

1. **Smooth movements**: Move eyes steadily, not quickly
2. **Clear directions**: Make distinct directional movements
3. **Return to center**: Look back to center between different directions
4. **Hold briefly**: Maintain gaze direction for 0.5-1 seconds

### Timing Guidelines

- **Blink detection window**: Patterns detected within 2 seconds
- **Double blink timing**: Within 400ms between blinks
- **Triple blink timing**: All three blinks within 700ms
- **Long blink duration**: Hold for at least 800ms

## ⚙️ Customizing Your Experience

### Editing Gesture Mappings

1. **Click the settings button** (⚙️) in the session interface
2. **Open "Customize Mappings"** section
3. **Select a gesture** from the dropdown
4. **Type your custom phrase** in the text field
5. **Save changes** - they're stored locally

### Example Custom Mappings

```
Single Blink → "Hi there"
Double Blink → "Yes, please"
Triple Blink → "No, thank you"
Long Blink → "I love you"
Single Blink + Look Left → "Help me"
Single Blink + Look Right → "I'm fine"
Double Blink + Look Up → "More please"
Double Blink + Look Down → "Stop"
```

### Voice Settings

Adjust speech synthesis parameters:
- **Rate**: Speed of speech (0.5x to 2x normal)
- **Pitch**: Voice pitch (0.5x to 2x normal)
- **Volume**: Output volume (0% to 100%)

## 🔧 Troubleshooting Common Issues

### Gesture Detection Problems

**Problem**: Blinks not detected
**Solutions**:
- Ensure adequate lighting on your face
- Check camera positioning and distance
- Try slightly more pronounced blinks
- Recalibrate if needed

**Problem**: False positive detections
**Solutions**:
- Reduce background movement
- Avoid quick head movements
- Adjust blink threshold in settings
- Take breaks to avoid eye fatigue

### Gaze Tracking Issues

**Problem**: Gaze direction incorrect
**Solutions**:
- Recalibrate the gaze system
- Check for reflections on glasses/eyes
- Improve lighting conditions
- Maintain consistent head position

**Problem**: Gaze not responding
**Solutions**:
- Ensure WebGazer has initialized (wait 30 seconds)
- Check browser compatibility
- Refresh the page and try again
- Try a different browser

### Audio Issues

**Problem**: No speech output
**Solutions**:
- Check if speech is enabled (🎤 button)
- Verify browser supports Web Speech API
- Check system volume settings
- Try refreshing the page

### Performance Issues

**Problem**: Slow or laggy detection
**Solutions**:
- Close other browser tabs
- Reduce video quality if possible
- Check available system memory
- Try a different browser

## 📱 Mobile and Tablet Usage

### Supported Devices

- **Tablets**: iPad (Safari), Android tablets (Chrome)
- **Smartphones**: iPhone (Safari), Android phones (Chrome)
- **Requirements**: Front-facing camera, modern browser

### Mobile-Specific Tips

1. **Landscape orientation** often works better
2. **Stable positioning** - use a stand or prop
3. **Good front lighting** is even more important
4. **Closer positioning** may be needed (12-18 inches)

### Limitations on Mobile

- Smaller screens may affect gaze accuracy
- Performance may be slower than desktop
- Battery usage can be significant
- Some features may be limited

## 🏥 Healthcare and Emergency Use

### Emergency Phrases

Set up essential emergency communications:
- "Emergency" or "Help"
- "Pain" or "Medication"
- "Doctor" or "Nurse"
- "Family" or specific names

### Medical Settings

**For Patients**:
- Practice before you need it urgently
- Inform caregivers about the system
- Keep device charged and accessible
- Set up family contact information

**For Caregivers**:
- Learn the patient's custom mappings
- Ensure good camera positioning
- Monitor battery and device status
- Have backup communication methods

### Privacy in Medical Settings

- All processing happens locally on device
- No video or personal data transmitted
- Can work offline once loaded
- Respects HIPAA privacy requirements

## 🔒 Privacy and Security

### Data Protection

- **No video recording**: Camera feed only used for real-time processing
- **Local storage**: Calibration data stored only on your device
- **Optional cloud sync**: You control if mappings are saved online
- **Anonymous usage**: No personal information required

### Best Practices

- **Use on trusted devices** only
- **Log out from shared computers**
- **Clear browser data** if using public computers
- **Keep software updated** for security patches

## 📊 Tips for Optimal Performance

### Environmental Setup

1. **Lighting**: Soft, even lighting on your face
2. **Background**: Minimal movement behind you
3. **Camera height**: At eye level when possible
4. **Distance**: 18-24 inches from camera

### Usage Patterns

1. **Start simple**: Master basic patterns first
2. **Practice regularly**: Build muscle memory
3. **Stay consistent**: Use same head position and distance
4. **Take breaks**: Avoid eye strain and fatigue

### Maintenance

1. **Recalibrate periodically**: Especially if detection degrades
2. **Clean camera lens**: Ensure clear image quality
3. **Update browser**: Keep software current
4. **Check settings**: Verify configurations remain correct

## 🆘 Getting Help

### Self-Help Resources

- **Built-in help**: Tooltips and hints in the interface
- **Calibration guide**: Step-by-step process walkthrough
- **Settings explanations**: Hover over options for details

### When to Seek Support

- Persistent detection issues after troubleshooting
- Technical problems with installation or setup
- Questions about customization or advanced features
- Feedback or suggestions for improvements

### Support Channels

- **Documentation**: Comprehensive guides and references
- **Issue tracker**: Report bugs or request features
- **Community forums**: User discussions and tips
- **Direct support**: Contact information for urgent issues

---

**Remember**: Blink Speech is designed to be intuitive, but mastery comes with practice. Start with simple patterns and gradually work up to more complex combinations. Your communication freedom is worth the learning curve!
