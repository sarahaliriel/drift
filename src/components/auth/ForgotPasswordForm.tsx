"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/features/auth/schemas/auth-form-schema";

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 650));
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-brand/20 bg-brand-soft/60 p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto size-8 text-brand-hover" />
        <p className="mt-3 font-bold">Confira seu e-mail.</p>
        <p className="mt-2 text-sm leading-6 text-muted">Simulamos o envio das instruções. Nenhuma mensagem real foi enviada nesta demonstração.</p>
        <Link href="/login" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-hover"><ArrowLeft className="size-4" /> Voltar para o login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="recovery-email" className="mb-2 block text-xs font-bold">E-mail da sua conta</label>
        <div className="relative">
          <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
          <Input id="recovery-email" {...register("email")} type="email" autoComplete="email" className="pl-11" placeholder="voce@exemplo.com" aria-invalid={Boolean(errors.email)} />
        </div>
        {errors.email?.message && <p className="mt-1.5 text-xs text-[#bb3f3f]" role="alert">{errors.email.message}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <><LoaderCircle className="size-4 animate-spin" /> Enviando...</> : "Enviar instruções"}
      </Button>
      <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-foreground"><ArrowLeft className="size-4" /> Voltar para o login</Link>
    </form>
  );
}
