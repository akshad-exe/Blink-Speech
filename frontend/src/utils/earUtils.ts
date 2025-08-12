// MediaPipe Face Mesh landmark indices for eyes
const LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
const RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144];

export function calculateEAR(landmarks: { x: number; y: number }[]): number {
  if (!landmarks || landmarks.length < 468) {
    return 0.3; // Default value if landmarks are not available
  }

  // Calculate EAR for left eye
  const leftEAR = calculateEyeAspectRatio(landmarks, LEFT_EYE_INDICES);
  
  // Calculate EAR for right eye
  const rightEAR = calculateEyeAspectRatio(landmarks, RIGHT_EYE_INDICES);
  
  // Return average EAR
  return (leftEAR + rightEAR) / 2;
}

function calculateEyeAspectRatio(landmarks: { x: number; y: number }[], eyeIndices: number[]): number {
  // Calculate vertical distances
  const v1 = euclideanDistance(landmarks[eyeIndices[1]], landmarks[eyeIndices[5]]);
  const v2 = euclideanDistance(landmarks[eyeIndices[2]], landmarks[eyeIndices[4]]);
  
  // Calculate horizontal distance
  const h = euclideanDistance(landmarks[eyeIndices[0]], landmarks[eyeIndices[3]]);
  
  // EAR = (v1 + v2) / (2 * h)
  return (v1 + v2) / (2 * h);
}

function euclideanDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
