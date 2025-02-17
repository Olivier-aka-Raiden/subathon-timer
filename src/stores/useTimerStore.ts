import create from 'zustand';
import { TimerState, TimeAddition, SUB_TIER_MINUTES } from '../types/Timer';

interface TimerStore extends TimerState {
  isPaused: boolean;
  addTime: (addition: TimeAddition) => void;
  removeTime: (minutes: number) => void;
  updateTimer: () => void;
  togglePause: () => void;
  lastUpdate: number;
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

const initialEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

export const useTimerStore = create<TimerStore>((set, get) => ({
  days: 1,
  hours: 0,
  minutes: 0,
  seconds: 0,
  endTime: initialEndTime,
  isPaused: false,
  lastUpdate: Date.now(),

  togglePause: () => {
    const isPaused = get().isPaused;
    if (isPaused) {
      // When unpausing, adjust endTime based on the time spent paused
      const timeSpentPaused = Date.now() - get().lastUpdate;
      const currentEndTime = get().endTime;
      set({
        isPaused: false,
        endTime: new Date(currentEndTime.getTime() + timeSpentPaused)
      });
    } else {
      // When pausing, store the current timestamp
      set({
        isPaused: true,
        lastUpdate: Date.now()
      });
    }
  },

  addTime: (addition: TimeAddition) => {
    const secondsToAdd = calculateTimeToAdd(addition);
    const currentEndTime = get().endTime;
    const newEndTime = new Date(currentEndTime.getTime() + secondsToAdd * 1000);
    set({ endTime: newEndTime });
    get().updateTimer();
  },

  removeTime: (minutes: number) => {
    const secondsToRemove = minutes * 60;
    const currentEndTime = get().endTime;
    const newEndTime = new Date(currentEndTime.getTime() - secondsToRemove * 1000);
    set({ endTime: newEndTime });
    get().updateTimer();
  },

  updateTimer: () => {
    const now = new Date();
    const endTime = get().endTime;

    // If paused, use the lastUpdate time instead of current time
    const currentTime = get().isPaused ? get().lastUpdate : now.getTime();
    const diff = Math.max(0, endTime.getTime() - currentTime);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    set({ days, hours, minutes, seconds });
  }
}));
