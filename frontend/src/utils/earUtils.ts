// MediaPipe Face Mesh landmark indices for eyes
const LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
const RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144];

export function calculateEAR(landmarks: { x: number; y: number }[]): number {
  if (!landmarks || landmarks.length < 468) {
    console.warn('⚠️ Insufficient landmarks for EAR calculation:', landmarks?.length || 0);
    return 0.35; // Default value if landmarks are not available
  }

  try {
    // Validate that we have the required landmark indices
    const requiredIndices = [...LEFT_EYE_INDICES, ...RIGHT_EYE_INDICES];
    for (const idx of requiredIndices) {
      if (!landmarks[idx] || typeof landmarks[idx].x !== 'number' || typeof landmarks[idx].y !== 'number') {
        console.warn('⚠️ Invalid landmark at index:', idx);
        return 0.35;
      }
    }
    
    // Calculate EAR for left eye
    const leftEAR = calculateEyeAspectRatio(landmarks, LEFT_EYE_INDICES);
    
    // Calculate EAR for right eye
    const rightEAR = calculateEyeAspectRatio(landmarks, RIGHT_EYE_INDICES);
    
    // Validate EAR values
    if (isNaN(leftEAR) || isNaN(rightEAR) || !isFinite(leftEAR) || !isFinite(rightEAR)) {
      console.warn('⚠️ Invalid EAR calculation:', { leftEAR, rightEAR });
      return 0.35; // Return default if calculation failed
    }
    
    if (leftEAR <= 0 || rightEAR <= 0 || leftEAR > 1 || rightEAR > 1) {
      console.warn('⚠️ EAR values out of expected range:', { leftEAR, rightEAR });
      return 0.35;
    }
    
    // Return average EAR
    const avgEAR = (leftEAR + rightEAR) / 2;
    
    // Clamp EAR to reasonable range (more lenient)
    const clampedEAR = Math.max(0.05, Math.min(0.8, avgEAR));
    
    return clampedEAR;
  } catch (error) {
    console.error('❌ EAR calculation error:', error);
    return 0.35;
  }
}

function calculateEyeAspectRatio(landmarks: { x: number; y: number }[], eyeIndices: number[]): number {
  try {
    // Validate indices
    for (const idx of eyeIndices) {
      if (idx >= landmarks.length || !landmarks[idx]) {
        throw new Error(`Invalid landmark index: ${idx}`);
      }
    }
    
    // Calculate vertical distances
    const v1 = euclideanDistance(landmarks[eyeIndices[1]], landmarks[eyeIndices[5]]);
    const v2 = euclideanDistance(landmarks[eyeIndices[2]], landmarks[eyeIndices[4]]);
    
    // Calculate horizontal distance
    const h = euclideanDistance(landmarks[eyeIndices[0]], landmarks[eyeIndices[3]]);
    
    // Prevent division by zero
    if (h === 0) {
      return 0.3;
    }
    
    // EAR = (v1 + v2) / (2 * h)
    const ear = (v1 + v2) / (2 * h);
    
    // Return NaN check
    return isNaN(ear) ? 0.3 : ear;
  } catch (error) {
    console.error('Eye aspect ratio calculation error:', error);
    return 0.3;
  }
}

function euclideanDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
