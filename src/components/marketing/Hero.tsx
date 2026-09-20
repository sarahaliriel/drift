import { ArrowRight } from "lucide-react";

import { LinkButton } from "@/components/ui/Button";

export function Hero() {
  return (
    <section id="overview" className="bg-white">
      <div className="container-shell py-20 sm:py-28">
        <div className="max-w-3xl">
          <h1 className="hero-title marketing-enter marketing-enter-title font-(family-name:--font-display) text-[clamp(2.65rem,5.2vw,5.8rem)] leading-[0.95] font-bold tracking-[-0.055em]">
            Design-system consistency, made <span className="text-brand">visible</span>.
          </h1>

          <p className="hero-description marketing-enter marketing-enter-copy mt-7 max-w-152.5 text-[clamp(1.05rem,1.4vw,1.3rem)] leading-[1.55] text-muted min-[900px]:mt-8">
            Drift helps teams inspect frontend implementations against their design system.
          </p>

          <div className="hero-actions marketing-enter marketing-enter-actions mt-8 flex flex-col gap-3 sm:flex-row min-[900px]:mt-10">
            <LinkButton href="/cadastro" size="lg">
              Get started <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
          </div>

        </div>
      </div>
    </section>
  );
}
