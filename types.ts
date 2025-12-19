export interface NursingSession {
  id: string;
  startTime: string; // ISO String
  endTime: string | null; // ISO String
  durationSeconds: number;
  hasPee: boolean;
  hasPoop: boolean;
  notes?: string;
}

export interface BathRecord {
  id: string;
  dateTime: string; // ISO String
  notes?: string;
}

export interface WeightRecord {
  id: string;
  dateTime: string; // ISO String
  weightKg: number;
}

export interface HeightRecord {
  id: string;
  dateTime: string; // ISO String
  heightCm: number;
}

export interface DiaryEntry {
  id: string;
  dateTime: string; // ISO String
  content: string;
}

export interface BabyProfile {
  name: string;
  birthDate: string;
}

export type ViewState = 'timer' | 'history' | 'care' | 'diary';

export interface ActiveTimerState {
  isRunning: boolean;
  startTime: string;
  accumulatedSeconds: number;
  lastResumeTime: string | null;
}