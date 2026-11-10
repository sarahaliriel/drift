import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell eyebrow='SYSTEM ACCESS' title='Log in to continue'>
      <LoginForm />
    </AuthShell>
  );
}
