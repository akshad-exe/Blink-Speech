import { useState, useEffect, useMemo } from "react";
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
  const hookOptions = useMemo(() => ({
    onGestureDetected: (gesture: string) => {
      console.log('🎯 Gesture detected:', gesture);
      console.log('📋 Current gesture mapping:', gestureMapping);
      console.log('🔍 Looking for phrase for gesture:', gesture);
      
      setDetectedGesture(gesture);
      const phrase = gestureMapping[gesture];
      
      if (phrase) {
        console.log('📝 Phrase found:', phrase);
        setCurrentPhrase(phrase);
        
        // Auto-speak if enabled
        if (autoSpeak && isSpeechEnabled) {
          console.log('🗣️ Auto-speaking phrase:', phrase);
          console.log('Speech state:', { autoSpeak, isSpeechEnabled });
          const speechResult = speakText(phrase);
          console.log('Speech result:', speechResult);
        } else {
          console.log('Auto-speak disabled:', { autoSpeak, isSpeechEnabled });
        }
      } else {
        console.log('❌ No phrase found for gesture:', gesture);
        console.log('Available gestures:', Object.keys(gestureMapping));
        console.log('Available phrases:', Object.values(gestureMapping));
      }
    },
    onPhraseSpoken: (phrase: string) => {
      console.log('Phrase spoken callback:', phrase);
      setCurrentPhrase(phrase);
      
      // Also auto-speak from this callback if enabled
      if (autoSpeak && isSpeechEnabled) {
        console.log('🗣️ Auto-speaking from phrase callback:', phrase);
        speakText(phrase);
      }
    },
    isActive: isDetectionActive
  }), [autoSpeak, isSpeechEnabled, isDetectionActive]);

  const {
    videoRef,
    isInitialized,
    testDetection,
    startCamera,
    stopCamera,
    resetDetection
  } = useGestureSpeech(gestureMapping, hookOptions);

  // Debug the hook options being passed
  useEffect(() => {
    console.log('Hook options updated:', {
      isActive: isDetectionActive,
      mappingKeys: Object.keys(gestureMapping),
      autoSpeak,
      isSpeechEnabled
    });
  }, [isDetectionActive, gestureMapping, autoSpeak, isSpeechEnabled]);



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

  // Robust speech synthesis function
  const speakText = (text: string) => {
    console.log('🎤 speakText called with:', text);
    console.log('Speech state:', { isSpeechEnabled, autoSpeak });
    
    if (!isSpeechEnabled || !('speechSynthesis' in window)) {
      console.log('❌ Speech synthesis not available or disabled');
      return false;
    }
    
    try {
      console.log('🔧 Setting up speech synthesis...');
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech settings
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      
      // Add event handlers for debugging
      utterance.onstart = () => console.log('🔊 Speech started:', text);
      utterance.onend = () => console.log('🔇 Speech ended:', text);
      utterance.onerror = (e) => console.error('❌ Speech error:', e);
      
      // Speak the text
      speechSynthesis.speak(utterance);
      console.log('✅ Speech synthesis triggered successfully:', text);
      return true;
    } catch (error) {
      console.error('❌ Speech synthesis error:', error);
      return false;
    }
  };

  // Toggle speech functionality
  const toggleSpeech = () => {
    const newState = !isSpeechEnabled;
    setIsSpeechEnabled(newState);
    console.log('Speech toggled:', newState ? 'ON' : 'OFF');
    
    if (!newState && 'speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      console.log('Speech cancelled');
    }
  };

  // Toggle camera display
  const toggleCameraDisplay = async () => {
    console.log('Toggle camera display clicked. Current state:', { showCamera, cameraPermission, isDetectionActive });
    
    if (showCamera) {
      setShowCamera(false);
      // Don't stop camera if detection is active
      if (!isDetectionActive) {
        stopCamera();
      }
    } else {
      // Check permission first
      if (cameraPermission !== 'granted') {
        console.log('Requesting camera permission...');
        const granted = await requestCameraPermission();
        if (!granted) {
          console.log('Camera permission denied');
          return;
        }
      }
      // Start camera for display
      console.log('Starting camera for display...');
      const cameraStarted = await startCamera();
      console.log('Camera start result:', cameraStarted);
      if (cameraStarted) {
        setShowCamera(true);
        console.log('Camera display enabled');
      }
    }
  };

  // Start/stop detection
  const toggleDetection = async () => {
    console.log('Toggle detection clicked. Current state:', { isDetectionActive, cameraPermission });
    
    if (isDetectionActive) {
      console.log('Stopping detection...');
      setIsDetectionActive(false);
      stopCamera();
      setDetectedGesture("");
      setCurrentPhrase("");
      setShowCamera(false); // Hide camera when stopping detection
      console.log('Detection stopped');
    } else {
      console.log('Starting detection...');
      // Check permission first
      if (cameraPermission !== 'granted') {
        console.log('Requesting camera permission for detection...');
        const granted = await requestCameraPermission();
        if (!granted) {
          console.log('Camera permission denied for detection');
          return;
        }
      }
      console.log('Starting camera for detection...');
      const cameraStarted = await startCamera();
      console.log('Camera start result for detection:', cameraStarted);
      if (cameraStarted) {
        console.log('Setting detection active...');
        setIsDetectionActive(true);
        setShowCamera(true); // Show camera when starting detection
        console.log('Detection started successfully');
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

  // Request camera permission on component mount and handle initial camera state
  useEffect(() => {
    const initCamera = async () => {
      const granted = await requestCameraPermission();
      if (granted) {
        // If permission is granted, we can show camera when needed
        console.log('Camera permission granted on mount');
      }
    };
    initCamera();
  }, []);

  // Monitor video element for stream changes
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded:', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState,
          hasStream: !!video.srcObject
        });
      };
      
      const handleCanPlay = () => {
        console.log('Video can play:', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState
        });
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [showCamera]);

  // Monitor detection state changes
  useEffect(() => {
    console.log('Detection state changed:', { 
      isDetectionActive, 
      isInitialized, 
      cameraPermission,
      autoSpeak,
      isSpeechEnabled 
    });
  }, [isDetectionActive, isInitialized, cameraPermission, autoSpeak, isSpeechEnabled]);

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
                
                {/* Speech Status */}
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border/30">
                  <div className={`w-2 h-2 rounded-full ${isSpeechEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {isSpeechEnabled ? 'Speech ON' : 'Speech OFF'}
                  </span>
                  {isSpeechEnabled && autoSpeak && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs text-muted-foreground">Auto</span>
                    </div>
                  )}
                </div>
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
                onClick={toggleCameraDisplay}
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
                onClick={() => speakText(currentPhrase)}
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
              onClick={toggleCameraDisplay}
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
                onClick={() => speakText(currentPhrase)}
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
            <div className="bg-white rounded-lg shadow-lg p-2">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="rounded-lg"
                width={320}
                height={240}
                style={{ transform: 'scaleX(-1)' }} // Mirror the video for better UX
              />
              <div className="text-xs text-center text-muted-foreground mt-2">Camera Feed</div>
            </div>
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

        {/* Debug Info
        <div className="max-w-6xl mx-auto mx-6 lg:mx-8 xl:mx-12 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info</h3>
            <div className="text-xs text-yellow-700 space-y-1">
              <div>Speech Enabled: {isSpeechEnabled ? '✅' : '❌'}</div>
              <div>Auto Speak: {autoSpeak ? '✅' : '❌'}</div>
              <div>Detection Active: {isDetectionActive ? '✅' : '❌'}</div>
              <div>Current Gesture: {detectedGesture || 'None'}</div>
              <div>Current Phrase: {currentPhrase || 'None'}</div>
              <div>Gesture Mappings: {JSON.stringify(gestureMapping)}</div>
            </div>
          </div>
        </div> */}

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
                onGestureDetected={(gesture) => {
                  setDetectedGesture(gesture);
                  const phrase = gestureMapping[gesture];
                  if (phrase) {
                    setCurrentPhrase(phrase);
                    if (isSpeechEnabled) {
                      speakText(phrase);
                    }
                  }
                }}
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