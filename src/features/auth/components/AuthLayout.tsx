import type { ReactNode } from "react";

import { AuthNavbar } from "@/features/auth/components/AuthNavbar";
import ShapeWaves from "@/components/motion/ShapeWaves";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className='auth-layout'>
      <div className='auth-waves' aria-hidden='true'>
        <ShapeWaves
          text=''
          fontFamily='var(--font-sans), Geist, "Geist Sans", system-ui, sans-serif'
          fontWeight={500}
          textSize={0.59}
          shapes='mixed'
          cellSize={8}
          dotSize={0.81}
          color='#c8f426'
          hoverColor='#7b00d5'
          backgroundColor='#000000'
          speed={0.4}
          scale={1}
          contrast={1.4}
          brightness={0.4}
          flow={0}
          direction={0}
          fade={0.25}
          interactive
          splashRadius={40}
          splashStrength={0.9}
          glow={0.35}
          intro
          introDuration={1.6}
        />
      </div>
      <AuthNavbar />
      {children}
    </main>
  );
}
