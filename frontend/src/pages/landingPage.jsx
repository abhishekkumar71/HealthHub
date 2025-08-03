import HeroSection from "../components/HeroComponent";
import FeaturesSection from "../components/FeatureSection";
import AboutSection from "../components/AboutSection";
import PopularSessions from "../components/PopularSection"; 

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <PopularSessions />
    </>
  );
}
