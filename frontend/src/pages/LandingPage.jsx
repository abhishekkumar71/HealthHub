import HeroSection from "../components/HeroComponent";
import FeaturesSection from "../components/FeatureSection";
import AboutSection from "../components/AboutSection";
import PopularSessions from "../components/PopularSection";

export default function LandingPage({ user, setAuthOpen, setAuthMode }) {
  return (
    <>
      <HeroSection user={user} setAuthOpen={setAuthOpen} setAuthMode={setAuthMode}/>
      <FeaturesSection />
      <AboutSection />
      <PopularSessions />
    </>
  );
}
