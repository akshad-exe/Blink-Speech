import { useState, useEffect, useRef } from "react";
import Header from "@/components/landing/Header";
import { Button } from "@/components/ui/button";
import { GestureGrid } from "@/components/session/GestureGrid";
import { PhrasePreview } from "@/components/session/PhrasePreview";
import { MappingEditor } from "@/components/session/MappingEditor";
import { Settings, Mic, MicOff, RotateCcw, Eye, EyeOff } from "lucide-react";
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
    isDetecting,
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

  // Debug camera permission
  const debugCameraPermission = () => {
    console.log('Camera permission state:', cameraPermission);
    console.log('Video ref:', videoRef.current);
    console.log('Media devices:', navigator.mediaDevices);
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
      <Header />
      
      <main className="p-6 pt-24">
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
          <div className="fixed top-4 left-4 z-50 bg-red-500 text-white p-3 rounded-lg shadow-lg">
            <div className="text-sm font-medium">Camera Access Required</div>
            <div className="text-xs opacity-90">Please allow camera access</div>
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={requestCameraPermission}
              >
                Grant Permission
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => {
                  setCameraPermission('pending');
                  setTimeout(() => requestCameraPermission(), 100);
                }}
              >
                Refresh
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={debugCameraPermission}
              >
                Debug
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={async () => {
                  console.log('Direct getUserMedia test...');
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    console.log('Direct test successful!');
                    stream.getTracks().forEach(track => track.stop());
                    toast({
                      title: "Direct Test Success",
                      description: "Camera permission dialog appeared",
                    });
                  } catch (error: unknown) {
                    console.error('Direct test failed:', error);
                    toast({
                      title: "Direct Test Failed",
                      description: error instanceof Error ? error.message : String(error),
                      variant: "destructive"
                    });
                  }
                }}
              >
                Test Direct
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => {
                  console.log('Resetting permission state...');
                  setCameraPermission('pending');
                  toast({
                    title: "Permission Reset",
                    description: "Permission state reset. Try granting permission again.",
                  });
                }}
              >
                Reset State
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={testDetection}
                disabled={!isInitialized}
              >
                Test Detection
              </Button>
            </div>
          </div>
        )}

        {showCamera && cameraPermission === 'pending' && (
          <div className="fixed top-4 left-4 z-50 bg-yellow-500 text-white p-3 rounded-lg shadow-lg">
            <div className="text-sm font-medium">Requesting Camera...</div>
            <div className="text-xs opacity-90">Please allow camera access</div>
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Active Session</h1>
              <p className="text-muted-foreground">Blink patterns ready to communicate</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  !isInitialized ? 'bg-yellow-500' : 
                  cameraPermission !== 'granted' ? 'bg-red-500' :
                  isDetectionActive ? 'bg-green-500' : 'bg-gray-500'
                }`} />
                <span className="text-sm text-muted-foreground">
                  {!isInitialized ? 'Initializing...' : 
                   cameraPermission !== 'granted' ? 'Camera Required' :
                   isDetectionActive ? 'Detection Active' : 'Ready to Start'}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSpeech}
                className="gap-2"
              >
                {isSpeechEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                {isSpeechEnabled ? "Speech" : "Mute"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`gap-2 ${autoSpeak ? 'bg-primary/10 border-primary/30' : ''}`}
                disabled={!isSpeechEnabled}
              >
                {autoSpeak ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Auto
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowCamera(!showCamera)}
                className="gap-2"
              >
                {showCamera ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Camera
              </Button>
              
              <Button 
                variant={isDetectionActive ? "destructive" : "default"}
                size="sm" 
                onClick={toggleDetection}
                className="gap-2"
                disabled={!isInitialized}
              >
                {isDetectionActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  className="gap-2"
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
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Calibrate
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
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-4 mb-6">
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
              {showCamera ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              Camera
            </Button>
            
            <Button 
              variant={isDetectionActive ? "destructive" : "default"}
              size="sm" 
              onClick={toggleDetection}
              className="gap-1 text-xs"
              disabled={!isInitialized}
            >
              {isDetectionActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
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