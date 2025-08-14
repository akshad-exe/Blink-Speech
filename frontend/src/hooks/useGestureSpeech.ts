import { useState, useEffect, useRef, useCallback } from 'react';
import * as mp from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import WebGazer from 'webgazer';
import { calculateEAR } from '@/utils/earUtils';
import { speakPhrase } from '@/utils/speechSynthesis';
import { getGazeDirection, setCalibrationData } from '@/utils/gazeUtils';

interface GestureSpeechOptions {
  onGestureDetected?: (gesture: string) => void;
  onPhraseSpoken?: (phrase: string) => void;
  blinkThreshold?: number;
  cooldownMs?: number;
  isActive?: boolean;
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
  const lastSpokenPattern = useRef<string | null>(null);
  const lastSpokenTime = useRef<number>(0);
  
  const {
    onGestureDetected,
    onPhraseSpoken,
    blinkThreshold = 0.3,  // More lenient threshold for better detection
    cooldownMs = 1000,  // Reduced cooldown for faster response
    isActive = false
  } = options;

  // Initialize MediaPipe and WebGazer
  useEffect(() => {
    let initializationAborted = false;

    async function init() {
      try {
        console.log('Initializing TensorFlow.js backend...');
        // Initialize TensorFlow.js backend
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('TensorFlow.js backend ready:', tf.getBackend());

        if (initializationAborted) return;

        console.log('Loading MediaPipe model...');
        // Initialize MediaPipe
        const model = mp.SupportedModels.MediaPipeFaceMesh;
        const det = await mp.createDetector(model, {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 1
        });
        
        if (initializationAborted) return;
        
        setDetector(det);
        console.log('MediaPipe detector created successfully');

        // Initialize WebGazer (without requesting camera - we'll handle that separately)
        console.log('Initializing WebGazer...');
        WebGazer.setRegression('ridge')
          .setTracker('clmtrackr')
          .setGazeListener((data: any) => {
            if (data && data.x !== null && data.y !== null) {
              // Update calibration data with current gaze center
              setCalibrationData(data.x, data.y, 100);
            }
          });

        setIsInitialized(true);
        console.log('Initialization complete!');
      } catch (error) {
        console.error('Failed to initialize gesture detection:', error);
      }
    }
    init();

    return () => {
      initializationAborted = true;
      WebGazer.end();
      // Stop video stream on cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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

  const detectPattern = useCallback((blinks: number[], gazeDir: string): string | null => {
    const now = performance.now();
    
    // Clean old blinks (older than 4 seconds for better pattern detection)
    const recentBlinks = blinks.filter(timestamp => now - timestamp < 4000);
    
    if (recentBlinks.length === 0) return null;
    
    // Sort blinks by timestamp to ensure proper ordering
    recentBlinks.sort((a, b) => a - b);
    
    console.log('🔍 Analyzing blink pattern:', {
      totalBlinks: recentBlinks.length,
      gazeDirection: gazeDir,
      timestamps: recentBlinks.map(t => Math.round(now - t)),
      timeSinceLastBlink: recentBlinks.length > 0 ? now - recentBlinks[recentBlinks.length - 1] : 0
    });
    
    // SIMPLIFIED PATTERN DETECTION - Start with single blinks only
    if (recentBlinks.length === 1) {
      const timeSinceBlink = now - recentBlinks[0];
      
      // Immediate single blink detection (wait at least 200ms to avoid false positives)
      if (timeSinceBlink >= 200 && timeSinceBlink <= 1000) {
        const pattern = 'singleBlink'; // Always use simple single blink first
        console.log('✅ Single blink pattern detected:', pattern, 'Time since blink:', timeSinceBlink);
        return pattern;
      }
      
      // Long blink detection
      if (timeSinceBlink > 1000) {
        console.log('✅ Long blink pattern detected');
        return 'longBlink';
      }
    }
    
    if (recentBlinks.length === 2) {
      const timeBetweenBlinks = recentBlinks[1] - recentBlinks[0];
      const timeSinceLastBlink = now - recentBlinks[1];
      
      // Double blink: two blinks within 800ms, wait 200ms after last blink
      if (timeBetweenBlinks <= 800 && timeSinceLastBlink >= 200 && timeSinceLastBlink <= 1000) {
        console.log('✅ Double blink pattern detected');
        return 'doubleBlink';
      }
    }
    
    if (recentBlinks.length >= 3) {
      const timeBetweenFirstTwo = recentBlinks[1] - recentBlinks[0];
      const timeBetweenLastTwo = recentBlinks[2] - recentBlinks[1];
      const timeSinceLastBlink = now - recentBlinks[2];
      
      // Triple blink: all within reasonable timing
      if (timeBetweenFirstTwo <= 800 && timeBetweenLastTwo <= 800 && timeSinceLastBlink >= 200 && timeSinceLastBlink <= 1000) {
        console.log('✅ Triple blink pattern detected');
        return 'tripleBlink';
      }
    }
    
    return null;
  }, []);

  // Main detection loop - only depends on essential values
  useEffect(() => {
    if (!isInitialized || !detector || Object.keys(mapping).length === 0) {
      console.log('Detection loop not started - waiting for initialization and mapping');
      return;
    }
    
    // Only run detection if isActive is true
    if (!isActive) {
      console.log('Detection loop paused - not active');
      setIsDetecting(false);
      return;
    }

    let animationId: number;
    setIsDetecting(true);
    let frameCount = 0;
    console.log('Starting detection loop with mapping:', Object.keys(mapping));

    async function detect() {
      if (!videoRef.current) {
        console.log('No video element, retrying...');
        animationId = requestAnimationFrame(detect);
        return;
      }

      // Check if video is ready
      if (videoRef.current.readyState !== 4) {
        animationId = requestAnimationFrame(detect);
        return;
      }

      try {
        if (!detector) return;
        
        // Use the video element directly for detection
        const faces = await detector.estimateFaces(videoRef.current);
        
        // Debug every 30 frames (about once per second at 30fps)
        frameCount++;
        if (frameCount % 30 === 0) {
          console.log('Detection frame:', {
            facesDetected: faces.length,
            videoReady: videoRef.current.readyState === 4,
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight
          });
        }
        
        if (faces.length > 0) {
          const landmarks = faces[0].keypoints;
          const ear = calculateEAR(landmarks);

          // Debug EAR values more frequently during active detection
          if (frameCount % 15 === 0) {
            console.log('👁️ EAR value:', ear.toFixed(3), 'Threshold:', blinkThreshold, 'Face detected:', faces.length > 0);
          }

          // Detect blink with debouncing
          if (ear < blinkThreshold) {
            const now = performance.now();
            // Prevent multiple detections within 150ms (debounce)
            const lastBlink = blinkTimestamps.current[blinkTimestamps.current.length - 1];
            if (!lastBlink || now - lastBlink > 150) {
              blinkTimestamps.current.push(now);
              console.log('🟢 BLINK DETECTED! EAR:', ear.toFixed(3), 'Time:', now, 'Total blinks:', blinkTimestamps.current.length);
              
              // Visual feedback - could add sound beep here
              if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
              }
            }
          }

          // Get gaze direction
          const gazeDir = getGazeDirection();

          // Detect pattern
          const pattern = detectPattern(blinkTimestamps.current, gazeDir);
          
          if (pattern) {
            const now = performance.now();
            
            console.log('🎯 PATTERN DETECTED:', pattern, 'Cooldown check:', now - lastSpokenTime.current, '>', cooldownMs);
            
            // Check cooldown and avoid repeating the same pattern immediately
            if (now - lastSpokenTime.current > cooldownMs) {
              const phrase = mapping[pattern];
              console.log('📝 Looking up phrase for pattern:', pattern, 'Found:', phrase);
              console.log('🗣️ Available mappings:', Object.keys(mapping));
              
              if (phrase) {
                console.log('🎉 PATTERN CONFIRMED - SPEAKING:', pattern, 'Phrase:', phrase);
                lastSpokenPattern.current = pattern;
                lastSpokenTime.current = now;
                
                // Clear blink history after successful pattern detection
                blinkTimestamps.current = [];
                
                // Multiple speech attempts for reliability
                const speakPhrase = (text: string) => {
                  try {
                    if ('speechSynthesis' in window) {
                      speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(text);
                      utterance.rate = 1.0;
                      utterance.volume = 1.0;
                      utterance.lang = 'en-US';
                      
                      utterance.onstart = () => console.log('🔊 Speech started:', text);
                      utterance.onend = () => console.log('🔇 Speech ended:', text);
                      utterance.onerror = (e) => console.error('❌ Speech error:', e);
                      
                      speechSynthesis.speak(utterance);
                      console.log('🎤 Speech synthesis triggered:', text);
                      return true;
                    }
                  } catch (error) {
                    console.error('❌ Speech synthesis error:', error);
                  }
                  return false;
                };
                
                // Try speech synthesis
                const speechSuccess = speakPhrase(phrase);
                console.log('Speech synthesis success:', speechSuccess);
                
                // Callbacks - let the parent component handle speech too
                onGestureDetected?.(pattern);
                onPhraseSpoken?.(phrase);
              } else {
                console.warn('❌ No phrase found for pattern:', pattern, 'Available:', Object.keys(mapping));
              }
            } else {
              const remainingCooldown = cooldownMs - (now - lastSpokenTime.current);
              console.log('⏳ Pattern in cooldown:', pattern, 'Remaining:', remainingCooldown + 'ms');
            }
          }
        } else {
          // Debug when no faces detected
          if (frameCount % 60 === 0) {
            console.log('No faces detected in frame');
          }
        }
      } catch (error) {
        console.error('Detection error:', error);
      }

      animationId = requestAnimationFrame(detect);
    }

    animationId = requestAnimationFrame(detect);
    return () => {
      cancelAnimationFrame(animationId);
      setIsDetecting(false);
      console.log('Detection loop stopped');
    };
  }, [detector, isInitialized, Object.keys(mapping).join(','), isActive, blinkThreshold, cooldownMs]);

  const testDetection = async () => {
    if (!detector || !videoRef.current) {
      console.log('Cannot test - detector or video not ready');
      return;
    }
    
    try {
      console.log('Testing face detection...');
      const faces = await detector.estimateFaces(videoRef.current);
      console.log('Test result - faces detected:', faces.length);
      
      if (faces.length > 0) {
        const landmarks = faces[0].keypoints;
        const ear = calculateEAR(landmarks);
        console.log('Test result - EAR value:', ear);
      }
    } catch (error) {
      console.error('Test detection failed:', error);
    }
  };

  // Function to start camera stream
  const startCamera = async () => {
    if (!videoRef.current) return false;
    
    try {
      console.log('Starting camera for gesture detection...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      
      // Start WebGazer with the video stream
      WebGazer.begin();
      
      console.log('Camera started successfully for gesture detection');
      return true;
    } catch (error) {
      console.error('Failed to start camera:', error);
      return false;
    }
  };

  // Function to stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    WebGazer.end();
  };

  return { 
    videoRef, 
    isInitialized, 
    isDetecting,
    testDetection,
    startCamera,
    stopCamera,
    resetDetection: () => {
      blinkTimestamps.current = [];
      lastSpokenPattern.current = null;
    }
  };
}
