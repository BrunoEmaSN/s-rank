import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { BenefitsSection } from "../components/BenefitsSection";
import { TechnologySection } from "../components/TechnologySection";
import { SuccessStories } from "../components/SuccessStories";
import { KeyFeaturesSection } from "../components/KeyFeaturesSection";
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "../components/Footer";
import { getSession } from "@/lib/auth-server";

export default async function Home() {
  const session = await getSession();
  return (
    <div className="min-h-screen bg-primary text-foreground">
      <Header session={session ? { user: session.user } : null} />
      <main>
        <Hero />
        <BenefitsSection />
        <TechnologySection />
        <SuccessStories />
        <KeyFeaturesSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
