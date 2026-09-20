import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Digite seu nome."),
    email: z.email("Digite um e-mail válido."),
    password: z.string().min(8, "Use pelo menos 8 caracteres."),
    confirmPassword: z.string(),
    terms: z.boolean().refine(Boolean, "Aceite os termos para continuar."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("Digite um e-mail válido."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
