import { Hero } from "@/components/marketing/Hero";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { FAQ } from "@/components/marketing/FAQ";
import { LandingTheme } from "@/components/marketing/LandingTheme";
import { Intro } from "@/components/intro/Intro";
import ShapeWaves from "@/components/marketing/ShapeWaves";
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
        </main>
        <div className="closing-scene">
          <div className="closing-scene-waves" aria-hidden="true">
            <ShapeWaves
              text="</>"
              fontFamily='var(--font-sans), Geist, "Geist Sans", system-ui, sans-serif'
              fontWeight={500}
              textSize={0.59}
              shapes="mixed"
              cellSize={8}
              dotSize={0.81}
              color="#7b00d5"
              hoverColor="#c8f426"
              backgroundColor="#fdfffb"
              speed={0.4}
              scale={1}
              contrast={1.4}
              brightness={0.4}
              flow={0}
              direction={0}
              fade={0.25}
              interactive
              splashRadius={40}
              splashStrength={0.4}
              glow={0.35}
              intro
              introDuration={1.6}
            />
          </div>
          <FinalCTA />
          <MarketingFooter />
        </div>
      </LandingTheme>
    </>
  );
}
