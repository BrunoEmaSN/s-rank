import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { Hero } from "../components/Hero";
import { BenefitsSection } from "../components/BenefitsSection";
import { TechnologySection } from "../components/TechnologySection";
import { SuccessStories } from "../components/SuccessStories";
import { KeyFeaturesSection } from "../components/KeyFeaturesSection";
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "@/components/Footer";

export default async function Home() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

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
