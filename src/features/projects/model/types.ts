export type SourceType = "github" | "upload";

export type Project = {
  id: string;
  name: string;
  sourceType: SourceType;
  sourceMetadata: { label: string; branch?: string; files?: { name: string; size: number }[] };
  createdAt: string;
  updatedAt: string;
  lastScanId: string | null;
  status: "ready" | "scanned";
};

export type CreateProjectInput = Pick<Project, "name" | "sourceType" | "sourceMetadata">;
