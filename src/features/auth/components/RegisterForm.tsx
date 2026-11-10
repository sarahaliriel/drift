"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordField } from "@/features/auth/components/PasswordField";
import { AuthFooter } from "@/features/auth/components/AuthFooter";
import { Button } from "@/components/ui/Button";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { FormField } from "@/components/ui/FormField";
import { registerSchema, type RegisterFormData } from "@/features/auth/schemas/auth-form-schema";

export function RegisterForm() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 650));
    setSuccess(true);
  }

  if (success) {
    return (
      <Alert>
        <CheckCircle2 className='mx-auto size-8 text-success' />
        <p className='mt-3 font-bold'>Your account is ready.</p>
        <p className='mt-2 text-sm text-muted'>Continue to your Drift workspace.</p>
        <AnimatedLink
          href='/dashboard'
          className='mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent'
        >
          Explore the workspace <ArrowRight className='size-4' />
        </AnimatedLink>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className='auth-form space-y-4'>
      <FormField label='Name' htmlFor='register-name' error={errors.name?.message}>
        <Input
          id='register-name'
          {...register("name")}
          autoComplete='name'
          placeholder='What should we call you?'
          aria-invalid={Boolean(errors.name)}
        />
      </FormField>
      <FormField label='Email' htmlFor='register-email' error={errors.email?.message}>
        <Input
          id='register-email'
          {...register("email")}
          type='email'
          autoComplete='email'
          placeholder='you@example.com'
          aria-invalid={Boolean(errors.email)}
        />
      </FormField>
      <div className='grid gap-4'>
        <FormField
          label='Create a password'
          htmlFor='register-password'
          error={errors.password?.message}
        >
          <PasswordField
            id='register-password'
            {...register("password")}
            autoComplete='new-password'
            placeholder='8+ characters'
            aria-invalid={Boolean(errors.password)}
          />
        </FormField>
        <FormField
          label='Confirm password'
          htmlFor='register-confirm-password'
          error={errors.confirmPassword?.message}
        >
          <PasswordField
            id='register-confirm-password'
            {...register("confirmPassword")}
            autoComplete='new-password'
            placeholder='Enter it again'
            aria-invalid={Boolean(errors.confirmPassword)}
          />
        </FormField>
      </div>
      <div>
        <label className='auth-terms'>
          <input
            type='checkbox'
            {...register("terms")}
            className='mt-0.5 size-4 rounded accent-accent'
          />
          <span>I agree to Drift’s terms of service.</span>
        </label>
        {errors.terms?.message && (
          <p className='mt-1.5 text-xs text-destructive' role='alert'>
            {errors.terms.message}
          </p>
        )}
      </div>
      <Button type='submit' size='lg' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle className='size-4 animate-spin' /> Creating...
          </>
        ) : (
          <>
            Create Account <ArrowRight className='size-4' />
          </>
        )}
      </Button>
      <AuthFooter prompt='Already have an account?' href='/login' linkLabel='Sign in' />
    </form>
  );
}
