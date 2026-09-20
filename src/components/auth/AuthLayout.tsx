import type { ReactNode } from "react";

import { AuthNavbar } from "@/components/auth/AuthNavbar";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="auth-layout">
      <AuthNavbar />
      {children}
    </main>
  );
}
