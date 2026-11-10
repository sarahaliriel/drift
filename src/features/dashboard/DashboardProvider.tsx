"use client";
import { useCallback, useEffect, useState } from "react";
import { findingRepository, type Finding } from "@/features/findings/public";
import { scanRepository, type Scan } from "@/features/scans/public";
import {
  localStorageProjectRepository,
  type CreateProjectInput,
  type Project,
} from "@/features/projects/public";
import {
  DashboardContext,
  type DashboardProviderProps,
  type DashboardTheme,
} from "./dashboard-context";
export function DashboardProvider({ children }: DashboardProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setThemeState] = useState<DashboardTheme>("system");
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsResult, scansResult, findingsResult] = await Promise.all([
        localStorageProjectRepository.list(),
        scanRepository.list(),
        findingRepository.list(),
      ]);
      setProjects(projectsResult);
      setScans(scansResult);
      setFindings(findingsResult);
    } catch {
      setError("We couldn’t load your workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    queueMicrotask(() => {
      void reload();
    });
    const saved = localStorage.getItem("drift-dashboard-theme");
    if (saved === "light" || saved === "dark" || saved === "system")
      queueMicrotask(() => setThemeState(saved));
  }, [reload]);
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.dashboardTheme =
        theme === "system" ? (query.matches ? "dark" : "light") : theme;
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [theme]);
  const setTheme = (value: DashboardTheme) => {
    localStorage.setItem("drift-dashboard-theme", value);
    setThemeState(value);
  };
  const createProject = async (input: CreateProjectInput) => {
    const project = await localStorageProjectRepository.create(input);
    setProjects((current) => [project, ...current]);
    return project;
  };
  return (
    <DashboardContext.Provider
      value={{ projects, scans, findings, loading, error, reload, theme, setTheme, createProject }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
