"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/Button";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
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
      <FormField label="Email" htmlFor="login-email" error={errors.email?.message}>
        <Input id="login-email" {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />
      </FormField>
      <FormField label="Password" htmlFor="login-password" error={errors.password?.message} action={<AnimatedLink href="/recuperar-senha" className="text-xs font-semibold text-accent hover:underline">Forgot password?</AnimatedLink>}>
        <PasswordField id="login-password" {...register("password")} autoComplete="current-password" placeholder="Enter your password" aria-invalid={Boolean(errors.password)} />
      </FormField>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <><LoaderCircle className="size-4 animate-spin" /> Signing in...</> : <>Sign in <ArrowRight className="size-4" /></>}
      </Button>
      <p className="text-center text-sm text-muted">Don&apos;t have an account? <AnimatedLink href="/cadastro" className="font-bold text-accent hover:underline">Create account</AnimatedLink></p>
    </form>
  );
}
