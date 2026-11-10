import { mockFindings } from "./fixtures";
import type { Finding } from "../model/types";

export const findingRepository = {
  async list(): Promise<Finding[]> {
    return mockFindings;
  },
  async forProject(id: string): Promise<Finding[]> {
    return mockFindings.filter((finding) => finding.projectId === id);
  },
};
