import { Hero } from "../components/Hero";
import { BenefitsSection } from "../components/BenefitsSection";
import { TechnologySection } from "../components/TechnologySection";
import { SuccessStories } from "../components/SuccessStories";
import { KeyFeaturesSection } from "../components/KeyFeaturesSection";
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <BenefitsSection />
      <TechnologySection />
      <SuccessStories />
      <KeyFeaturesSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
