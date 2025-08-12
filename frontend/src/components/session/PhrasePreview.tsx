import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PhrasePreviewProps {
  currentPhrase: string;
  detectedGesture: string;
}

export const PhrasePreview = ({
  currentPhrase,
  detectedGesture
}: PhrasePreviewProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentPhrase) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [currentPhrase]);

  const handleSpeak = () => {
    if (currentPhrase && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentPhrase);
      speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = async () => {
    if (currentPhrase) {
      try {
        await navigator.clipboard.writeText(currentPhrase);
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: `"${currentPhrase}" copied successfully`
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Unable to copy to clipboard",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-500",
      {
        "ring-2 ring-primary ring-offset-4 shadow-warm": isAnimating,
        "shadow-soft": !isAnimating
      }
    )}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-muted-foreground">
              Current Phrase
            </h2>
            {detectedGesture && (
              <Badge variant="outline" className="text-xs">
                Detected: {detectedGesture.replace('_', ' + ')}
              </Badge>
            )}
          </div>

          <div className={cn(
            "min-h-[120px] flex items-center justify-center transition-all duration-300",
            {
              "animate-fade-in": isAnimating
            }
          )}>
            {currentPhrase ? (
              <p className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                "{currentPhrase}"
              </p>
            ) : (
              <p className="text-xl text-muted-foreground">
                No gesture detected yet
              </p>
            )}
          </div>

          {currentPhrase && (
            <div className="flex items-center justify-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSpeak}
                className="gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Speak Again
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};