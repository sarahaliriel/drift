import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { LinkButton } from "@/components/ui/Button";
import { marketingNavigation } from "@/config/marketing-navigation";
import { ResourcesMenu } from "@/components/marketing/site-header/resources-menu";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type DesktopNavigationProps = {
  currentPath: string;
  isCompact?: boolean;
};

export function DesktopNavigation({ currentPath, isCompact = false }: DesktopNavigationProps) {
  return (
    <div className={isCompact ? "flex h-full w-full items-center justify-center gap-5" : "grid h-full w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center"}>
      {!isCompact && <Link href="/" className="shrink-0" aria-label="Drift">
        <Image
          src="/logos/drift-logo-v1.png"
          alt="Drift"
          width={48}
          height={48}
          priority
        />
      </Link>}

      <nav
        className={isCompact ? "flex items-center gap-4" : "flex items-center gap-7 xl:gap-10"}
        aria-label="Navegação principal"
      >
        {marketingNavigation.slice(0, 2).map((item) => (
          <AnimatedLink
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            aria-current={currentPath === item.href ? "page" : undefined}
            className="whitespace-nowrap text-[0.94rem] font-medium text-foreground/75 aria-[current=page]:text-accent"
          >
            {item.label}
          </AnimatedLink>
        ))}
        <ResourcesMenu />
        {marketingNavigation.slice(2).map((item) => (
          <AnimatedLink
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            aria-current={currentPath === item.href ? "page" : undefined}
            className="whitespace-nowrap text-[0.94rem] font-medium text-foreground/75 aria-[current=page]:text-accent"
          >
            {item.label}
          </AnimatedLink>
        ))}
      </nav>

      <div className="flex items-center justify-self-end gap-3">
        {!isCompact && <LinkButton href="/login" variant="ghost" size="sm" className="px-5">
          Sign in
        </LinkButton>}
        <LinkButton
          href="/cadastro"
          size="sm"
          className={isCompact ? "rounded-xl px-3 active:translate-y-px" : "rounded-xl px-5 active:translate-y-px"}
        >
          Scan project <ArrowRight className="size-4" aria-hidden="true" />
        </LinkButton>
      </div>
    </div>
  );
}
