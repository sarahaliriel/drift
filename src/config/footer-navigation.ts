export type FooterNavigationItem = {
  label: string;
  href?: string;
};

export type FooterNavigationGroup = {
  id: string;
  title: string;
  items: readonly FooterNavigationItem[];
};

export const footerNavigation: readonly FooterNavigationGroup[] = [
  {
    id: "footer-drift",
    title: "Drift",
    items: [
      { label: "Overview", href: "/#overview" },
    ],
  },
  {
    id: "footer-comece-agora",
    title: "Account",
    items: [
      { label: "Sign up", href: "/cadastro" },
      { label: "Sign in", href: "/login" },
    ],
  },
] as const;
