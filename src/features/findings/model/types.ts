export type DetectedTokenColor = {
  id: string;
  value: string;
  filePath: string;
  line?: number;
  isReference?: boolean;
};
export type TokenConsistencyData = {
  tokenName: string;
  referenceValue: string;
  detectedValues: DetectedTokenColor[];
};

export type Finding = {
  id: string;
  projectId: string;
  scanId: string;
  ruleId: string;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  filePath: string;
  line: number;
  status: "open" | "resolved";
  suggestion: string;
  tokenConsistency?: TokenConsistencyData;
};
