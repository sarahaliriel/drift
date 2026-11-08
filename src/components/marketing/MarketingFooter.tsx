import Image from "next/image";

import { FooterNavigation } from "@/components/marketing/FooterNavigation";

export function MarketingFooter() {
  return (
    <footer
      className="marketing-footer overflow-hidden"
      data-navbar-theme="light"
    >
      <div className="container-wide">
        <div className="footer-primary">
          <FooterNavigation />
        </div>

        <div className="footer-meta">
          <p className="footer-copyright">
            © 2026 Drift.{" "}
            <a
              href="https://sarahaliriel.tech"
              target="_blank"
              rel="noreferrer"
              className="footer-credit-link transition-colors focus-visible:outline-none"
            >
              Sarah Aliriel
            </a>
          </p>
          <div className="footer-brand">
            <Image
              src="/logos/drift-logo-v2.png"
              alt="Drift"
              width={2000}
              height={2000}
              sizes="(min-width: 768px) 26rem, 16rem"
              className="footer-brand-image"
            />
          </div>
          <p className="footer-opensource">Open source</p>
        </div>
      </div>
    </footer>
  );
}
