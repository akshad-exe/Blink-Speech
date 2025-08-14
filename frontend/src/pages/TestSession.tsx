import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSimpleBlinkDetection } from '@/hooks/useSimpleBlinkDetection';
import { Mic, MicOff, Eye, EyeOff, Play, Square } from 'lucide-react';

const TestSession = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [detectedPattern, setDetectedPattern] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState('');

  const gestureMapping = {
    "singleBlink": "Hello",
    "doubleBlink": "Yes",
    "tripleBlink": "No",
    "longBlink": "Thank you"
  };

  const { 
    videoRef, 
    isInitialized, 
    isDetecting,
    startCamera,
    stopCamera,
    testDetection
  } = useSimpleBlinkDetection({
    isActive,
    mapping: gestureMapping,
    onBlinkDetected: (pattern, phrase) => {
      console.log(`Pattern detected: ${pattern} -> ${phrase}`);
      setDetectedPattern(pattern);
      setCurrentPhrase(phrase);
      if (isSpeechEnabled && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        speechSynthesis.speak(utterance);
      }
    },
    blinkThreshold: 0.18  // More sensitive threshold
  });


  useEffect(() => {
    // Start camera when component mounts
    if (isInitialized) {
      startCamera().then(success => {
        if (success) {
          console.log('📷 Camera started successfully');
        } else {
          console.error('❌ Failed to start camera');
        }
      });
    }
  }, [isInitialized]);

  const handleStartStop = () => {
    if (isActive) {
      setIsActive(false);
      console.log('⏹️ Detection stopped');
    } else {
      setIsActive(true);
      console.log('▶️ Detection started');
      setDetectedPattern('');
      setCurrentPhrase('');
    }
  };

  const testSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('Testing speech synthesis');
      speechSynthesis.speak(utterance);
      console.log('🔊 Testing speech');
    }
  };

  const manualTrigger = (pattern: string) => {
    const phrase = gestureMapping[pattern as keyof typeof gestureMapping];
    if (phrase) {
      setDetectedPattern(pattern);
      setCurrentPhrase(phrase);
      console.log(`🎯 Manual: ${pattern} → "${phrase}"`);
      
      if (isSpeechEnabled && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Blink Detection Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Camera Feed</span>
                <div className="flex gap-2">
                  <Badge variant={isInitialized ? "default" : "secondary"}>
                    {isInitialized ? "Model Ready" : "Loading..."}
                  </Badge>
                  <Badge variant={isDetecting ? "default" : "secondary"}>
                    {isDetecting ? "Detecting" : "Idle"}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full rounded-lg bg-black"
                  style={{ maxHeight: '400px' }}
                />
                {isActive && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                    Detection Active
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleStartStop}
                  disabled={!isInitialized}
                  className="w-full"
                  variant={isActive ? "destructive" : "default"}
                >
                  {isActive ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Stop Detection
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Detection
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                  variant="outline"
                  className="w-full"
                >
                  {isSpeechEnabled ? (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Speech On
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Speech Off
                    </>
                  )}
                </Button>

                <Button
                  onClick={testDetection}
                  variant="outline"
                  className="w-full"
                  disabled={!isInitialized}
                >
                  Test Detection
                </Button>

                <Button
                  onClick={testSpeech}
                  variant="outline"
                  className="w-full"
                >
                  Test Speech
                </Button>
              </CardContent>
            </Card>

            {/* Current Detection */}
            <Card>
              <CardHeader>
                <CardTitle>Current Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentPhrase || "No gesture detected"}
                  </div>
                  {detectedPattern && (
                    <Badge variant="secondary">
                      {detectedPattern}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Manual Triggers */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Test</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {Object.entries(gestureMapping).map(([pattern, phrase]) => (
                  <Button
                    key={pattern}
                    onClick={() => manualTrigger(pattern)}
                    variant="outline"
                    size="sm"
                  >
                    {phrase}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Patterns Guide */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Blink Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="font-semibold">Single Blink</div>
                <div className="text-sm text-gray-600">Says "Hello"</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Eye className="w-8 h-8 text-green-600" />
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
                <div className="font-semibold">Double Blink</div>
                <div className="text-sm text-gray-600">Says "Yes"</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Eye className="w-6 h-6 text-purple-600" />
                  <Eye className="w-6 h-6 text-purple-600" />
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <div className="font-semibold">Triple Blink</div>
                <div className="text-sm text-gray-600">Says "No"</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <EyeOff className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="font-semibold">Long Blink</div>
                <div className="text-sm text-gray-600">Says "Thank you"</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default TestSession;
