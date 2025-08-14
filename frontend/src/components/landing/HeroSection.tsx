import { Button } from "@/components/ui/button";
import { Eye, Mic, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const handleGetStarted = () => {
    window.location.href = '/calibration';
  };

  return (
    <div className="relative min-h-screen bg-gradient-gentle overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-gentle-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-primary-glow/20 rounded-full blur-3xl animate-gentle-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-medium">
                <Eye className="w-5 h-5" />
                <span>Blink Speech Technology</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Every</span>{" "}
                <span className="bg-gradient-warm bg-clip-text text-transparent">blink</span>{" "}
                <span className="text-foreground">becomes a</span>{" "}
                <span className="bg-gradient-warm bg-clip-text text-transparent">voice</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Transform intentional blink patterns and gaze gestures into spoken phrases. 
                Privacy-first, fully offline, and no installation required.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={handleGetStarted}
              className="group"
            >
                <Eye className="w-6 h-6" />
                Start Your Session
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => {
                  const visionSection = document.getElementById('vision-impact');
                  visionSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Mic className="w-6 h-6" />
                Read More
              </Button>
            </div>

            {/* Key features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center sm:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 mx-auto sm:mx-0">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Detection</h3>
                <p className="text-sm text-muted-foreground">Advanced eye tracking responds instantly to your blinks and gaze</p>
              </div>
              
              <div className="text-center sm:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 mx-auto sm:mx-0">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Natural Voice</h3>
                <p className="text-sm text-muted-foreground">High-quality speech synthesis brings your thoughts to life</p>
              </div>
              
              <div className="text-center sm:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 mx-auto sm:mx-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">Everything runs locally in your browser - your data never leaves</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Assistive communication technology"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-soft flex items-center justify-center animate-gentle-pulse">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full shadow-soft flex items-center justify-center animate-gentle-pulse" style={{ animationDelay: '0.5s' }}>
              <Mic className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;