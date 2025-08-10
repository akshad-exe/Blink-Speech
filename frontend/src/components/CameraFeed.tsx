import React, { useEffect, forwardRef } from 'react';

export const CameraFeed = forwardRef<HTMLVideoElement>((props, ref) => {
  useEffect(() => {
    async function startCamera() {
      if (ref && 'current' in ref && ref.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          ref.current.srcObject = stream;
          await ref.current.play();
        } catch (err) {
          console.error('Unable to access webcam', err);
        }
      }
    }
    startCamera();
  }, [ref]);

  return <video ref={ref} width={320} height={240} muted playsInline style={{ borderRadius: 8, border: '1px solid #ccc' }} />;
});
