import { Eye, Camera, Brain, Mic, Shield, Zap, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Eye Tracking",
      description: "Advanced computer vision powered by MediaPipe and WebGazer.js detects your eye movements in real-time",
      details: [
        "Blink patterns: Single, double, triple, and long blinks",
        "Gaze directions: Left, right, up, down, and center",
        "Combined gestures: 20+ unique combinations"
      ],
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Real-time Processing",
      description: "Machine learning algorithms process your gestures with lightning-fast response times",
      details: [
        "<150ms detection latency for instant response",
        "Eye Aspect Ratio (EAR) for accurate blink detection",
        "Adaptive thresholds for optimal performance",
        "15-30 FPS processing for smooth operation"
      ],
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Speech Synthesis",
      description: "High-quality text-to-speech brings your thoughts to life using the Web Speech API",
      details: [
        "Natural-sounding voices in any language",
        "Customizable voice settings (rate, pitch, volume)",
        "<1s speech latency from gesture to spoken word",
        "Multi-language support for global accessibility"
      ],
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy Protection",
      description: "100% local processing ensures your data never leaves your device",
      details: [
        "No video data transmitted or stored remotely",
        "HTTPS encryption for secure communication",
        "Anonymous usage with no personal information required",
        "Local storage for secure settings management"
      ],
      color: "bg-red-50 border-red-200"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Technology
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            How <span className="bg-gradient-warm bg-clip-text text-transparent">Blink Speech</span> Works
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our revolutionary technology combines advanced computer vision, machine learning, 
            and speech synthesis to transform eye movements into spoken communication.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`${step.color} border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-warm transition-shadow">
                    <div className="text-primary">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-white rounded-full shadow-soft flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-gentle rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Powered by Cutting-Edge Technology</h3>
            <p className="text-muted-foreground">
              Built with modern web technologies for maximum accessibility and performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "MediaPipe", desc: "Facial Landmarks" },
              { name: "WebGazer.js", desc: "Eye Tracking" },
              { name: "TensorFlow.js", desc: "ML Processing" },
              { name: "Web Speech API", desc: "Voice Synthesis" },
              { name: "React 18", desc: "Modern UI" },
              { name: "TypeScript", desc: "Type Safety" }
            ].map((tech, index) => (
              <div key={index} className="bg-white rounded-xl p-4 text-center shadow-soft hover:shadow-warm transition-shadow">
                <div className="text-lg font-semibold text-primary mb-1">{tech.name}</div>
                <div className="text-xs text-muted-foreground">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">&lt;150ms</div>
            <div className="text-lg font-semibold mb-2">Detection Latency</div>
            <div className="text-sm text-muted-foreground">
              Near-instantaneous gesture recognition for natural communication
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-10 h-10 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">&gt;95%</div>
            <div className="text-lg font-semibold mb-2">Detection Accuracy</div>
            <div className="text-sm text-muted-foreground">
              High precision in optimal conditions with adaptive calibration
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-lg font-semibold mb-2">Privacy Protected</div>
            <div className="text-sm text-muted-foreground">
              Complete local processing with no data transmission
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 