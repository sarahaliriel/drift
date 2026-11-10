import { mockScans } from "./fixtures";
import type { Scan } from "../model/types";

export const scanRepository = {
  async list(): Promise<Scan[]> {
    return mockScans;
  },
  async forProject(id: string): Promise<Scan[]> {
    return mockScans.filter((scan) => scan.projectId === id);
  },
};
