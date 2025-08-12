import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown,
  Zap,
  Clock
} from "lucide-react";

interface GestureGridProps {
  gestureMapping: Record<string, string>;
  detectedGesture: string;
  onGestureDetected: (gesture: string) => void;
}

const gestureIcons: Record<string, any> = {
  "singleBlink": Eye,
  "doubleBlink": EyeOff,
  "tripleBlink": Zap,
  "longBlink": Clock,
  "singleBlink_lookLeft": ArrowLeft,
  "singleBlink_lookRight": ArrowRight,
  "doubleBlink_lookUp": ArrowUp,
  "doubleBlink_lookDown": ArrowDown
};

const gestureNames: Record<string, string> = {
  "singleBlink": "Single Blink",
  "doubleBlink": "Double Blink", 
  "tripleBlink": "Triple Blink",
  "longBlink": "Long Blink",
  "singleBlink_lookLeft": "Blink + Look Left",
  "singleBlink_lookRight": "Blink + Look Right",
  "doubleBlink_lookUp": "Double Blink + Look Up",
  "doubleBlink_lookDown": "Double Blink + Look Down"
};

export const GestureGrid = ({
  gestureMapping,
  detectedGesture,
  onGestureDetected
}: GestureGridProps) => {
  const [simulationMode, setSimulationMode] = useState(true);

  // Simulate gesture detection for demo purposes
  useEffect(() => {
    if (simulationMode) {
      const gestures = Object.keys(gestureMapping);
      let currentIndex = 0;

      const interval = setInterval(() => {
        onGestureDetected(gestures[currentIndex]);
        currentIndex = (currentIndex + 1) % gestures.length;
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [simulationMode, gestureMapping, onGestureDetected]);

  const handleGestureClick = (gesture: string) => {
    onGestureDetected(gesture);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Available Gestures</h2>
        <Badge variant="outline" className="text-xs">
          {simulationMode ? "Demo Mode" : "Live Detection"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(gestureMapping).map(([gesture, phrase]) => {
          const IconComponent = gestureIcons[gesture] || Eye;
          const isDetected = detectedGesture === gesture;
          
          return (
            <Card 
              key={gesture}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-warm hover:scale-[1.02]",
                {
                  "ring-2 ring-primary ring-offset-2 bg-primary/5 shadow-warm animate-gentle-pulse": isDetected,
                  "hover:bg-accent/50": !isDetected
                }
              )}
              onClick={() => handleGestureClick(gesture)}
            >
              <CardContent className="p-4 text-center space-y-3">
                <div className={cn(
                  "w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-colors",
                  {
                    "bg-primary text-primary-foreground": isDetected,
                    "bg-muted text-muted-foreground": !isDetected
                  }
                )}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium text-sm text-foreground">
                    {gestureNames[gesture] || gesture}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    "{phrase}"
                  </p>
                </div>

                {isDetected && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Active
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Click any gesture card to test speech output
        </p>
      </div>
    </div>
  );
};