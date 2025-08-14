import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

// MediaPipe Face Mesh landmark indices for eyes
const LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
const RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144];

interface BlinkDetectionOptions {
  onBlinkDetected?: (pattern: string, phrase: string) => void;
  blinkThreshold?: number;
  isActive?: boolean;
  mapping?: Record<string, string>;
}

export function useSimpleBlinkDetection(options: BlinkDetectionOptions = {}) {
  const {
    onBlinkDetected,
    blinkThreshold = 0.18, // Lower threshold for better sensitivity
    isActive = false,
    mapping = {
      "singleBlink": "Hello",
      "doubleBlink": "Yes",
      "tripleBlink": "No",
      "longBlink": "Thank you"
    }
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detector, setDetector] = useState<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  
  // Blink tracking
  const blinkTimestamps = useRef<number[]>([]);
  const lastBlinkTime = useRef<number>(0);
  const lastPatternTime = useRef<number>(0);
  const isBlinking = useRef<boolean>(false);
  const blinkStartTime = useRef<number>(0);
  const consecutiveBlinks = useRef<number>(0);

  // Calculate Eye Aspect Ratio
  const calculateEAR = useCallback((landmarks: any[]): number => {
    if (!landmarks || landmarks.length < 468) {
      return 0.35;
    }

    try {
      // Calculate distances for left eye
      const leftEye = LEFT_EYE_INDICES.map(i => landmarks[i]);
      const leftV1 = distance(leftEye[1], leftEye[5]);
      const leftV2 = distance(leftEye[2], leftEye[4]);
      const leftH = distance(leftEye[0], leftEye[3]);
      const leftEAR = (leftV1 + leftV2) / (2 * leftH);

      // Calculate distances for right eye
      const rightEye = RIGHT_EYE_INDICES.map(i => landmarks[i]);
      const rightV1 = distance(rightEye[1], rightEye[5]);
      const rightV2 = distance(rightEye[2], rightEye[4]);
      const rightH = distance(rightEye[0], rightEye[3]);
      const rightEAR = (rightV1 + rightV2) / (2 * rightH);

      // Average EAR
      const avgEAR = (leftEAR + rightEAR) / 2;
      return isNaN(avgEAR) ? 0.35 : avgEAR;
    } catch (error) {
      console.error('EAR calculation error:', error);
      return 0.35;
    }
  }, []);

  // Distance helper
  const distance = (p1: any, p2: any): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Detect blink patterns
  const detectPattern = useCallback((): string | null => {
    const now = Date.now();
    
    // Clean old blinks (older than 2 seconds)
    blinkTimestamps.current = blinkTimestamps.current.filter(t => now - t < 2000);
    
    if (blinkTimestamps.current.length === 0) return null;
    
    const blinkCount = blinkTimestamps.current.length;
    const timeSinceLastBlink = now - blinkTimestamps.current[blinkTimestamps.current.length - 1];
    
    // Wait at least 600ms after last blink to determine pattern
    if (timeSinceLastBlink < 600) return null;
    
    // Prevent repeating patterns too quickly
    if (now - lastPatternTime.current < 1500) return null;
    
    let pattern = null;
    
    if (blinkCount === 1) {
      pattern = 'singleBlink';
    } else if (blinkCount === 2) {
      pattern = 'doubleBlink';
    } else if (blinkCount >= 3) {
      pattern = 'tripleBlink';
    }
    
    if (pattern) {
      console.log(`✅ Pattern detected: ${pattern} (${blinkCount} blinks)`);
      lastPatternTime.current = now;
      blinkTimestamps.current = []; // Clear history after pattern detection
    }
    
    return pattern;
  }, []);

  // Initialize TensorFlow and MediaPipe
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        console.log('🚀 Initializing TensorFlow.js...');
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('✅ TensorFlow.js ready');

        if (!mounted) return;

        console.log('🚀 Loading MediaPipe FaceMesh model...');
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
          runtime: 'tfjs' as const,
          refineLandmarks: true,
          maxFaces: 1
        };
        
        const det = await faceLandmarksDetection.createDetector(model, detectorConfig);
        
        if (!mounted) return;
        
        setDetector(det);
        setIsInitialized(true);
        console.log('✅ MediaPipe FaceMesh model loaded');
      } catch (error) {
        console.error('❌ Initialization error:', error);
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  // Main detection loop
  useEffect(() => {
    if (!isInitialized || !detector || !isActive) {
      return;
    }

    let animationId: number;
    let frameCount = 0;
    setIsDetecting(true);

    async function detectBlinks() {
      if (!videoRef.current || videoRef.current.readyState !== 4) {
        animationId = requestAnimationFrame(detectBlinks);
        return;
      }

      try {
        const faces = await detector.estimateFaces(videoRef.current);
        
        if (faces.length > 0) {
          const landmarks = faces[0].keypoints;
          const ear = calculateEAR(landmarks);
          
          frameCount++;
          
          // Log EAR values more frequently for debugging
          if (frameCount % 10 === 0) {
            console.log(`👁️ EAR: ${ear.toFixed(3)} | Threshold: ${blinkThreshold} | Blinking: ${isBlinking.current}`);
          }
          
          const now = Date.now();
          
          // Detect blink start
          if (ear < blinkThreshold && !isBlinking.current) {
            // Debounce: ensure enough time has passed since last blink
            if (now - lastBlinkTime.current > 50) {  // Reduced debounce time
              isBlinking.current = true;
              blinkStartTime.current = now;
              console.log(`👁️ BLINK STARTED at EAR: ${ear.toFixed(3)}`);
            }
          }
          
          // Detect blink end
          if (ear >= blinkThreshold && isBlinking.current) {
            const blinkDuration = now - blinkStartTime.current;
            
            // Valid blink if duration is reasonable (more lenient)
            if (blinkDuration > 30 && blinkDuration < 1200) {
              console.log(`✨ BLINK ENDED! Duration: ${blinkDuration}ms, EAR returned to: ${ear.toFixed(3)}`);
              blinkTimestamps.current.push(now);
              lastBlinkTime.current = now;
              consecutiveBlinks.current++;
              
              // Check for long blink
              if (blinkDuration > 600) {
                console.log('🕐 Long blink detected');
                blinkTimestamps.current = []; // Clear for long blink
                consecutiveBlinks.current = 0;
                
                const phrase = mapping['longBlink'] || 'Thank you';
                if ('speechSynthesis' in window) {
                  speechSynthesis.cancel();
                  const utterance = new SpeechSynthesisUtterance(phrase);
                  utterance.rate = 1.0;
                  utterance.volume = 1.0;
                  utterance.lang = 'en-US';
                  speechSynthesis.speak(utterance);
                  console.log(`🔊 Speaking (long blink): ${phrase}`);
                }
                onBlinkDetected?.('longBlink', phrase);
              } else {
                // For regular blinks, immediately check if it's a single blink
                // We'll wait a bit to see if more blinks follow
                setTimeout(() => {
                  // If no more blinks came, it's a single blink
                  if (blinkTimestamps.current.length === 1) {
                    const phrase = mapping['singleBlink'] || 'Hello';
                    console.log('✅ Single blink confirmed');
                    if ('speechSynthesis' in window) {
                      speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(phrase);
                      utterance.rate = 1.0;
                      utterance.volume = 1.0;
                      utterance.lang = 'en-US';
                      speechSynthesis.speak(utterance);
                      console.log(`🔊 Speaking (single blink): ${phrase}`);
                    }
                    onBlinkDetected?.('singleBlink', phrase);
                    blinkTimestamps.current = [];
                    consecutiveBlinks.current = 0;
                  }
                }, 600); // Wait 600ms to see if more blinks come
              }
            }
            
            isBlinking.current = false;
          }
          
          // Check for patterns
          const pattern = detectPattern();
          if (pattern && mapping[pattern]) {
            const phrase = mapping[pattern];
            console.log(`🎯 Pattern: ${pattern} → "${phrase}"`);
            
            // Speak the phrase
            if ('speechSynthesis' in window) {
              speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(phrase);
              utterance.rate = 1.0;
              utterance.volume = 1.0;
              speechSynthesis.speak(utterance);
              console.log(`🔊 Speaking: ${phrase}`);
            }
            
            // Callback
            onBlinkDetected?.(pattern, phrase);
          }
        }
      } catch (error) {
        console.error('Detection error:', error);
      }

      animationId = requestAnimationFrame(detectBlinks);
    }

    animationId = requestAnimationFrame(detectBlinks);

    return () => {
      cancelAnimationFrame(animationId);
      setIsDetecting(false);
      console.log('Detection stopped');
    };
  }, [isInitialized, detector, isActive, blinkThreshold, calculateEAR, detectPattern, mapping, onBlinkDetected]);

  // Start camera
  const startCamera = async (): Promise<boolean> => {
    if (!videoRef.current) return false;

    try {
      console.log('📷 Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      console.log('✅ Camera started');
      return true;
    } catch (error) {
      console.error('❌ Camera error:', error);
      return false;
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      console.log('📷 Camera stopped');
    }
  };

  // Test detection manually
  const testDetection = async () => {
    if (!detector || !videoRef.current) {
      console.log('Cannot test - not ready');
      return;
    }

    try {
      const faces = await detector.estimateFaces(videoRef.current);
      console.log(`Test: ${faces.length} face(s) detected`);
      
      if (faces.length > 0) {
        const landmarks = faces[0].keypoints;
        const ear = calculateEAR(landmarks);
        console.log(`Test EAR: ${ear.toFixed(3)}`);
        
        // Test speech
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Test successful");
          speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  return {
    videoRef,
    isInitialized,
    isDetecting,
    startCamera,
    stopCamera,
    testDetection
  };
}
