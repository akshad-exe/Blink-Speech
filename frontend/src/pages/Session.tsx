import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GestureGrid } from "@/components/session/GestureGrid";
import { PhrasePreview } from "@/components/session/PhrasePreview";
import { MappingEditor } from "@/components/session/MappingEditor";
import { Settings, Mic, MicOff, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Session = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [detectedGesture, setDetectedGesture] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [showMappingEditor, setShowMappingEditor] = useState(false);
  const [gestureMapping, setGestureMapping] = useState({
    "singleBlink": "Hello",
    "doubleBlink": "Yes",
    "tripleBlink": "No",
    "longBlink": "Thank you",
    "singleBlink_lookLeft": "I need help",
    "singleBlink_lookRight": "I'm okay",
    "doubleBlink_lookUp": "Water please",
    "doubleBlink_lookDown": "I'm tired"
  });

  useEffect(() => {
    // Check if calibration exists
    const calibrationData = localStorage.getItem('blinkSpeechCalibration');
    if (!calibrationData) {
      toast({
        title: "Calibration Required",
        description: "Please complete calibration first",
        variant: "destructive"
      });
      navigate('/calibration');
    }

    // Load saved mapping
    const savedMapping = localStorage.getItem('blinkSpeechMapping');
    if (savedMapping) {
      setGestureMapping(JSON.parse(savedMapping));
    }
  }, [navigate, toast]);

  const handleGestureDetected = (gesture: string) => {
    setDetectedGesture(gesture);
    const phrase = gestureMapping[gesture as keyof typeof gestureMapping];
    if (phrase) {
      setCurrentPhrase(phrase);
      
      // Text-to-speech
      if (isSpeechEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(phrase);
        speechSynthesis.speak(utterance);
      }
    }
  };

  const handleMappingUpdate = (newMapping: typeof gestureMapping) => {
    setGestureMapping(newMapping);
    localStorage.setItem('blinkSpeechMapping', JSON.stringify(newMapping));
    toast({
      title: "Mapping Updated",
      description: "Your gesture mappings have been saved"
    });
  };

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
    toast({
      title: isSpeechEnabled ? "Speech Disabled" : "Speech Enabled",
      description: isSpeechEnabled ? "Voice output turned off" : "Voice output turned on"
    });
  };

  const recalibrate = () => {
    navigate('/calibration');
  };

  return (
    <div className="min-h-screen bg-gradient-gentle">
      <header className="p-4 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Active Session</h1>
            <p className="text-sm text-muted-foreground">Blink patterns ready to communicate</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSpeech}
              className="gap-2"
            >
              {isSpeechEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              {isSpeechEnabled ? "Speech On" : "Speech Off"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={recalibrate}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Recalibrate
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowMappingEditor(!showMappingEditor)}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Edit Mappings
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <PhrasePreview 
            currentPhrase={currentPhrase}
            detectedGesture={detectedGesture}
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GestureGrid 
                gestureMapping={gestureMapping}
                detectedGesture={detectedGesture}
                onGestureDetected={handleGestureDetected}
              />
            </div>

            {showMappingEditor && (
              <div className="lg:col-span-1">
                <MappingEditor 
                  currentMapping={gestureMapping}
                  onMappingUpdate={handleMappingUpdate}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Session;