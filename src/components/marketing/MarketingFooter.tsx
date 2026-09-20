import { ArrowRight } from "lucide-react";

import { FooterNavigation } from "@/components/marketing/FooterNavigation";
import { LinkButton } from "@/components/ui/Button";

export function MarketingFooter() {
  return (
    <footer className="marketing-footer overflow-hidden text-white">
      <div className="container-wide">
        <div className="footer-primary grid gap-8 pt-12 pb-10 md:gap-16 md:pt-28 md:pb-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-20 lg:pt-36 lg:pb-24 xl:grid-cols-[minmax(0,1.35fr)_minmax(37rem,1fr)]">
          <div className="footer-enter">
            <h2 className="max-w-3xl font-(family-name:--font-display) text-[clamp(2.25rem,10.5vw,2.65rem)] leading-[0.98] font-semibold tracking-[-0.06em] text-balance md:text-[clamp(2.65rem,5vw,5.6rem)]">
              Keep your implementation <span className="text-brand">consistent</span>.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70 md:mt-7 md:text-lg">
              Drift is an open-source work in progress.
            </p>
            <LinkButton
              href="/cadastro"
              size="lg"
              className="footer-cta mt-5 w-full min-w-0 justify-between px-5 sm:w-auto sm:min-w-72 md:mt-9"
            >
              Get started
              <ArrowRight className="footer-cta-arrow size-4" aria-hidden="true" />
            </LinkButton>
          </div>

          <FooterNavigation />
        </div>

        <div className="footer-divider h-px origin-left bg-white/15" />

        <div className="grid gap-1.5 py-4 text-xs leading-5 text-white/60 md:grid-cols-3 md:items-center md:gap-3 md:py-7">
          <p>© 2026 Drift.</p>
          <p className="md:text-center">Open-source design system consistency tooling.</p>
        </div>

        <p
          className="footer-wordmark hidden select-none text-center font-(family-name:--font-display) font-semibold tracking-[-0.04em] md:block"
          aria-hidden="true"
        >
          DRIFT
        </p>
      </div>
    </footer>
  );
}
