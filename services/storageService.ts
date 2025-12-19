import { NursingSession, BathRecord, WeightRecord, HeightRecord, DiaryEntry, ActiveTimerState, BabyProfile } from '../types';

const KEYS = {
  SESSIONS: 'babytrack_sessions',
  BATHS: 'babytrack_baths',
  WEIGHTS: 'babytrack_weights',
  HEIGHTS: 'babytrack_heights',
  DIARY: 'babytrack_diary',
  ACTIVE_TIMER: 'babytrack_active_timer',
  PROFILE: 'babytrack_profile'
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Baby Profile ---

export const getProfile = (): BabyProfile | null => {
  const data = localStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveProfile = (profile: BabyProfile) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const clearAllData = () => {
  localStorage.clear();
};

// --- Nursing Sessions ---

export const getSessions = async (): Promise<NursingSession[]> => {
  const data = localStorage.getItem(KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
};

export const saveSession = async (session: Omit<NursingSession, 'id'>) => {
  const sessions = await getSessions();
  const newSession: NursingSession = { ...session, id: generateId() };
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify([newSession, ...sessions]));
  return newSession;
};

export const deleteSession = async (id: string) => {
  const sessions = await getSessions();
  const filtered = sessions.filter(s => s.id !== id);
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(filtered));
};

// --- Baths ---

export const getBaths = async (): Promise<BathRecord[]> => {
  const data = localStorage.getItem(KEYS.BATHS);
  return data ? JSON.parse(data) : [];
};

export const saveBath = async (date: Date) => {
  const baths = await getBaths();
  const newBath: BathRecord = { id: generateId(), dateTime: date.toISOString() };
  localStorage.setItem(KEYS.BATHS, JSON.stringify([newBath, ...baths]));
};

export const deleteBath = async (id: string) => {
  const baths = await getBaths();
  const filtered = baths.filter(b => b.id !== id);
  localStorage.setItem(KEYS.BATHS, JSON.stringify(filtered));
};

// --- Weights ---

export const getWeights = async (): Promise<WeightRecord[]> => {
  const data = localStorage.getItem(KEYS.WEIGHTS);
  return data ? JSON.parse(data) : [];
};

export const saveWeight = async (weight: number, date: Date) => {
  const weights = await getWeights();
  const newWeight: WeightRecord = { id: generateId(), weightKg: weight, dateTime: date.toISOString() };
  localStorage.setItem(KEYS.WEIGHTS, JSON.stringify([newWeight, ...weights]));
};

export const deleteWeight = async (id: string) => {
  const weights = await getWeights();
  const filtered = weights.filter(w => w.id !== id);
  localStorage.setItem(KEYS.WEIGHTS, JSON.stringify(filtered));
};

// --- Heights ---

export const getHeights = async (): Promise<HeightRecord[]> => {
  const data = localStorage.getItem(KEYS.HEIGHTS);
  return data ? JSON.parse(data) : [];
};

export const saveHeight = async (height: number, date: Date) => {
  const heights = await getHeights();
  const newHeight: HeightRecord = { id: generateId(), heightCm: height, dateTime: date.toISOString() };
  localStorage.setItem(KEYS.HEIGHTS, JSON.stringify([newHeight, ...heights]));
};

export const deleteHeight = async (id: string) => {
  const heights = await getHeights();
  const filtered = heights.filter(h => h.id !== id);
  localStorage.setItem(KEYS.HEIGHTS, JSON.stringify(filtered));
};

// --- Diary ---

export const getDiaryEntries = async (): Promise<DiaryEntry[]> => {
  const data = localStorage.getItem(KEYS.DIARY);
  return data ? JSON.parse(data) : [];
};

export const saveDiaryEntry = async (content: string, date: Date) => {
  const entries = await getDiaryEntries();
  const newEntry: DiaryEntry = { id: generateId(), content, dateTime: date.toISOString() };
  localStorage.setItem(KEYS.DIARY, JSON.stringify([newEntry, ...entries]));
};

export const deleteDiaryEntry = async (id: string) => {
  const entries = await getDiaryEntries();
  const filtered = entries.filter(e => e.id !== id);
  localStorage.setItem(KEYS.DIARY, JSON.stringify(filtered));
};

// --- Active Timer State ---

export const getActiveTimer = (): ActiveTimerState | null => {
  const data = localStorage.getItem(KEYS.ACTIVE_TIMER);
  return data ? JSON.parse(data) : null;
};

export const saveActiveTimer = (state: ActiveTimerState) => {
  localStorage.setItem(KEYS.ACTIVE_TIMER, JSON.stringify(state));
};

export const clearActiveTimer = () => {
  localStorage.removeItem(KEYS.ACTIVE_TIMER);
};
