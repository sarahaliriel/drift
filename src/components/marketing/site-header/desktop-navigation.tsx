import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { LinkButton } from "@/components/ui/Button";
import { marketingNavigation } from "@/config/marketing-navigation";
import Link from "next/link";

type DesktopNavigationProps = {
  currentPath: string;
};

export function DesktopNavigation({ currentPath }: DesktopNavigationProps) {
  return (
    <div className="flex h-full w-full items-center justify-between">
      <Link href="/" className="shrink-0 text-xl font-semibold tracking-tight">Drift</Link>

      <nav
        className="flex items-center gap-7 xl:gap-10"
        aria-label="Navegação principal"
      >
        {marketingNavigation.map((item) => (
          <AnimatedLink
            key={item.label}
            href={item.href}
            aria-current={currentPath === item.href ? "page" : undefined}
            className="whitespace-nowrap text-[0.94rem] font-medium text-foreground/75 aria-[current=page]:text-brand-green"
          >
            {item.label}
          </AnimatedLink>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <LinkButton href="/login" variant="ghost" size="sm" className="px-5">
          Sign in
        </LinkButton>
        <LinkButton
          href="/cadastro"
          size="sm"
          className="rounded-xl px-5 active:translate-y-px"
        >
          Get started
        </LinkButton>
      </div>
    </div>
  );
}
