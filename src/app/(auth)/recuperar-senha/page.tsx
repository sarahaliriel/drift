import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function ForgotPasswordPage() {
  return <AuthShell title="Recover your access." description="This form is currently a visual prototype."><ForgotPasswordForm /></AuthShell>;
}
