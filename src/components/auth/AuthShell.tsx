import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export function AuthShell({ children, title, description }: AuthShellProps) {
  return (
    <section id="auth-form" className="auth-form-panel">
      <h1 className="font-display text-3xl tracking-[-0.02em] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}
