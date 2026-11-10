import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description?: string;
};

export function AuthShell({ children, eyebrow, title, description }: AuthShellProps) {
  return (
    <section id='auth-form' className='auth-form-panel' aria-labelledby='auth-title'>
      <p className='auth-eyebrow'>
        <span aria-hidden='true' />
        {eyebrow}
      </p>
      <h1 id='auth-title' className='auth-title'>
        {title}.
      </h1>
      {description ? <p className='auth-description'>{description}</p> : null}
      <div className='auth-form-content'>{children}</div>
    </section>
  );
}
