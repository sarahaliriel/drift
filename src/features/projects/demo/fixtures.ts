import type { Project } from "../model/types";

export const mockProjects: Project[] = [
  {
    id: "website",
    name: "Website",
    sourceType: "github",
    sourceMetadata: { label: "drift/website", branch: "main" },
    createdAt: "2026-10-01T09:00:00Z",
    updatedAt: "2026-11-09T10:00:00Z",
    lastScanId: "scan-website",
    status: "scanned",
  },
  {
    id: "dashboard-ui",
    name: "Dashboard UI",
    sourceType: "github",
    sourceMetadata: { label: "drift/dashboard-ui", branch: "main" },
    createdAt: "2026-09-17T09:00:00Z",
    updatedAt: "2026-11-08T10:00:00Z",
    lastScanId: "scan-dashboard",
    status: "scanned",
  },
  {
    id: "component-library",
    name: "Component Library",
    sourceType: "upload",
    sourceMetadata: {
      label: "Uploaded files",
      files: [
        { name: "tokens.css", size: 18320 },
        { name: "Button.tsx", size: 4210 },
      ],
    },
    createdAt: "2026-11-04T09:00:00Z",
    updatedAt: "2026-11-04T09:00:00Z",
    lastScanId: null,
    status: "ready",
  },
];
