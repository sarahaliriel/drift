import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="NEW SYSTEM ACCESS"
      title="Create account"
    >
      <RegisterForm />
    </AuthShell>
  );
}
