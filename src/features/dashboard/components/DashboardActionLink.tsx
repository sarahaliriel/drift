import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export function DashboardActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button href={href} size='sm' className='rounded-xl px-5 active:translate-y-px'>
      {children}
    </Button>
  );
}
