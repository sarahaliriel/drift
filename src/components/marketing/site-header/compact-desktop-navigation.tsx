import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { LinkButton } from "@/components/ui/Button";
import { marketingNavigation } from "@/config/marketing-navigation";
import type { ReactNode } from "react";

type CompactDesktopNavigationProps = {
  currentPath: string;
  cta?: ReactNode;
};

export function CompactDesktopNavigation({
  currentPath,
  cta,
}: CompactDesktopNavigationProps) {
  return (
    <>
      <nav
        className="flex items-center gap-4 xl:gap-6"
        aria-label="Navegação principal"
      >
        {marketingNavigation.map((item) => (
          <AnimatedLink
            key={item.label}
            href={item.href}
            aria-current={currentPath === item.href ? "page" : undefined}
            className="whitespace-nowrap text-[0.9rem] font-medium text-foreground/75 aria-[current=page]:text-brand-green"
          >
            {item.label}
          </AnimatedLink>
        ))}
      </nav>

      {cta ?? (
        <LinkButton
          href="/cadastro"
          size="sm"
          className="shrink-0 rounded-xl px-4 active:translate-y-px"
        >
          Get started
        </LinkButton>
      )}
    </>
  );
}
