// Temporary script to create calibration data for testing
const calibrationData = {
  centerX: 320, // Center of a 640px wide camera
  centerY: 240, // Center of a 480px high camera  
  threshold: 100
};

localStorage.setItem('blinkSpeechCalibration', JSON.stringify(calibrationData));
console.log('Calibration data created:', calibrationData);
