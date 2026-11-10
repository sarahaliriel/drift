import type { Scan } from "../model/types";

export const mockScans: Scan[] = [
  {
    id: "scan-website",
    projectId: "website",
    status: "completed",
    startedAt: "2026-11-09T09:58:00Z",
    completedAt: "2026-11-09T10:00:00Z",
    findingsCount: 3,
    commitSha: "a1b2c3d",
  },
  {
    id: "scan-dashboard",
    projectId: "dashboard-ui",
    status: "completed",
    startedAt: "2026-11-08T09:58:00Z",
    completedAt: "2026-11-08T10:00:00Z",
    findingsCount: 5,
    commitSha: "d4e5f6a",
  },
];
