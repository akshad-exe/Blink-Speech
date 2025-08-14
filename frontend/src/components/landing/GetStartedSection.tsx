import { Button } from "@/components/ui/button";
import { Eye, Camera, MessageSquare, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GetStartedSection = () => {
  const navigate = useNavigate();
  const steps = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Grant Camera Access",
      description: "Allow your browser to access your webcam for eye tracking"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Quick Calibration",
      description: "Look at 5 points on screen to calibrate your gaze direction"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Start Communicating",
      description: "Use blink patterns to speak your thoughts instantly"
    }
  ];

  const handleStartSession = () => {
    navigate('/calibration');
  };

  return (
    <section className="py-20 bg-gradient-gentle">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to <span className="bg-gradient-warm bg-clip-text text-transparent">find your voice</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Get started in less than 2 minutes. No account required, no installation needed.
          </p>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-warm transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <div className="text-primary">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={handleStartSession}
              className="group"
            >
              <Eye className="w-6 h-6" />
              Start Free Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              "One blink, one phrase, endless connection."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;