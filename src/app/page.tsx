import { Hero } from "@/components/marketing/Hero";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { FAQ } from "@/components/marketing/FAQ";
import { LandingTheme } from "@/components/marketing/LandingTheme";
import { Intro } from "@/components/intro/Intro";
import { ProductSection } from "@/components/marketing/ProductSection";
import { SolutionsSection } from "@/components/marketing/SolutionsSection";

export default function HomePage() {
  return (
    <>
      <Intro />
      <LandingTheme>
        <MarketingHeader />
        <main>
          <Hero />
          <ProductSection />
          <SolutionsSection />
          <FAQ />
          <FinalCTA />
        </main>
        <MarketingFooter />
      </LandingTheme>
    </>
  );
}
