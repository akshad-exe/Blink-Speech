import { useState, useEffect, useRef, useCallback } from 'react';
import * as mp from '@tensorflow-models/face-landmarks-detection';
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
        // Initialize MediaPipe
        const model = mp.SupportedModels.MediaPipeFaceMesh;
        const det = await mp.createDetector(model, {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 1
        });
        setDetector(det);

        // Initialize WebGazer
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
      } catch (error) {
        console.error('Failed to initialize gesture detection:', error);
      }
    }
    init();

    return () => {
      WebGazer.end();
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
    if (!isInitialized || !detector) return;

    let animationId: number;
    setIsDetecting(true);

    async function detect() {
      if (!videoRef.current) {
        animationId = requestAnimationFrame(detect);
        return;
      }

      try {
        if (!detector) return;
        const faces = await detector.estimateFaces(videoRef.current);
        
        if (faces.length > 0) {
          const landmarks = faces[0].keypoints;
          const ear = calculateEAR(landmarks);

          // Detect blink
          if (ear < blinkThreshold) {
            blinkTimestamps.current.push(performance.now());
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
                  lastSpokenPattern.current = pattern;
                  lastSpokenTime.current = now;
                  blinkTimestamps.current = [];
                  
                  // Callbacks - let the parent component handle speech
                  onGestureDetected?.(pattern);
                  onPhraseSpoken?.(phrase);
                }
              }
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
    };
  }, [detector, mapping, isInitialized, detectPattern, blinkThreshold, cooldownMs, onGestureDetected, onPhraseSpoken]);

  return { 
    videoRef, 
    isInitialized, 
    isDetecting,
    resetDetection: () => {
      blinkTimestamps.current = [];
      lastSpokenPattern.current = null;
    }
  };
}
