import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalibrationDots } from "@/components/calibration/CalibrationDots";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Eye, ArrowRight } from "lucide-react";

const Calibration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationComplete, setCalibrationComplete] = useState(false);
  const [calibrationData, setCalibrationData] = useState<any[]>([]);

  const calibrationSteps = [
    { id: 1, name: "Center", position: { x: 50, y: 50 } },
    { id: 2, name: "Top Left", position: { x: 20, y: 20 } },
    { id: 3, name: "Top Right", position: { x: 80, y: 20 } },
    { id: 4, name: "Bottom Left", position: { x: 20, y: 80 } },
    { id: 5, name: "Bottom Right", position: { x: 80, y: 80 } },
  ];

  const handleCalibrationPoint = (pointData: any) => {
    const newCalibrationData = [...calibrationData, pointData];
    setCalibrationData(newCalibrationData);
    
    if (currentStep < calibrationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCalibrationComplete(true);
      
      // Calculate center point from all calibration points
      const centerPoint = calibrationSteps.find(step => step.name === "Center");
      const centerX = window.innerWidth * (centerPoint?.position.x || 50) / 100;
      const centerY = window.innerHeight * (centerPoint?.position.y || 50) / 100;
      
      // Store calibration data with proper center coordinates
      const calibrationConfig = {
        centerX,
        centerY,
        threshold: 100,
        points: newCalibrationData,
        timestamp: Date.now()
      };
      
      localStorage.setItem('blinkSpeechCalibration', JSON.stringify(calibrationConfig));
      console.log('Calibration saved:', calibrationConfig);
    }
  };

  const startSession = () => {
    navigate('/session');
  };

  const progress = ((currentStep + 1) / calibrationSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-gentle flex flex-col">
      <header className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gaze Calibration
          </h1>
          <p className="text-muted-foreground">
            Look at each dot for 3 seconds to calibrate your gaze tracking
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl mx-auto w-full">
          {!calibrationComplete ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8 text-primary mr-3" />
                  <span className="text-xl font-medium">
                    Step {currentStep + 1} of {calibrationSteps.length}: 
                    Look at {calibrationSteps[currentStep].name}
                  </span>
                </div>
                <Progress value={progress} className="w-full max-w-md mx-auto" />
              </div>

              <div className="relative w-full h-96 bg-card rounded-lg border shadow-soft overflow-hidden">
                <CalibrationDots
                  currentStep={currentStep}
                  calibrationSteps={calibrationSteps}
                  onCalibrationPoint={handleCalibrationPoint}
                  isCalibrating={isCalibrating}
                />
              </div>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Position yourself comfortably and look directly at the highlighted dot
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Calibration Complete!
                </h2>
                <p className="text-muted-foreground">
                  Your gaze tracking has been successfully calibrated
                </p>
              </div>

              <Button 
                size="lg" 
                variant="default"
                onClick={startSession}
                className="gap-2"
              >
                Start Session
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calibration;