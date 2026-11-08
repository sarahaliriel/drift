export type FooterNavigationItem = {
  label: string;
  href?: string;
};

export type FooterNavigationGroup = {
  id: string;
  number: string;
  title: string;
  items: readonly FooterNavigationItem[];
};

// Add href to a pending item when its destination is ready.
export const footerNavigation: readonly FooterNavigationGroup[] = [
  {
    id: "footer-product",
    number: "01",
    title: "Product",
    items: [
      { label: "Overview", href: "/#overview" },
      { label: "How it works" },
      { label: "Features" },
      { label: "Changelog" },
    ],
  },
  {
    id: "footer-resources",
    number: "02",
    title: "Resources",
    items: [
      { label: "Documentation" },
      { label: "Examples" },
      { label: "FAQ", href: "/#faq" },
      { label: "Blog" },
    ],
  },
  {
    id: "footer-community",
    number: "03",
    title: "Community",
    items: [
      { label: "GitHub" },
      { label: "Contribute" },
      { label: "Discussions" },
      { label: "Report a bug" },
    ],
  },
  {
    id: "footer-legal",
    number: "04",
    title: "Legal",
    items: [
      { label: "Terms of Use" },
      { label: "Privacy Policy" },
      { label: "Cookie Policy" },
      { label: "License" },
    ],
  },
] as const;
