import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DebugPanelProps {
  isActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  onManualTrigger: (pattern: string) => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ isActive, videoRef, onManualTrigger }) => {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    // Intercept console.log for debugging
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog.apply(console, args);
      const logEntry = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      if (logEntry.includes('EAR') || logEntry.includes('BLINK') || logEntry.includes('PATTERN')) {
        setLogs(prev => [
          `${new Date().toLocaleTimeString()}: ${logEntry}`,
          ...prev.slice(0, 19) // Keep last 20 logs
        ]);
      }
    };
    
    return () => {
      console.log = originalLog;
    };
  }, []);
  
  const testSpeech = (phrase: string) => {
    try {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 1.0;
        utterance.volume = 1.0;
        speechSynthesis.speak(utterance);
        console.log('🎤 Test speech triggered:', phrase);
      }
    } catch (error) {
      console.error('Speech test failed:', error);
    }
  };
  
  return (
    <Card className="fixed bottom-4 left-4 w-96 max-h-80 z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={() => onManualTrigger('singleBlink')}>
            Test Single
          </Button>
          <Button size="sm" onClick={() => onManualTrigger('doubleBlink')}>
            Test Double
          </Button>
          <Button size="sm" onClick={() => testSpeech('Hello World')}>
            Test Speech
          </Button>
        </div>
        
        <div className="text-xs space-y-1">
          <div>Status: {isActive ? '🟢 Active' : '🔴 Inactive'}</div>
          <div>Video Ready: {videoRef.current?.readyState === 4 ? '✅' : '❌'}</div>
          <div>Video Size: {videoRef.current?.videoWidth}x{videoRef.current?.videoHeight}</div>
        </div>
        
        <div className="max-h-32 overflow-y-auto text-xs font-mono bg-gray-100 p-2 rounded">
          {logs.length === 0 ? 'No logs yet...' : logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setLogs([])}
          className="w-full"
        >
          Clear Logs
        </Button>
      </CardContent>
    </Card>
  );
};
