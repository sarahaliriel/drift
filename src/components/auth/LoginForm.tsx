"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginFormData } from "@/features/auth/schemas/auth-form-schema";

export function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit() {
    // Prototype-only login: keep visual validation/loading, then navigate without creating auth state.
    await new Promise((resolve) => setTimeout(resolve, 650));
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FormField label="E-mail" htmlFor="login-email" error={errors.email?.message}>
        <Input id="login-email" {...register("email")} type="email" autoComplete="email" placeholder="voce@exemplo.com" aria-invalid={Boolean(errors.email)} />
      </FormField>
      <FormField label="Senha" htmlFor="login-password" error={errors.password?.message} action={<Link href="/recuperar-senha" className="text-xs font-semibold text-brand-hover hover:underline">Esqueci minha senha</Link>}>
        <PasswordField id="login-password" {...register("password")} autoComplete="current-password" placeholder="Sua senha" aria-invalid={Boolean(errors.password)} />
      </FormField>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <><LoaderCircle className="size-4 animate-spin" /> Entrando...</> : <>Entrar na minha conta <ArrowRight className="size-4" /></>}
      </Button>
      <p className="text-center text-sm text-muted">Ainda não tem uma conta? <Link href="/cadastro" className="font-bold text-brand-hover hover:underline">Criar grátis</Link></p>
    </form>
  );
}

function FormField({ label, htmlFor, error, action, children }: { label: string; htmlFor: string; error?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between"><label htmlFor={htmlFor} className="text-xs font-bold">{label}</label>{action}</div>
      {children}
      {error && <p className="mt-1.5 text-xs text-[#bb3f3f]" role="alert">{error}</p>}
    </div>
  );
}
