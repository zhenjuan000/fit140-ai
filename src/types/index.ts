// ==================== 核心类型定义 ====================

export interface UserProfile {
  startWeight: number;
  currentWeight: number;
  targetWeight: number;
  targetDate: string;       // "2026-10-15"
  startDate: string;        // 开始记录的日期
  height: number;           // cm
  gender: 'male' | 'female';
}

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  icon: string;
}

export interface MealRecord {
  items: string[];          // meal item ids that were checked
  time: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface ExerciseSet {
  reps: number;
  weight: number;           // kg
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  notes: string;
  sets: number;
  reps: string;
  restTime: number;         // seconds
  bodyPart: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: Exercise[];
  cardio?: { type: string; duration: number }; // minutes
}

export interface DailyRecord {
  date: string;             // "YYYY-MM-DD"
  weight: number;           // 斤
  meals: Record<string, string[]>; // { breakfast: ["egg", "milk"], lunch: [...], dinner: [...] }
  waterMl: number;
  workouts: Record<string, boolean>; // exerciseId -> completed
  cardioCompleted: boolean;
  workoutCompleted: boolean;
  stepCount?: number;
  sleepHours?: number;
  saltIntake?: 'low' | 'normal' | 'high';
  notes?: string;
}

export interface PhotoRecord {
  date: string;
  front?: string;           // base64 or URL
  side?: string;
  back?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (streak: number) => boolean;
  unlockedAt?: string;
}

export interface AICoachAnalysis {
  date: string;
  weightChange: number;
  analysis: string;
  suggestion: string;
  fluctuationType: 'normal' | 'water' | 'salt' | 'sleep' | 'recovery' | 'plateau' | 'loss';
  shouldAdjustDiet: boolean;
  shouldAdjustCardio: boolean;
}

export interface AppSettings {
  waterGoal: number;        // ml, default 3500
  weightUnit: 'jin' | 'kg';
  reminders: boolean;
  reminderTimes: { morning?: string; afternoon?: string; evening?: string };
}
