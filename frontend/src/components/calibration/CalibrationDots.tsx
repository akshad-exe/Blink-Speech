import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CalibrationStep {
  id: number;
  name: string;
  position: { x: number; y: number };
}

interface CalibrationDotsProps {
  currentStep: number;
  calibrationSteps: CalibrationStep[];
  onCalibrationPoint: (pointData: any) => void;
  isCalibrating: boolean;
}

export const CalibrationDots = ({
  currentStep,
  calibrationSteps,
  onCalibrationPoint,
  isCalibrating
}: CalibrationDotsProps) => {
  const [countdown, setCountdown] = useState(3);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currentStep >= 0 && currentStep < calibrationSteps.length) {
      setIsActive(true);
      setCountdown(3);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // Simulate calibration point capture
            setTimeout(() => {
              onCalibrationPoint({
                step: currentStep,
                position: calibrationSteps[currentStep].position,
                timestamp: Date.now()
              });
              setIsActive(false);
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep, calibrationSteps, onCalibrationPoint]);

  const currentPosition = calibrationSteps[currentStep]?.position;

  return (
    <div className="relative w-full h-full">
      {calibrationSteps.map((step, index) => {
        const isCurrentStep = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div
            key={step.id}
            className={cn(
              "absolute w-8 h-8 rounded-full border-4 transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2",
              {
                "bg-primary border-primary-glow shadow-warm animate-gentle-pulse": isCurrentStep && isActive,
                "bg-green-500 border-green-400 shadow-soft": isCompleted,
                "bg-muted border-muted-foreground/50": !isCurrentStep && !isCompleted,
                "scale-150": isCurrentStep,
                "scale-100": !isCurrentStep
              }
            )}
            style={{
              left: `${step.position.x}%`,
              top: `${step.position.y}%`
            }}
          >
            {isCurrentStep && isActive && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {countdown}
                </span>
              </div>
            )}
            
            {isCompleted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            )}
          </div>
        );
      })}

      {/* Instruction overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-2">
          <div className="text-lg font-medium text-foreground/80">
            {isActive ? `Look at the ${calibrationSteps[currentStep]?.name} dot` : "Get ready..."}
          </div>
          {isActive && countdown > 0 && (
            <div className="text-sm text-muted-foreground">
              Hold your gaze for {countdown} seconds
            </div>
          )}
        </div>
      </div>
    </div>
  );
};