import { Home } from "lucide-react";

export const dashboardNavigationGroups = [
  {
    label: "Workspace",
    items: [{ label: "Dashboard", href: "/dashboard", icon: Home }],
  },
] as const;
