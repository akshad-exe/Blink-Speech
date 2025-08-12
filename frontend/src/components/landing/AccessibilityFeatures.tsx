import { Shield, Zap, Users, Settings } from "lucide-react";

const AccessibilityFeatures = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Completely Private",
      description: "All processing happens locally in your browser. No data is ever transmitted or stored remotely unless you choose cloud sync.",
      highlight: "100% Offline Capable"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Blink detection responds in under 150ms. Speech output begins within 1 second of pattern recognition.",
      highlight: "<150ms Response Time"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Designed for Everyone",
      description: "High contrast interface, large accessible buttons, and intuitive gestures make this usable by anyone.",
      highlight: "WCAG 2.1 AA Compliant"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Fully Customizable",
      description: "Map any blink pattern to your most important phrases. Adjust sensitivity and create personalized communication sets.",
      highlight: "Your Patterns, Your Voice"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Built with <span className="bg-gradient-warm bg-clip-text text-transparent">accessibility</span> at heart
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every feature is designed to empower communication for users with diverse abilities and needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-warm transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <div className="text-primary">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccessibilityFeatures;