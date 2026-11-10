import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell eyebrow='NEW SYSTEM ACCESS' title='Create account'>
      <RegisterForm />
    </AuthShell>
  );
}
