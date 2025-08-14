# Troubleshooting Guide

This guide helps you diagnose and resolve common issues you may encounter with Blink Speech.

## 🚨 Quick Diagnostics

### System Check

Before diving into specific issues, verify your system meets the requirements:

```
✅ Modern browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
✅ Camera/webcam available
✅ HTTPS connection (required for camera access)
✅ Sufficient system memory (2GB+ recommended)
✅ Stable internet connection (for initial load)
```

### Browser Compatibility Check

```javascript
// Run this in browser console to check compatibility
console.log('Browser info:', {
  userAgent: navigator.userAgent,
  mediaDevices: !!navigator.mediaDevices,
  getUserMedia: !!navigator.mediaDevices?.getUserMedia,
  speechSynthesis: !!window.speechSynthesis,
  webgl: !!document.createElement('canvas').getContext('webgl'),
  indexedDB: !!window.indexedDB
});
```

## 📷 Camera & Video Issues

### Camera Access Denied

**Symptoms:**
- Browser shows "Camera blocked" or permission denied
- No video feed appears
- Error: "Permission denied" or "NotAllowedError"

**Solutions:**

1. **Check browser permissions:**
   - Chrome: Settings → Privacy and security → Site settings → Camera
   - Firefox: Address bar lock icon → Permissions
   - Safari: Safari → Preferences → Websites → Camera

2. **Verify HTTPS connection:**
   - Camera access requires HTTPS (except localhost)
   - Check URL shows secure connection (lock icon)

3. **Clear browser data:**
   ```
   1. Open browser settings
   2. Clear browsing data
   3. Include "Cookies and site data" and "Cached images"
   4. Restart browser and try again
   ```

4. **Try different browser:**
   - Test in Chrome, Firefox, Safari, or Edge
   - Use incognito/private mode to rule out extensions

### Video Feed Not Showing

**Symptoms:**
- Black screen where video should appear
- Video element present but no image
- Camera light on but no video

**Solutions:**

1. **Check video constraints:**
   ```javascript
   // Test basic video access in console
   navigator.mediaDevices.getUserMedia({ video: true })
     .then(stream => {
       console.log('Video stream obtained:', stream);
       // Stop the stream
       stream.getTracks().forEach(track => track.stop());
     })
     .catch(error => console.error('Video access failed:', error));
   ```

2. **Try different video settings:**
   ```javascript
   // Try lower resolution
   const constraints = {
     video: {
       width: { ideal: 320 },
       height: { ideal: 240 },
       facingMode: 'user'
     }
   };
   ```

3. **Update browser and drivers:**
   - Update browser to latest version
   - Update camera drivers (Windows Device Manager)
   - Restart computer after driver updates

### Poor Video Quality

**Symptoms:**
- Blurry or pixelated video
- Low frame rate
- Dark or overexposed image

**Solutions:**

1. **Improve lighting:**
   - Face bright light source (window, lamp)
   - Avoid backlighting
   - Use consistent, even lighting

2. **Camera positioning:**
   - Position 18-24 inches from camera
   - Eye level with camera
   - Stable positioning (use stand if needed)

3. **Close other applications:**
   - Close other video apps (Zoom, Skype, etc.)
   - Free up system resources
   - Close unnecessary browser tabs

## 👁️ Gesture Detection Issues

### Blinks Not Detected

**Symptoms:**
- Natural blinks don't trigger responses
- Need to blink very hard to register
- Inconsistent blink detection

**Solutions:**

1. **Check detection settings:**
   ```javascript
   // Adjust blink threshold (in browser console)
   localStorage.setItem('blinkThreshold', '0.3'); // Try higher value
   // Reload page after changing
   ```

2. **Verify face detection:**
   - Ensure face is clearly visible
   - Remove glasses if causing reflection
   - Check adequate lighting on face

3. **Calibrate detection:**
   - Enable debug overlay (if available)
   - Monitor EAR (Eye Aspect Ratio) values
   - Normal range: 0.25-0.35 when eyes open

4. **Camera and positioning:**
   - Clean camera lens
   - Stable head position
   - Face camera directly

### False Positive Detection

**Symptoms:**
- Random phrases spoken without intentional blinks
- Normal blinking triggers responses
- Too many detections

**Solutions:**

1. **Adjust sensitivity:**
   ```javascript
   // Lower threshold for less sensitivity
   localStorage.setItem('blinkThreshold', '0.2');
   localStorage.setItem('cooldownMs', '2000'); // Longer cooldown
   ```

