import HeroSection from "@/components/landing/HeroSection";
import AccessibilityFeatures from "@/components/landing/AccessibilityFeatures";
import GetStartedSection from "@/components/landing/GetStartedSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AccessibilityFeatures />
      <GetStartedSection />
    </div>
  );
};

export default Index;
