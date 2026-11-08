import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section
      className="final-cta"
      aria-labelledby="final-cta-title"
      data-navbar-theme="light"
    >
      <div className="final-cta-shell">
        <div className="final-cta-copy">
          <h2 id="final-cta-title">
            See what&apos;s <span>drifting.</span>
          </h2>
          <p>
            <span>Your interface changes. Your system should keep up.</span>
            <span>Find inconsistencies before they become the new normal.</span>
          </p>
          <div className="final-cta-actions">
            <Button
              href="/cadastro"
              size="lg"
              className="rounded-xl px-6 active:translate-y-px"
            >
              Scan project
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              href="/docs"
              variant="ghost"
              size="lg"
              className="px-6"
            >
              View docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
