"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { CreateProjectInput, Project } from "@/features/projects/public";
import type { Finding } from "@/features/findings/public";
import type { Scan } from "@/features/scans/public";

export type DashboardTheme = "light" | "dark" | "system";
export type DashboardContextValue = {
  projects: Project[];
  scans: Scan[];
  findings: Finding[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
  createProject: (input: CreateProjectInput) => Promise<Project>;
};

export const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const value = useContext(DashboardContext);
  if (!value) throw new Error("DashboardProvider missing");
  return value;
}

export type DashboardProviderProps = { children: ReactNode };
