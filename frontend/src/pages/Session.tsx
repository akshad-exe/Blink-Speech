import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GestureGrid } from "@/components/session/GestureGrid";
import { PhrasePreview } from "@/components/session/PhrasePreview";
import { MappingEditor } from "@/components/session/MappingEditor";
import { Settings, Mic, MicOff, RotateCcw, Eye, EyeOff, Camera, Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGestureSpeech } from "@/hooks/useGestureSpeech";

const Session = () => {
  const { toast } = useToast();
  
  // State variables
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [detectedGesture, setDetectedGesture] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [showMappingEditor, setShowMappingEditor] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [gestureMapping, setGestureMapping] = useState<Record<string, string>>({
    "singleBlink": "Hello",
    "doubleBlink": "Yes",
    "tripleBlink": "No",
    "longBlink": "Thank you",
    "singleBlink_lookLeft": "I need help",
    "singleBlink_lookRight": "I'm okay",
    "doubleBlink_lookUp": "Water please",
    "doubleBlink_lookDown": "I'm tired"
  });

  // Hook for gesture speech functionality
  const {
    videoRef,
    isInitialized,
    testDetection,
    startCamera,
    stopCamera,
    resetDetection
  } = useGestureSpeech(gestureMapping, {
    onGestureDetected: (gesture: string) => {
      setDetectedGesture(gesture);
      const phrase = gestureMapping[gesture];
      if (phrase) {
        setCurrentPhrase(phrase);
        if (autoSpeak && isSpeechEnabled && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(phrase);
          speechSynthesis.speak(utterance);
        }
      }
    },
    onPhraseSpoken: (phrase: string) => {
      setCurrentPhrase(phrase);
    },
    isActive: isDetectionActive
  });

  // Request camera permission
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      setCameraPermission('pending');
      
      // Request camera permission with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
      return false;
    }
  };

  // Handle mapping updates
  const handleMappingUpdate = (newMapping: Record<string, string>) => {
    setGestureMapping(newMapping);
    toast({
      title: "Mapping Updated",
      description: "Gesture mappings have been updated successfully",
    });
  };

  // Toggle speech functionality
  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
    if (!isSpeechEnabled && 'speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
    }
  };

  // Start/stop detection
  const toggleDetection = async () => {
    if (isDetectionActive) {
      setIsDetectionActive(false);
      stopCamera();
      setDetectedGesture("");
      setCurrentPhrase("");
    } else {
      // Check permission first
      if (cameraPermission !== 'granted') {
        const granted = await requestCameraPermission();
        if (!granted) return;
      }
      const cameraStarted = await startCamera();
      if (cameraStarted) {
        setIsDetectionActive(true);
      }
    }
  };

  // Recalibrate function
  const recalibrate = () => {
    resetDetection();
    setDetectedGesture("");
    setCurrentPhrase("");
    toast({
      title: "Recalibrated",
      description: "Detection system has been reset",
    });
  };

  // Request camera permission on component mount
  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-gentle">
      <main className="pt-6">
        {/* Desktop Layout */}
        <div className="hidden lg:block px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Active Session</h1>
              <p className="text-lg text-muted-foreground">Blink patterns ready to communicate</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-border/20">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  !isInitialized ? 'bg-yellow-500' : 
                  cameraPermission !== 'granted' ? 'bg-red-500' :
                  isDetectionActive ? 'bg-green-500' : 'bg-gray-500'
                }`} />
                <span className="text-sm font-medium text-foreground">
                  {!isInitialized ? 'Initializing...' : 
                   cameraPermission !== 'granted' ? 'Camera Required' :
                   isDetectionActive ? 'Detection Active' : 'Ready to Start'}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSpeech}
                className="gap-2 hover:bg-white/80 transition-colors"
              >
                {isSpeechEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                {isSpeechEnabled ? "Speech" : "Mute"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`gap-2 transition-colors ${autoSpeak ? 'bg-primary/10 border-primary/30 hover:bg-primary/20' : 'hover:bg-white/80'}`}
                disabled={!isSpeechEnabled}
              >
                {autoSpeak ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Auto
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowCamera(!showCamera)}
                className="gap-2 hover:bg-white/80 transition-colors"
              >
                {showCamera ? <Camera className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Camera
              </Button>
              
              <Button 
                variant={isDetectionActive ? "destructive" : "default"}
                size="sm" 
                onClick={toggleDetection}
                className={`gap-2 font-semibold ${!isDetectionActive ? 'bg-primary hover:bg-primary/90 text-white shadow-lg' : ''}`}
                disabled={!isInitialized}
              >
                {isDetectionActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isDetectionActive ? "Stop" : "Start"}
              </Button>
              
              {currentPhrase && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (isSpeechEnabled && 'speechSynthesis' in window) {
                      const utterance = new SpeechSynthesisUtterance(currentPhrase);
                      speechSynthesis.speak(utterance);
                    }
                  }}
                  className="gap-2 hover:bg-white/80 transition-colors"
                  disabled={!isSpeechEnabled}
                >
                  <Mic className="w-4 h-4" />
                  Speak
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={recalibrate}
                className="gap-2 hover:bg-white/80 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Calibrate
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMappingEditor(!showMappingEditor)}
                className="gap-2 hover:bg-white/80 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Edit Mappings
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-4 mb-6 px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Active Session</h1>
              <p className="text-xs text-muted-foreground">Blink patterns ready to communicate</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                !isInitialized ? 'bg-yellow-500' : 
                cameraPermission !== 'granted' ? 'bg-red-500' :
                isDetectionActive ? 'bg-green-500' : 'bg-gray-500'
              }`} />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSpeech}
              className="gap-1 text-xs"
            >
              {isSpeechEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
              {isSpeechEnabled ? "Speech" : "Mute"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`gap-1 text-xs ${autoSpeak ? 'bg-primary/10 border-primary/30' : ''}`}
              disabled={!isSpeechEnabled}
            >
              {autoSpeak ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              Auto
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCamera(!showCamera)}
              className="gap-1 text-xs"
            >
              {showCamera ? <Camera className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              Camera
            </Button>
            
            <Button 
              variant={isDetectionActive ? "destructive" : "default"}
              size="sm" 
              onClick={toggleDetection}
              className="gap-1 text-xs"
              disabled={!isInitialized}
            >
              {isDetectionActive ? <Square className="w-3 h-3" /> : <Play className="w-4 h-4" />}
              {isDetectionActive ? "Stop" : "Start"}
            </Button>
            
            {currentPhrase && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  if (isSpeechEnabled && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(currentPhrase);
                    speechSynthesis.speak(utterance);
                  }
                }}
                className="gap-1 text-xs"
                disabled={!isSpeechEnabled}
              >
                <Mic className="w-3 h-3" />
                Speak
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={recalibrate}
              className="gap-1 text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              Calibrate
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowMappingEditor(!showMappingEditor)}
              className="gap-1 text-xs"
            >
              <Settings className="w-3 h-3" />
              Edit
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {!isInitialized ? 'Initializing...' : 
             cameraPermission !== 'granted' ? 'Camera Required' :
             isDetectionActive ? 'Detection Active' : 'Ready to Start'}
          </div>
        </div>

        {/* Camera video element - always visible when camera permission is granted */}
        {showCamera && cameraPermission === 'granted' && (
          <div className="fixed top-20 right-4 z-50">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="rounded-lg border shadow-lg"
              width={320}
              height={240}
            />
          </div>
        )}

        {/* Camera permission request */}
        {showCamera && cameraPermission === 'denied' && (
          <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-lg shadow-xl max-w-xs">
            <div className="text-sm font-semibold mb-2">Camera Access Required</div>
            <div className="text-xs opacity-90 mb-4">Please allow camera access to use Blink Speech</div>
            <div className="flex flex-col gap-2">
              <Button 
                size="sm" 
                className="bg-white text-red-600 hover:bg-gray-100 font-medium"
                onClick={requestCameraPermission}
              >
                Allow Camera Access
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-red-600"
                onClick={() => setShowCamera(false)}
              >
                Hide Camera
              </Button>
            </div>
          </div>
        )}

        {showCamera && cameraPermission === 'pending' && (
          <div className="fixed bottom-6 right-6 z-50 bg-yellow-600 text-white p-4 rounded-lg shadow-xl max-w-xs">
            <div className="text-sm font-semibold mb-2">Requesting Camera Access</div>
            <div className="text-xs opacity-90">Please check your browser for the permission dialog</div>
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-6 p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 mx-6 lg:mx-8 xl:mx-12">
          <PhrasePreview 
            currentPhrase={currentPhrase}
            detectedGesture={detectedGesture}
          />
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GestureGrid 
                gestureMapping={gestureMapping}
                detectedGesture={detectedGesture}
                onGestureDetected={setDetectedGesture}
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