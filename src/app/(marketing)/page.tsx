import { Hero } from "@/features/marketing/components/Hero";
import { MarketingFooter } from "@/features/marketing/components/MarketingFooter";
import { MarketingHeader } from "@/features/marketing/components/MarketingHeader";
import { FinalCTA } from "@/features/marketing/components/FinalCTA";
import { FAQ } from "@/features/marketing/components/FAQ";
import { SolutionsSection } from "@/features/marketing/components/SolutionsSection";
import { OpenSource } from "@/features/marketing/components/OpenSource";
import { ProductHowItWorksSection } from "@/features/marketing/components/ProductHowItWorksSection";
import { DeferredShapeWaves } from "@/features/marketing/components/DeferredShapeWaves";

export default function HomePage() {
  return (
    <>
      <MarketingHeader />
      <main>
        <Hero />
        <ProductHowItWorksSection />
        <SolutionsSection />
        <div className='dark-surface' data-navbar-theme='dark'>
          <OpenSource />
          <FAQ />
        </div>
      </main>
      <div className='closing-scene'>
        <div className='closing-scene-waves' aria-hidden='true'>
          <DeferredShapeWaves
            text='</>'
            fontFamily='var(--font-sans), Geist, "Geist Sans", system-ui, sans-serif'
            fontWeight={500}
            textSize={0.59}
            shapes='mixed'
            cellSize={8}
            dotSize={0.81}
            color='#7b00d5'
            hoverColor='#c8f426'
            backgroundColor='#fdfffb'
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
    </>
  );
}
