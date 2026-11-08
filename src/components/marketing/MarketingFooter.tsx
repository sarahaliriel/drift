import Image from "next/image";

import { FooterNavigation } from "@/components/marketing/FooterNavigation";

export function MarketingFooter() {
  return (
    <footer
      className="marketing-footer overflow-hidden"
      data-navbar-theme="dark"
    >
      <div className="container-wide">
        <div className="footer-divider h-px bg-secondary-foreground/20" />

        <div
          className={[
            "footer-primary grid gap-10 py-10",
            "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start md:gap-12 md:py-12",
            "lg:grid-cols-[minmax(19rem,0.8fr)_minmax(0,1.2fr)] lg:gap-20",
          ].join(" ")}
        >
          <div className="footer-enter flex w-full justify-center md:justify-start md:pt-4">
            <div className="h-32 overflow-hidden md:h-36">
              <Image
                src="/logos/drift-logo-v2.png"
                alt="Drift"
                width={2000}
                height={2000}
                sizes="(min-width: 1024px) 21rem, (min-width: 768px) 18rem, 15rem"
                className="-mt-16 h-auto w-60 md:-mt-20 md:w-72 lg:-mt-24 lg:w-80"
              />
            </div>
          </div>
          <div className="w-full">
            <FooterNavigation />
          </div>
        </div>

        <div className="footer-divider h-px origin-left bg-secondary-foreground/20" />

        <div className="flex flex-col gap-2 py-4 text-xs leading-5 text-secondary-foreground/65 sm:flex-row sm:items-center sm:justify-between md:py-5">
          <p>
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
          <p className="text-secondary-foreground/65">Open source</p>
        </div>
      </div>
    </footer>
  );
}