2. **Improve environment:**
   - Reduce background movement
   - Steady head position
   - Better lighting conditions

3. **Pattern refinement:**
   - Use more distinctive patterns (double, triple blinks)
   - Increase timing thresholds
   - Practice deliberate blinking patterns

### Gaze Tracking Inaccurate

**Symptoms:**
- Wrong direction detected
- Gaze doesn't follow eye movements
- "lookLeft" triggers when looking right

**Solutions:**

1. **Recalibrate gaze:**
   - Go to calibration page
   - Complete full 5-point calibration
   - Look precisely at each calibration point

2. **Check calibration data:**
   ```javascript
   // View current calibration in console
   console.log('Calibration:', localStorage.getItem('blinkSpeechCalibration'));
   ```

3. **Optimal conditions:**
   - Consistent head position during calibration
   - Good lighting on eyes
   - No reflective glasses
   - Stable seating position

## 🔊 Speech Synthesis Issues

### No Audio Output

**Symptoms:**
- Gestures detected but no speech
- Silent audio or muted speech
- Speech API errors

**Solutions:**

1. **Check system audio:**
   - Verify system volume not muted
   - Test with other audio sources
   - Check browser audio permissions

2. **Browser speech support:**
   ```javascript
   // Test speech synthesis in console
   if ('speechSynthesis' in window) {
     const utterance = new SpeechSynthesisUtterance('Test');
     speechSynthesis.speak(utterance);
   } else {
     console.error('Speech Synthesis not supported');
   }
   ```

3. **Speech settings:**
   - Check speech enabled in settings
   - Try different browser
   - Reset speech settings to default

### Poor Speech Quality

**Symptoms:**
- Robotic or distorted speech
- Wrong language or accent
- Speech cuts off

**Solutions:**

1. **Voice selection:**
   ```javascript
   // List available voices
   speechSynthesis.getVoices().forEach((voice, i) => {
     console.log(i, voice.name, voice.lang);
   });
   ```

2. **Adjust speech parameters:**
   - Rate: 0.5 to 2.0 (1.0 = normal)
   - Pitch: 0.0 to 2.0 (1.0 = normal)
   - Volume: 0.0 to 1.0 (1.0 = maximum)

3. **Browser-specific issues:**
   - Chrome: Sometimes requires user interaction first
   - Safari: Limited voice options
   - Firefox: May need page refresh

## 🗄️ Data & Storage Issues

### Calibration Data Lost

**Symptoms:**
- Need to recalibrate frequently
- Settings don't persist
- "Calibration required" messages

**Solutions:**

1. **Check browser storage:**
   ```javascript
   // Check if data exists
   console.log('Calibration data:', localStorage.getItem('blinkSpeechCalibration'));
   console.log('Gesture mapping:', localStorage.getItem('blinkSpeechMapping'));
   ```

2. **Storage permissions:**
   - Enable cookies and local storage
   - Disable incognito/private mode for persistent sessions
   - Check browser storage settings

3. **Browser data clearing:**
   - Don't clear site data for Blink Speech
   - Backup calibration data before clearing browser
   - Export/import settings if available

### Custom Mappings Not Saving

**Symptoms:**
- Custom phrases reset to defaults
- Changes don't persist between sessions
- Error saving mappings

**Solutions:**

1. **Test localStorage:**
   ```javascript
   // Test storage capability
   try {
     localStorage.setItem('test', 'value');
     console.log('Storage works:', localStorage.getItem('test'));
     localStorage.removeItem('test');
   } catch (error) {
     console.error('Storage failed:', error);
   }
   ```

2. **Check quota limits:**
   - Browser storage quota may be exceeded
   - Clear other site data to free space
   - Use shorter phrase texts

3. **Manual backup:**
   ```javascript
   // Export settings
   const settings = {
     calibration: localStorage.getItem('blinkSpeechCalibration'),
     mapping: localStorage.getItem('blinkSpeechMapping')
   };
   console.log('Backup data:', JSON.stringify(settings));
   ```

## 🖥️ Performance Issues

### High CPU Usage

**Symptoms:**
- Computer becomes slow during use
- Browser becomes unresponsive
- High fan noise or heat

**Solutions:**

1. **Reduce processing load:**
   ```javascript
   // Lower target FPS
   localStorage.setItem('targetFPS', '10');
   // Reduce detection history
   localStorage.setItem('maxHistoryLength', '20');
   ```

2. **Close other applications:**
   - Close unnecessary programs
   - Pause background downloads
   - Close other browser tabs

