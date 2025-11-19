export interface VibeEntry {
  id: string;
  // User inputs
  prompt: string;
  builderUrl: string;
  repoUrl: string;
  deployUrl: string;
  author: string;
  
  // AI Generated or inferred
  title: string;
  summary: string;
  tags: string[];
  
  timestamp: number;
}

export interface AIAnalysisResult {
  title: string;
  summary: string;
  tags: string[];
}