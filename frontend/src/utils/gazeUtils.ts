interface GazeData {
  x: number;
  y: number;
  confidence: number;
}

let calibrationData: { centerX: number; centerY: number; threshold: number } | null = null;

export function setCalibrationData(centerX: number, centerY: number, threshold: number = 100) {
  calibrationData = { centerX, centerY, threshold };
}

export function getGazeDirection(x?: number, y?: number): string {
  // If no coordinates provided, try to get from WebGazer
  if (x === undefined || y === undefined) {
    const gazeData = getWebGazerData();
    if (gazeData) {
      x = gazeData.x;
      y = gazeData.y;
    } else {
      return 'center'; // Default if no gaze data available
    }
  }

  // Use calibration data if available, otherwise use screen center
  const centerX = calibrationData?.centerX ?? window.innerWidth / 2;
  const centerY = calibrationData?.centerY ?? window.innerHeight / 2;
  const threshold = calibrationData?.threshold ?? 100;
  
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  
  // Check if gaze is within threshold of center
  if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
    return 'center';
  }
  
  // Determine primary direction
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'lookRight' : 'lookLeft';
  } else {
    return deltaY > 0 ? 'lookDown' : 'lookUp';
  }
}

function getWebGazerData(): GazeData | null {
  // @ts-ignore - WebGazer types
  if (typeof window !== 'undefined' && window.webgazer) {
    // @ts-ignore
    const data = window.webgazer.getCurrentPrediction();
    if (data && data.x !== null && data.y !== null) {
      return {
        x: data.x,
        y: data.y,
        confidence: data.confidence || 0
      };
    }
  }
  return null;
}

export function getGazeConfidence(): number {
  const data = getWebGazerData();
  return data?.confidence ?? 0;
}
