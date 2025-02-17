import create from 'zustand';
import { TimerState, TimeAddition, SUB_TIER_MINUTES } from '../types/Timer';
import { persistenceStore } from './persistence';

interface TimerStore extends TimerState {
  isPaused: boolean;
  addTime: (addition: TimeAddition) => void;
  removeTime: (minutes: number) => void;
  updateTimer: () => void;
  togglePause: () => void;
  lastUpdate: number;
  resetTimer: () => void;
}

const calculateTimeToAdd = (addition: TimeAddition): number => {
  switch (addition.type) {
    case 'sub':
      const baseMinutes = addition.tier ? SUB_TIER_MINUTES[addition.tier] : SUB_TIER_MINUTES['1000'];
      return baseMinutes * addition.amount * 60;
    case 'donation':
      return Math.floor(addition.amount / 5) * 7 * 60; // 7 minutes per 5€
    case 'manual':
      return addition.amount * 60; // Convert minutes to seconds
    default:
      return 0;
  }
};

const loadInitialState = () => {
  const savedState = persistenceStore.loadState();
  if (savedState) {
    return {
      endTime: new Date(savedState.endTime),
      isPaused: savedState.isPaused,
      lastUpdate: savedState.lastUpdate
    };
  }
  return {
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isPaused: false,
    lastUpdate: Date.now()
  };
};

const initialState = loadInitialState();
export const useTimerStore = create<TimerStore>((set, get) => ({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  endTime: initialState.endTime,
  isPaused: initialState.isPaused,
  lastUpdate: initialState.lastUpdate,

  togglePause: () => {
    const isPaused = get().isPaused;
    if (isPaused) {
      const timeSpentPaused = Date.now() - get().lastUpdate;
      const currentEndTime = get().endTime;
      const newState = {
        isPaused: false,
        endTime: new Date(currentEndTime.getTime() + timeSpentPaused)
      };
      set(newState);
      persistenceStore.saveState({
        endTime: newState.endTime.toISOString(),
        isPaused: newState.isPaused,
        lastUpdate: Date.now()
      });
    } else {
      const newState = {
        isPaused: true,
        lastUpdate: Date.now()
      };
      set(newState);
      persistenceStore.saveState({
        endTime: get().endTime.toISOString(),
        isPaused: newState.isPaused,
        lastUpdate: newState.lastUpdate
      });
    }
  },

  addTime: (addition: TimeAddition) => {
    const secondsToAdd = calculateTimeToAdd(addition);
    const currentEndTime = get().endTime;
    const newEndTime = new Date(currentEndTime.getTime() + secondsToAdd * 1000);
    set({ endTime: newEndTime });
    persistenceStore.saveState({
      endTime: newEndTime.toISOString(),
      isPaused: get().isPaused,
      lastUpdate: get().lastUpdate
    });
    get().updateTimer();
  },

  removeTime: (minutes: number) => {
    const secondsToRemove = minutes * 60;
    const currentEndTime = get().endTime;
    const newEndTime = new Date(currentEndTime.getTime() - secondsToRemove * 1000);
    set({ endTime: newEndTime });
    persistenceStore.saveState({
      endTime: newEndTime.toISOString(),
      isPaused: get().isPaused,
      lastUpdate: get().lastUpdate
    });
    get().updateTimer();
  },

  updateTimer: () => {
    const now = new Date();
    const endTime = get().endTime;

    const currentTime = get().isPaused ? get().lastUpdate : now.getTime();
    const diff = Math.max(0, endTime.getTime() - currentTime);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    set({ days, hours, minutes, seconds });
    // Save current state to persistence
    persistenceStore.saveState({
      endTime: endTime.toISOString(),
      isPaused: get().isPaused,
      lastUpdate: get().lastUpdate
    });
  },

  resetTimer: () => {
    const newState = {
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isPaused: get().isPaused,
      lastUpdate: Date.now()
    };
    set({ ...newState, days: 1, hours: 0, minutes: 0, seconds: 0 });
    persistenceStore.saveState({
      endTime: newState.endTime.toISOString(),
      isPaused: newState.isPaused,
      lastUpdate: newState.lastUpdate
    });
  }
}));
