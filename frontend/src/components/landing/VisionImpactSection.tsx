import { Heart, Globe, Users, Zap, Eye, MessageCircle, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const VisionImpactSection = () => {
  const impactAreas = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Healthcare Patients",
      description: "ICU patients who cannot speak due to intubation, post-surgery recovery, locked-in syndrome, and emergency communication",
      features: [
        "ICU patients who cannot speak due to intubation",
        "Post-surgery recovery when vocal communication is difficult",
        "Individuals with locked-in syndrome or severe paralysis",
        "Emergency communication when traditional methods fail"
      ],
      color: "bg-red-50 border-red-200"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "People with Disabilities",
      description: "ALS patients, muscular dystrophy, cerebral palsy, stroke survivors, and motor impairments",
      features: [
        "ALS (Lou Gehrig's disease) patients as speech deteriorates",
        "Individuals with muscular dystrophy or cerebral palsy",
        "Stroke survivors during speech therapy recovery",
        "Anyone with motor impairments affecting traditional communication"
      ],
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Temporary Conditions",
      description: "Recovery from surgery, laryngitis, medication side effects, and fatigue-related difficulties",
      features: [
        "Recovery from oral or throat surgery",
        "Severe laryngitis or vocal cord issues",
        "Medication side effects affecting speech",
        "Fatigue-related communication difficulties"
      ],
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Accessibility",
      description: "Works in any language, no specialized hardware, runs on existing devices, free and open-source",
      features: [
        "Works in any language or cultural context",
        "No specialized hardware or expensive equipment required",
        "Runs on existing devices (computers, tablets, phones)",
        "Free and open-source for maximum accessibility"
      ],
      color: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <section id="vision-impact" className="py-20 bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-6">
        {/* Vision Statement */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Eye className="w-4 h-4" />
            Our Mission
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Everyone Deserves a</span>{" "}
            <span className="bg-gradient-warm bg-clip-text text-transparent">Voice</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Blink Speech was born from a simple yet powerful belief:{" "}
            <strong className="text-foreground">communication is a fundamental human right</strong>. 
            By transforming natural eye movements into spoken words, we're breaking down barriers 
            that prevent people from expressing their thoughts, needs, and emotions.
          </p>
        </div>

        {/* Impact Areas Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {impactAreas.map((area, index) => (
            <div 
              key={index}
              className={`${area.color} border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-warm transition-shadow">
                  <div className="text-primary">
                    {area.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{area.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-3">
                {area.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="bg-card rounded-2xl p-8 shadow-soft mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Our Impact</h3>
            <p className="text-muted-foreground">
              Breaking down communication barriers worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Privacy Protected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">&lt;150ms</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">0</div>
              <div className="text-sm text-muted-foreground">Installation Required</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Languages Supported</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-warm rounded-2xl p-8 text-white">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Make a Difference?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join us in making communication accessible to everyone. 
                Try Blink Speech today and experience the power of eye-based communication.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Try Demo
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionImpactSection; 