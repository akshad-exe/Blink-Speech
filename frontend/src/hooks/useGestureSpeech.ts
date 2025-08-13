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
    blinkThreshold = 0.25,
    cooldownMs = 1000
  } = options;

  // Initialize MediaPipe and WebGazer
  useEffect(() => {
    async function init() {
      try {
        console.log('Initializing TensorFlow.js backend...');
        // Initialize TensorFlow.js backend
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('TensorFlow.js backend ready:', tf.getBackend());

        console.log('Loading MediaPipe model...');
        // Initialize MediaPipe
        const model = mp.SupportedModels.MediaPipeFaceMesh;
        const det = await mp.createDetector(model, {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 1
        });
        setDetector(det);
        console.log('MediaPipe detector created successfully');

        // Wait for video element to be available
        if (!videoRef.current) {
          console.log('Video element not ready, retrying...');
          setTimeout(init, 100);
          return;
        }

        // Set up video stream for our video element
        try {
          console.log('Getting video stream...');
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
            console.log('Video stream started successfully');
          }
        } catch (error) {
          console.error('Failed to get video stream:', error);
        }

        // Initialize WebGazer with our video element
        console.log('Initializing WebGazer...');
        WebGazer.setRegression('ridge')
          .setTracker('clmtrackr')
          .setGazeListener((data: any) => {
            if (data && data.x !== null && data.y !== null) {
              // Update calibration data with current gaze center
              setCalibrationData(data.x, data.y, 100);
            }
          })
          .begin();

        setIsInitialized(true);
        console.log('Initialization complete!');
      } catch (error) {
        console.error('Failed to initialize gesture detection:', error);
      }
    }
    init();

    return () => {
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
    
    // Clean old blinks (older than 2 seconds)
    const recentBlinks = blinks.filter(timestamp => now - timestamp < 2000);
    
    if (recentBlinks.length === 0) return null;
    
    // Detect blink patterns
    if (recentBlinks.length === 1) {
      const blinkDuration = now - recentBlinks[0];
      if (blinkDuration > 800) {
        return 'longBlink';
      }
      return gazeDir !== 'center' ? `singleBlink_${gazeDir}` : 'singleBlink';
    }
    
    if (recentBlinks.length === 2) {
      const timeBetweenBlinks = recentBlinks[1] - recentBlinks[0];
      if (timeBetweenBlinks < 400) {
        return gazeDir !== 'center' ? `doubleBlink_${gazeDir}` : 'doubleBlink';
      }
    }
    
    if (recentBlinks.length === 3) {
      const timeBetweenFirstTwo = recentBlinks[1] - recentBlinks[0];
      const timeBetweenLastTwo = recentBlinks[2] - recentBlinks[1];
      if (timeBetweenFirstTwo < 400 && timeBetweenLastTwo < 400) {
        return gazeDir !== 'center' ? `tripleBlink_${gazeDir}` : 'tripleBlink';
      }
    }
    
    return null;
  }, []);

  // Main detection loop
  useEffect(() => {
    if (!isInitialized || !detector) {
      console.log('Detection loop not started - waiting for initialization');
      return;
    }

    let animationId: number;
    setIsDetecting(true);
    let frameCount = 0;
    console.log('Starting detection loop...');

    async function detect() {
      if (!videoRef.current) {
        console.log('No video element, retrying...');
        animationId = requestAnimationFrame(detect);
        return;
      }

      // Check if video is ready
      if (videoRef.current.readyState !== 4) {
        console.log('Video not ready, retrying...');
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
            videoHeight: videoRef.current.videoHeight,
            videoTime: videoRef.current.currentTime
          });
        }
        
        if (faces.length > 0) {
          const landmarks = faces[0].keypoints;
          const ear = calculateEAR(landmarks);

          // Debug EAR values every 30 frames
          if (frameCount % 30 === 0) {
            console.log('EAR value:', ear, 'Threshold:', blinkThreshold);
          }

          // Detect blink
          if (ear < blinkThreshold) {
            const now = performance.now();
            blinkTimestamps.current.push(now);
            console.log('Blink detected! EAR:', ear, 'Time:', now);
          }

          // Get gaze direction
          const gazeDir = getGazeDirection();

          // Detect pattern
          const pattern = detectPattern(blinkTimestamps.current, gazeDir);
          
          if (pattern && pattern !== lastSpokenPattern.current) {
            const now = performance.now();
            
            // Check cooldown
            if (now - lastSpokenTime.current > cooldownMs) {
              const phrase = mapping[pattern];
              if (phrase) {
                console.log('Pattern detected:', pattern, 'Phrase:', phrase);
                lastSpokenPattern.current = pattern;
                lastSpokenTime.current = now;
                blinkTimestamps.current = [];
                
                // Callbacks - let the parent component handle speech
                onGestureDetected?.(pattern);
                onPhraseSpoken?.(phrase);
              }
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
  }, [detector, mapping, isInitialized, detectPattern, blinkThreshold, cooldownMs, onGestureDetected, onPhraseSpoken]);

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

  return { 
    videoRef, 
    isInitialized, 
    isDetecting,
    testDetection,
    resetDetection: () => {
      blinkTimestamps.current = [];
      lastSpokenPattern.current = null;
    }
  };
}
