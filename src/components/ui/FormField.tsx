import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, action, children }: FormFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-xs font-bold text-foreground">{label}</label>
        {action}
      </div>
      {children}
      {error ? <p className="mt-1.5 text-xs text-destructive" role="alert">{error}</p> : null}
    </div>
  );
}
