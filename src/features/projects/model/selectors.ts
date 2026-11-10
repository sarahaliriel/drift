import type { Project } from "./types";

export type ProjectSort = "updated" | "name";
export type ProjectSourceFilter = "all" | Project["sourceType"];

export function filterAndSortProjects(
  projects: Project[],
  search: string,
  source: ProjectSourceFilter,
  sort: ProjectSort,
) {
  const query = search.toLowerCase();
  return projects
    .filter(
      (project) =>
        project.name.toLowerCase().includes(query) &&
        (source === "all" || project.sourceType === source),
    )
    .sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : b.updatedAt.localeCompare(a.updatedAt),
    );
}
