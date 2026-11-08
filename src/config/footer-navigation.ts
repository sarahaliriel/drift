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
    title: "Product",
    items: [
      { label: "Overview", href: "/#overview" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    id: "footer-resources",
    title: "Resources",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Examples", href: "/examples" },
      { label: "Community", href: "/community" },
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
