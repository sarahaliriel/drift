import { FileWarning, FolderKanban, LayoutDashboard, ScanSearch, Settings } from "lucide-react";
export const dashboardNavigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Scans", href: "/dashboard/scans", icon: ScanSearch },
  { label: "Findings", href: "/dashboard/findings", icon: FileWarning },
] as const;
export const settingsNavigation = {
  label: "Settings",
  href: "/dashboard/settings",
  icon: Settings,
} as const;
