import { useState, useEffect, useRef } from 'react';
import * as mp from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';
import WebGazer from 'webgazer';
import { calculateEAR } from '../utils/earUtils';
import { speakPhrase } from '../utils/speechSynthesis';
import { getGazeDirection } from '../utils/gazeUtils';

export function useGestureSpeech(mapping: Record<string, string>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [detector, setDetector] = useState<mp.FaceLandmarksDetector | null>(null);
  const blinkTimestamps = useRef<number[]>([]);
  const lastSpokenPattern = useRef<string | null>(null);

  useEffect(() => {
    async function init() {
      const model = mp.SupportedModels.MediaPipeFaceMesh;
      const det = await mp.createDetector(model);
      setDetector(det);
      WebGazer.setRegression('ridge').setTracker('clmtrackr').begin();
    }
    init();

    return () => {
      WebGazer.end();
    };
  }, []);

  useEffect(() => {
    let animationId: number;

    async function detect() {
      if (!videoRef.current || !detector) {
        animationId = requestAnimationFrame(detect);
        return;
      }
      const faces = await detector.estimateFaces(videoRef.current);
      if (faces.length > 0) {
        const landmarks = faces[0].keypoints;
        const ear = calculateEAR(landmarks);

        if (ear < 0.25) {
          blinkTimestamps.current.push(performance.now());
        }

        const gazeDir = getGazeDirection();

        const pattern = detectPattern(blinkTimestamps.current, gazeDir);
        if (pattern && pattern !== lastSpokenPattern.current) {
          const phrase = mapping[pattern];
          if (phrase) {
            speakPhrase(phrase);
            lastSpokenPattern.current = pattern;
            blinkTimestamps.current = [];
          }
        }
      }
      animationId = requestAnimationFrame(detect);
    }
    animationId = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(animationId);
  }, [detector, mapping]);

  return { videoRef };
}

function detectPattern(blinks: number[], gazeDir: string): string | null {
  // Example logic for simple double blink + gaze
  if (blinks.length >= 2) {
    if (gazeDir === 'lookLeft') return 'doubleBlink_lookLeft';
    if (gazeDir === 'lookRight') return 'doubleBlink_lookRight';
  }
  return null;
}
