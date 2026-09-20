export const marketingNavigation = [
  { label: "Product", href: "/#overview" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Docs", href: "/docs" },
  { label: "GitHub", href: "https://github.com/sarahaliriel/drift" },
] as const;

export type MarketingNavigationItem = (typeof marketingNavigation)[number];
