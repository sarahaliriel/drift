import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return <AuthShell title="Create your account." description="Drift authentication is currently a visual prototype."><RegisterForm /></AuthShell>;
}
