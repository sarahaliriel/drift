import { mockProjects } from "../demo/fixtures";
import type { ProjectRepository } from "./project-repository";
import type { CreateProjectInput, Project } from "../model/types";

// Keep the established key and serialized Project shape for existing demo data.
const KEY = "drift-demo-projects-v1";

function localProjects(): Project[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(value) ? (value as Project[]) : [];
  } catch {
    return [];
  }
}

export const localStorageProjectRepository: ProjectRepository = {
  async list() {
    return [...localProjects(), ...mockProjects];
  },
  async getById(id) {
    return [...localProjects(), ...mockProjects].find((project) => project.id === id) ?? null;
  },
  async create(input: CreateProjectInput) {
    const now = new Date().toISOString();
    const project: Project = {
      ...input,
      id: `demo-${crypto.randomUUID()}`,
      createdAt: now,
      updatedAt: now,
      lastScanId: null,
      status: "ready",
    };
    localStorage.setItem(KEY, JSON.stringify([project, ...localProjects()]));
    return project;
  },
};
