// src/components/GestureSpeech.tsx
import React from 'react';
import { useGestureSpeech } from '../hooks/useGestureSpeech';
import { CameraFeed } from './CameraFeed';

interface GestureSpeechProps {
  mapping: Record<string, string>;
}

const GestureSpeech: React.FC<GestureSpeechProps> = ({ mapping }) => {
  const { videoRef } = useGestureSpeech(mapping);

  return (
    <div>
      <h2>Gesture Detection and Speech Output</h2>
      <CameraFeed ref={videoRef} />
    </div>
  );
};

export default GestureSpeech;
