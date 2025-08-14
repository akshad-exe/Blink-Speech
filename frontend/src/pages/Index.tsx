import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import AccessibilityFeatures from "@/components/landing/AccessibilityFeatures";
import VisionImpactSection from "@/components/landing/VisionImpactSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import GetStartedSection from "@/components/landing/GetStartedSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AccessibilityFeatures />
      <VisionImpactSection />
      <HowItWorksSection />
      {/* <TestimonialsSection /> */}
      <GetStartedSection />
      <Footer />
    </div>
  );
};

export default Index;
