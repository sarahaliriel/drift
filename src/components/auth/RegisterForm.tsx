"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerSchema, type RegisterFormData } from "@/features/auth/schemas/auth-form-schema";

export function RegisterForm() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 650));
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-brand/20 bg-brand-soft/60 p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto size-8 text-brand-hover" />
        <p className="mt-3 font-bold">Sua demonstração está pronta.</p>
        <p className="mt-2 text-sm text-muted">O cadastro foi apenas simulado e nenhum dado foi enviado.</p>
        <Link href="/dashboard" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-hover">Conhecer a dashboard <ArrowRight className="size-4" /></Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label="Seu nome" htmlFor="register-name" error={errors.name?.message}><Input id="register-name" {...register("name")} autoComplete="name" placeholder="Como podemos chamar você?" aria-invalid={Boolean(errors.name)} /></Field>
      <Field label="E-mail" htmlFor="register-email" error={errors.email?.message}><Input id="register-email" {...register("email")} type="email" autoComplete="email" placeholder="voce@exemplo.com" aria-invalid={Boolean(errors.email)} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Crie uma senha" htmlFor="register-password" error={errors.password?.message}><PasswordField id="register-password" {...register("password")} autoComplete="new-password" placeholder="8+ caracteres" aria-invalid={Boolean(errors.password)} /></Field>
        <Field label="Confirme a senha" htmlFor="register-confirm-password" error={errors.confirmPassword?.message}><PasswordField id="register-confirm-password" {...register("confirmPassword")} autoComplete="new-password" placeholder="Repita a senha" aria-invalid={Boolean(errors.confirmPassword)} /></Field>
      </div>
      <div>
        <label className="flex items-start gap-3 text-xs leading-5 text-muted">
          <input type="checkbox" {...register("terms")} className="mt-0.5 size-4 rounded accent-[#477d18]" />
          <span>I agree to continue with this prototype.</span>
        </label>
        {errors.terms?.message && <p className="mt-1.5 text-xs text-[#bb3f3f]" role="alert">{errors.terms.message}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <><LoaderCircle className="size-4 animate-spin" /> Creating...</> : <>Create account <ArrowRight className="size-4" /></>}
      </Button>
      <p className="text-center text-sm text-muted">Já tem uma conta? <Link href="/login" className="font-bold text-brand-hover hover:underline">Entrar</Link></p>
    </form>
  );
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return <div><label htmlFor={htmlFor} className="mb-2 block text-xs font-bold">{label}</label>{children}{error && <p className="mt-1.5 text-xs text-[#bb3f3f]" role="alert">{error}</p>}</div>;
}
