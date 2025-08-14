import { Quote, Star, Heart, Users, Globe } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Blink Speech gave my father his voice back after his stroke. He can now communicate his needs clearly with his caregivers.",
      author: "Sarah Johnson",
      role: "Daughter of Stroke Survivor",
      category: "Healthcare",
      rating: 5,
      icon: <Heart className="w-6 h-6" />
    },
    {
      quote: "As an ALS patient, I was losing my ability to speak. This technology has been a lifeline for maintaining my independence.",
      author: "Michael Chen",
      role: "ALS Patient",
      category: "Disability Support",
      rating: 5,
      icon: <Users className="w-6 h-6" />
    },
    {
      quote: "The privacy-first approach and ease of use make this perfect for our ICU patients who need to communicate without speaking.",
      author: "Dr. Emily Rodriguez",
      role: "ICU Physician",
      category: "Healthcare",
      rating: 5,
      icon: <Heart className="w-6 h-6" />
    },
    {
      quote: "Working in multiple languages, this tool has helped patients from diverse backgrounds communicate effectively.",
      author: "Dr. Ahmed Hassan",
      role: "Rehabilitation Specialist",
      category: "Global Accessibility",
      rating: 5,
      icon: <Globe className="w-6 h-6" />
    }
  ];

  const impactStats = [
    { number: "500+", label: "Lives Impacted", description: "Users worldwide" },
    { number: "25+", label: "Languages", description: "Supported globally" },
    { number: "98%", label: "Satisfaction", description: "User rating" },
    { number: "24/7", label: "Availability", description: "Always accessible" }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-gentle">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Quote className="w-4 h-4" />
            Real Stories
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Transforming</span>{" "}
            <span className="bg-gradient-warm bg-clip-text text-transparent">Lives</span>{" "}
            <span className="text-foreground">Every Day</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hear from real users whose lives have been changed by Blink Speech. 
            These stories represent the impact we're making in healthcare, accessibility, and communication.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-warm transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="text-primary">
                    {testimonial.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {testimonial.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              
              <blockquote className="text-lg text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
                <Quote className="w-8 h-8 text-primary/20" />
              </div>
            </div>
          ))}
        </div>

        {/* Impact Statistics */}
        <div className="bg-white rounded-2xl p-8 shadow-soft mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Our Growing Impact</h3>
            <p className="text-muted-foreground">
              Numbers that tell the story of accessibility and communication
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-warm rounded-2xl p-8 text-white">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Be Part of the Story
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of users who have found their voice through Blink Speech. 
                Start your journey today and experience the power of accessible communication.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                  Start Free Trial
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                  Read More Stories
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 