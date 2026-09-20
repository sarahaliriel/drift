"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { FormField } from "@/components/ui/FormField";
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
      <Alert>
        <CheckCircle2 className="mx-auto size-8 text-success" />
        <p className="mt-3 font-bold">Check your email.</p>
        <p className="mt-2 text-sm leading-6 text-muted">We simulated sending the instructions. No message was sent in this demo.</p>
        <AnimatedLink href="/login" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent"><ArrowLeft className="size-4" /> Back to sign in</AnimatedLink>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FormField label="Account email" htmlFor="recovery-email" error={errors.email?.message}>
        <div className="relative">
          <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
          <Input id="recovery-email" {...register("email")} type="email" autoComplete="email" className="pl-11" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />
        </div>
      </FormField>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <><LoaderCircle className="size-4 animate-spin" /> Sending...</> : "Send instructions"}
      </Button>
      <AnimatedLink href="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-muted hover:text-foreground"><ArrowLeft className="size-4" /> Back to sign in</AnimatedLink>
    </form>
  );
}
