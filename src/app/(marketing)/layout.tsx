import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { MotionProvider } from "@/components/motion/MotionProvider";

import "lenis/dist/lenis.css";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <SmoothScroll />
      {children}
    </MotionProvider>
  );
}
