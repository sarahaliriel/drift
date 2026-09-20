import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { renderWaveText } from "@/components/ui/WaveText";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "dark";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "button-primary",
  secondary: "button-secondary",
  outline: "button-secondary",
  ghost: "button-ghost",
  dark: "button-dark",
};

const sizes: Record<ButtonSize, string> = {
  sm: "button-sm",
  md: "button-md",
  lg: "button-lg",
};

type SharedButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ActionButtonProps = SharedButtonProps &
  Omit<ComponentProps<"button">, keyof SharedButtonProps | "href"> & {
    href?: never;
  };

type NavigationButtonProps = SharedButtonProps &
  Omit<ComponentProps<typeof Link>, keyof SharedButtonProps> & {
    href: ComponentProps<typeof Link>["href"];
    disabled?: boolean;
  };

export type ButtonProps = ActionButtonProps | NavigationButtonProps;

function buttonClassName(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn("button-base wave-interactive", variants[variant], sizes[size], className);
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
  } = props;

  if ("href" in props && props.href !== undefined) {
    const { href, disabled, onClick, ...linkProps } = props;

    return (
      <Link
        {...linkProps}
        href={href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : linkProps.tabIndex}
        onClick={onClick}
        className={buttonClassName(variant, size, className)}
      >
        {renderWaveText(children)}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type={type}
      className={buttonClassName(variant, size, className)}
    >
      {renderWaveText(children)}
    </button>
  );
}

export function LinkButton(props: NavigationButtonProps) {
  return <Button {...props} />;
}
