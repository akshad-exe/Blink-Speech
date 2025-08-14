import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GestureGrid } from "@/components/session/GestureGrid";
import { PhrasePreview } from "@/components/session/PhrasePreview";
import { MappingEditor } from "@/components/session/MappingEditor";
import { Settings, Mic, MicOff, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useGestureSpeech } from "@/hooks/useGestureSpeech";

const Session = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [detectedGesture, setDetectedGesture] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [showMappingEditor, setShowMappingEditor] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [isDetectionActive, setIsDetectionActive] = useState(false);
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
  
  // Debug mapping changes
  useEffect(() => {
    console.log('Current gesture mapping:', gestureMapping);
  }, [gestureMapping]);

  useEffect(() => {
    // Check if we're on HTTPS (required for camera access in production)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      console.warn('Camera access may require HTTPS in production environments');
      // Only show warning in production, not error
      if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        toast({
          title: "HTTPS Recommended",
          description: "Camera access works best with HTTPS in production",
          variant: "default"
        });
      }
    }
    
    // Check if calibration exists, create default if missing
    const calibrationData = localStorage.getItem('blinkSpeechCalibration');
    if (!calibrationData) {
      // Create default calibration for immediate testing
      const defaultCalibration = {
        centerX: 320, // Center of a 640px wide camera
        centerY: 240, // Center of a 480px high camera  
        threshold: 100,
        timestamp: Date.now()
      };
      localStorage.setItem('blinkSpeechCalibration', JSON.stringify(defaultCalibration));
      console.log('Default calibration created for testing:', defaultCalibration);
      
      toast({
        title: "Default Calibration Set",
        description: "Using default calibration - you can recalibrate later for better accuracy",
        variant: "default"
      });
    }

    // Load saved mapping
    const savedMapping = localStorage.getItem('blinkSpeechMapping');
    if (savedMapping) {
      setGestureMapping(JSON.parse(savedMapping));
    }

    // Request camera permission
    requestCameraPermission();
    
    // Set up permission change listener
    const checkPermission = async () => {
      try {
        const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (permissions.state === 'granted') {
          setCameraPermission('granted');
        } else if (permissions.state === 'denied') {
          setCameraPermission('denied');
        }
        
        permissions.addEventListener('change', () => {
          if (permissions.state === 'granted') {
            setCameraPermission('granted');
          } else if (permissions.state === 'denied') {
            setCameraPermission('denied');
          }
        });
      } catch (error) {
        console.error('Error checking camera permission:', error);
      }
    };
    
    checkPermission();
  }, [navigate, toast]);

  const requestCameraPermission = async () => {
    try {
      console.log('Requesting camera permission...');
      setCameraPermission('pending');
      
      // Check if we already have permission
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Current permission state:', permissions.state);
      
      if (permissions.state === 'granted') {
        console.log('Permission already granted');
        setCameraPermission('granted');
        return true;
      }
      
      console.log('Requesting getUserMedia...');
      // Request camera permission by getting user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log('getUserMedia successful, stopping stream...');
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      console.log('Setting permission to granted');
      setCameraPermission('granted');
      toast({
        title: "Camera Access Granted",
        description: "Camera is now ready for gesture detection",
      });
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
      toast({
        title: "Camera Permission Required",
        description: "Please allow camera access to use gesture detection",
        variant: "destructive"
      });
      return false;
    }
  };

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

  const handleMappingUpdate = (newMapping: Record<string, string>) => {
    setGestureMapping(newMapping as typeof gestureMapping);
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

  const debugCameraPermission = async () => {
    try {
      console.log('Checking camera permission status...');
      console.log('Protocol:', window.location.protocol);
      console.log('Host:', window.location.host);
      
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Camera permission state:', permissions.state);
      console.log('Current camera permission state:', cameraPermission);
      
      if (permissions.state === 'granted') {
        setCameraPermission('granted');
        toast({
          title: "Camera Permission Found",
          description: "Camera access is already granted",
        });
      } else if (permissions.state === 'denied') {
        setCameraPermission('denied');
        toast({
          title: "Camera Permission Status",
          description: "Camera permission is denied. Please check browser settings or try HTTPS.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Camera Permission Status",
          description: `Permission state: ${permissions.state}`,
        });
      }
    } catch (error) {
      console.error('Error checking permission:', error);
      toast({
        title: "Permission Check Error",
        description: "Could not check camera permission status",
        variant: "destructive"
      });
    }
  };

  // Initialize gesture speech detection - always pass the mapping
  const { videoRef, isInitialized, isDetecting, testDetection, resetDetection, startCamera, stopCamera } = useGestureSpeech(
    gestureMapping, // Always pass the mapping
    {
      onGestureDetected: (gesture) => {
        // Only process if detection is active
        if (!isDetectionActive) {
          console.log('Gesture detected but detection not active:', gesture);
          return;
        }
        
        console.log('Gesture detected in Session:', gesture);
        setDetectedGesture(gesture);
        const phrase = gestureMapping[gesture as keyof typeof gestureMapping];
        console.log('Mapped phrase for gesture', gesture, ':', phrase);
        
        if (phrase) {
          setCurrentPhrase(phrase);
          // Speak if speech is enabled
          if (isSpeechEnabled && 'speechSynthesis' in window) {
            try {
              speechSynthesis.cancel(); // Cancel any ongoing speech
              const utterance = new SpeechSynthesisUtterance(phrase);
              utterance.rate = 0.9; // Slightly slower for clarity
              utterance.volume = 0.8;
              utterance.onstart = () => console.log('Speech started:', phrase);
              utterance.onend = () => console.log('Speech ended:', phrase);
              utterance.onerror = (e) => console.error('Speech error:', e);
              speechSynthesis.speak(utterance);
              console.log('Speaking phrase:', phrase);
            } catch (error) {
              console.error('Speech synthesis error:', error);
            }
          } else {
            console.log('Speech disabled or not supported');
          }
        } else {
          console.warn('No phrase mapped for gesture:', gesture);
        }
      },
      onPhraseSpoken: (phrase) => {
        // Don't auto-speak, let the onGestureDetected handle it
      },
      isActive: isDetectionActive // Pass active state to hook
    }
  );
  
  // Start camera as soon as permission is granted and initialized
  useEffect(() => {
    if (cameraPermission === 'granted' && isInitialized && videoRef.current) {
      console.log('Camera permission granted, starting camera...');
      startCamera().then(success => {
        if (!success) {
          console.log('Failed to start camera');
          toast({
            title: "Camera Error",
            description: "Failed to start camera. Please check your camera settings.",
            variant: "destructive"
          });
        } else {
          console.log('Camera started successfully');
        }
      });
    }
  }, [cameraPermission, isInitialized, videoRef]);

  return (
    <div className="min-h-screen bg-gradient-gentle">
      <header className="p-4 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Active Session</h1>
              <p className="text-sm text-muted-foreground">Blink patterns ready to communicate</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  !isInitialized ? 'bg-yellow-500' : 
                  cameraPermission !== 'granted' ? 'bg-red-500' :
                  isDetectionActive ? 'bg-green-500' : 'bg-gray-500'
                }`} />
                <span className="text-muted-foreground">
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
                {isSpeechEnabled ? "Speech On" : "Speech Off"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`gap-2 ${autoSpeak ? 'bg-primary/10 border-primary/30' : ''}`}
                disabled={!isSpeechEnabled}
              >
                {autoSpeak ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {autoSpeak ? "Auto-Speak On" : "Auto-Speak Off"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowCamera(!showCamera)}
                className="gap-2"
              >
                {showCamera ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {showCamera ? "Hide Camera" : "Show Camera"}
              </Button>
              
              <Button 
                variant={isDetectionActive ? "destructive" : "default"}
                size="sm" 
                onClick={async () => {
                  if (isDetectionActive) {
                    setIsDetectionActive(false);
                    resetDetection();
                    setDetectedGesture("");
                    setCurrentPhrase("");
                  } else {
                    // Check permission first
                    if (cameraPermission !== 'granted') {
                      const granted = await requestCameraPermission();
                      if (!granted) return;
                    }
                    setIsDetectionActive(true);
                  }
                }}
                className="gap-2"
                disabled={!isInitialized}
              >
                {isDetectionActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isDetectionActive ? "Stop Detection" : "Start Detection"}
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

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-4">
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
                onClick={async () => {
                  if (isDetectionActive) {
                    setIsDetectionActive(false);
                    resetDetection();
                    setDetectedGesture("");
                    setCurrentPhrase("");
                  } else {
                    // Check permission first
                    if (cameraPermission !== 'granted') {
                      const granted = await requestCameraPermission();
                      if (!granted) return;
                    }
                    setIsDetectionActive(true);
                  }
                }}
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
        </div>
      </header>

      <main className="p-6">
        {/* Camera video element - always visible when camera permission is granted */}
        {showCamera && cameraPermission === 'granted' && (
          <div className="fixed top-20 right-4 z-50">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-64 h-48 rounded-lg border-2 border-primary/20 shadow-lg bg-black"
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Camera Feed
            </div>
            <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
              isDetectionActive && isDetecting ? 'bg-green-500 text-white' : 
              isDetectionActive ? 'bg-yellow-500 text-white' : 
              'bg-gray-500 text-white'
            }`}>
              {isDetectionActive && isDetecting ? 'Detecting' : 
               isDetectionActive ? 'Starting...' : 
               'Inactive'}
            </div>
            
            {/* Status indicators */}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className={`w-2 h-2 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-red-500'}`} title="Initialized" />
              <div className={`w-2 h-2 rounded-full ${cameraPermission === 'granted' ? 'bg-green-500' : 'bg-red-500'}`} title="Camera Permission" />
              <div className={`w-2 h-2 rounded-full ${isDetectionActive ? 'bg-green-500' : 'bg-gray-500'}`} title="Detection Active" />
            </div>
            
            {/* Current gesture indicator */}
            {detectedGesture && (
              <div className="absolute bottom-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded animate-pulse">
                {detectedGesture}
              </div>
            )}
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