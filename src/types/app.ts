export type AgeStage = "childhood" | "teen" | "current" | "custom";

export type Memory = {
  id: string;
  user_id: string;
  age_stage: AgeStage;
  age_from: number | null;
  age_to: number | null;
  title: string | null;
  content: string;
  location: string | null;
  people_involved: unknown[];
  emotion_tags: string[];
  sensitivity_level: number;
  user_confirmed: boolean;
  created_at: string;
  updated_at: string;
};