3. **Hardware acceleration:**
   - Enable hardware acceleration in browser
   - Update graphics drivers
   - Check WebGL support

### Memory Leaks

**Symptoms:**
- Increasing memory usage over time
- Browser becomes slower
- Eventually crashes or freezes

**Solutions:**

1. **Refresh periodically:**
   - Reload page every 30-60 minutes
   - Clear memory with browser restart
   - Monitor memory usage in dev tools

2. **Check for resource cleanup:**
   ```javascript
   // Force garbage collection (Chrome dev tools)
   if (window.gc) window.gc();
   ```

3. **Report persistent issues:**
   - Note memory usage patterns
   - Record steps to reproduce
   - Share browser and system specs

## 🌐 Network & Connection Issues

### API Connection Failures

**Symptoms:**
- Settings won't sync
- SMS features don't work
- "Connection error" messages

**Solutions:**

1. **Check network connectivity:**
   - Test internet connection
   - Try different network
   - Disable VPN temporarily

2. **Firewall and security:**
   - Check firewall settings
   - Temporarily disable antivirus web protection
   - Clear DNS cache

3. **Service status:**
   - Check Supabase service status
   - Verify API endpoints are accessible
   - Test with different device

### Slow Loading Times

**Symptoms:**
- Long initial load times
- Models take time to initialize
- Delayed response to interactions

**Solutions:**

1. **Network optimization:**
   - Use faster internet connection
   - Clear browser cache
   - Disable browser extensions

2. **Reduce initial load:**
   - Close other network-heavy applications
   - Use wired connection instead of Wi-Fi
   - Try during off-peak hours

## 📱 Mobile & Tablet Issues

### Touch Screen Problems

**Symptoms:**
- Calibration points hard to tap
- UI elements not responsive
- Gesture grid difficult to use

**Solutions:**

1. **Adjust display settings:**
   - Use landscape orientation
   - Increase text size if needed
   - Enable touch accommodations

2. **Browser selection:**
   - Use Chrome or Safari on mobile
   - Enable desktop mode if needed
   - Clear browser cache

### Camera on Mobile

**Symptoms:**
- Rear camera used instead of front
- Poor camera quality on mobile
- Camera orientation issues

**Solutions:**

1. **Camera constraints:**
   ```javascript
   // Front camera preference
   const constraints = {
     video: { facingMode: 'user' }
   };
   ```

2. **Device positioning:**
   - Use stable mount or stand
   - Landscape orientation often better
   - Ensure adequate lighting

## 🔍 Debug Tools

### Browser Console Debugging

Enable detailed logging:

```javascript
// Enable debug mode
localStorage.setItem('debugMode', 'true');

// Monitor gesture events
window.addEventListener('gestureDetected', (e) => {
  console.log('Gesture:', e.detail);
});

// Check performance
console.log('Performance:', {
  memory: performance.memory,
  timing: performance.timing
});
```

### Performance Monitoring

```javascript
// Monitor frame rates and timing
let frameCount = 0;
let lastTime = performance.now();

setInterval(() => {
  const now = performance.now();
  const fps = frameCount / ((now - lastTime) / 1000);
  console.log('FPS:', fps);
  frameCount = 0;
  lastTime = now;
}, 1000);
```

## 📞 Getting Help

### Information to Collect

Before seeking help, gather this information:

```markdown
## System Information
- Operating System: (Windows 10, macOS, Linux, etc.)
- Browser: (Chrome 96, Firefox 94, etc.)
- Camera: (Built-in, USB webcam model)
- Screen Resolution: 
- Available Memory: 

## Problem Details
- What you were trying to do:
- What actually happened:
- Error messages (exact text):
- Steps to reproduce:
- When the problem started:

## Troubleshooting Attempted
- [ ] Tried different browser
- [ ] Cleared browser data
- [ ] Checked camera permissions
- [ ] Tested with different lighting
- [ ] Recalibrated gaze tracking
```

### Support Channels

1. **GitHub Issues**: Report bugs and feature requests
2. **Documentation**: Check other guide sections
3. **Community Forums**: User discussions and tips
4. **Direct Support**: For urgent accessibility needs

### Emergency Alternatives

If Blink Speech isn't working:

1. **Basic Communication**: Use simple gestures with caregivers
2. **Backup Methods**: Writing, pointing, or other AAC devices
3. **Voice Assistants**: "Hey Siri" or "Hey Google" for basic needs
4. **Emergency Contacts**: Ensure others can reach emergency services

Remember: Your safety and communication needs are the priority. Don't hesitate to use alternative methods while troubleshooting technical issues.
