import { Hero } from "@/components/marketing/Hero";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";

export default function HomePage() {
  return (
    <>
      <MarketingHeader />
      <main>
        <Hero />
      </main>
      <MarketingFooter />
    </>
  );
}
