import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow='ACCOUNT RECOVERY'
      title='Reset your password'
      description='Enter your email and we’ll send you a reset link.'
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
