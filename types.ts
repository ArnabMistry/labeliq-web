
export enum Verdict {
  SAFE = 'SAFE',
  CAUTION = 'CAUTION',
  AVOID = 'AVOID'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface IngredientAnalysis {
  name: string;
  technicalName?: string;
  purpose: string;
  riskLevel: RiskLevel;
  warning?: string;
  regulatoryNote?: string;
}

export interface ScanResult {
  productName?: string;
  overallVerdict: Verdict;
  summary: string;
  ingredients: IngredientAnalysis[];
}

export interface UserProfile {
  allergies: string[];
  conditions: string[];
  profession: string;
  goals: string[];
}

export type AppScreen = 'home' | 'scan' | 'result' | 'profile' | 'history' | 'about';
