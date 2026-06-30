import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { DailyRecord, UserProfile, PhotoRecord, AppSettings } from '../types';
import { todayStr } from '../utils/dateUtils';

// ==================== State ====================
interface AppState {
  userProfile: UserProfile;
  records: Record<string, DailyRecord>;       // dateStr -> record
  photos: Record<string, PhotoRecord>;        // dateStr -> photos
  settings: AppSettings;
}

const defaultSettings: AppSettings = {
  waterGoal: 3500,
  weightUnit: 'jin',
  reminders: false,
  reminderTimes: { morning: '08:00', afternoon: '16:00', evening: '21:00' },
};

const defaultProfile: UserProfile = {
  startWeight: 182,
  currentWeight: 182,
  targetWeight: 140,
  targetDate: '2026-10-15',
  startDate: todayStr(),
  height: 175,
  gender: 'male',
};

function emptyRecord(date: string): DailyRecord {
  return {
    date,
    weight: 0,
    meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
    waterMl: 0,
    workouts: {},
    cardioCompleted: false,
    workoutCompleted: false,
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem('fit140_state');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        userProfile: { ...defaultProfile, ...parsed.userProfile },
        records: parsed.records || {},
        photos: parsed.photos || {},
        settings: { ...defaultSettings, ...parsed.settings },
      };
    }
  } catch { /* ignore */ }
  return { userProfile: defaultProfile, records: {}, photos: {}, settings: defaultSettings };
}

function saveState(state: AppState) {
  try { localStorage.setItem('fit140_state', JSON.stringify(state)); } catch { /* quota exceeded */ }
}

// ==================== Actions ====================
type Action =
  | { type: 'SET_WEIGHT'; date: string; weight: number }
  | { type: 'TOGGLE_MEAL'; date: string; mealType: string; itemId: string }
  | { type: 'ADD_WATER'; date: string; ml: number }
  | { type: 'TOGGLE_EXERCISE'; date: string; exerciseId: string }
  | { type: 'SET_CARDIO'; date: string; completed: boolean }
  | { type: 'SET_WORKOUT_DONE'; date: string }
  | { type: 'UPDATE_PROFILE'; profile: Partial<UserProfile> }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'SAVE_PHOTO'; date: string; pose: 'front' | 'side' | 'back'; data: string }
  | { type: 'SET_SLEEP'; date: string; hours: number }
  | { type: 'SET_SALT'; date: string; level: 'low' | 'normal' | 'high' }
  | { type: 'RESET_ALL' };

function reducer(state: AppState, action: Action): AppState {
  const today = todayStr();
  switch (action.type) {
    case 'SET_WEIGHT': {
      const records = { ...state.records };
      if (!records[action.date]) records[action.date] = emptyRecord(action.date);
      records[action.date] = { ...records[action.date], weight: action.weight };
      return { ...state, records, userProfile: { ...state.userProfile, currentWeight: action.weight } };
    }
    case 'TOGGLE_MEAL': {
      const records = { ...state.records };
      if (!records[action.date]) records[action.date] = emptyRecord(action.date);
      const meals = { ...records[action.date].meals };
      const list = [...(meals[action.mealType] || [])];
      const idx = list.indexOf(action.itemId);
      if (idx >= 0) list.splice(idx, 1);
      else list.push(action.itemId);
      meals[action.mealType] = list;
      records[action.date] = { ...records[action.date], meals };
      return { ...state, records };
    }
    case 'ADD_WATER': {
      const records = { ...state.records };
      if (!records[action.date]) records[action.date] = emptyRecord(action.date);
      records[action.date] = { ...records[action.date], waterMl: records[action.date].waterMl + action.ml };
      return { ...state, records };
    }
    case 'TOGGLE_EXERCISE': {
      const records = { ...state.records };
      if (!records[action.date]) records[action.date] = emptyRecord(action.date);
      const workouts = { ...records[action.date].workouts };
      workouts[action.exerciseId] = !workouts[action.exerciseId];
      records[action.date] = { ...records[action.date], workouts };
      return { ...state, records };
    }
    case 'SET_CARDIO': {
      const records = { ...state.records };
      if (!records[action.date]) records[action.date] = emptyRecord(action.date);
      records[action.date] = { ...records[action.date], cardioCompleted: action.completed };
      return { ...state, records };
    }
    case 'SET_WORKOUT_DONE': {
      const records = { ...state.records };
      if (!records[action.date]) records[action.date] = emptyRecord(action.date);
      records[action.date] = { ...records[action.date], workoutCompleted: true };
      return { ...state, records };
    }
    case 'UPDATE_PROFILE':
      return { ...state, userProfile: { ...state.userProfile, ...action.profile } };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'SAVE_PHOTO': {
      const photos = { ...state.photos };
      if (!photos[action.date]) photos[action.date] = { date: action.date };
      photos[action.date] = { ...photos[action.date], [action.pose]: action.data };
      return { ...state, photos };
    }
    case 'SET_SLEEP': {
      const records = { ...state.records };
      if (!records[action.date]) records[action.date] = emptyRecord(action.date);
      records[action.date] = { ...records[action.date], sleepHours: action.hours };
      return { ...state, records };
    }
    case 'SET_SALT': {
      const records = { ...state.records };
      if (!records[action.date]) records[action.date] = emptyRecord(action.date);
      records[action.date] = { ...records[action.date], saltIntake: action.level };
      return { ...state, records };
    }
    case 'RESET_ALL':
      return { userProfile: defaultProfile, records: {}, photos: {}, settings: defaultSettings };
    default:
      return state;
  }
}

// ==================== Context ====================
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  todayRecord: DailyRecord;
  getRecord: (date: string) => DailyRecord;
}

const AppContext = createContext<AppContextType>(null!);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  // Auto-save
  useEffect(() => { saveState(state); }, [state]);

  const todayRecord = state.records[todayStr()] || emptyRecord(todayStr());
  const getRecord = useCallback(
    (date: string) => state.records[date] || emptyRecord(date),
    [state.records]
  );

  return (
    <AppContext.Provider value={{ state, dispatch, todayRecord, getRecord }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

export { todayStr, emptyRecord };
