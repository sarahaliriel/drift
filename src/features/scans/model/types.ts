export type Scan = {
  id: string;
  projectId: string;
  status: "completed" | "pending";
  startedAt: string;
  completedAt: string | null;
  findingsCount: number;
  commitSha?: string;
};
