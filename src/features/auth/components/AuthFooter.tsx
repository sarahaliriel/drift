import { AnimatedLink } from "@/components/ui/AnimatedLink";

type AuthFooterProps = {
  prompt: string;
  href: string;
  linkLabel: string;
};

export function AuthFooter({ prompt, href, linkLabel }: AuthFooterProps) {
  return (
    <div className='auth-footer'>
      <span>{prompt}</span>{" "}
      <AnimatedLink href={href} className='auth-footer-link'>
        {linkLabel}
      </AnimatedLink>
    </div>
  );
}
