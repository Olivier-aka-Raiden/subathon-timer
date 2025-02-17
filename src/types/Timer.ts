export interface TimerState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  endTime: Date;
  isPaused: boolean;
}

export interface TimeAddition {
  type: 'sub' | 'bits' | 'donation' | 'manual';
  amount: number;
  tier?: '1000' | '2000' | '3000';
}

export const SUB_TIER_MINUTES = {
  '1000': 7,   // Tier 1: 7 minutes
  '2000': 15,  // Tier 2: 15 minutes
  '3000': 30   // Tier 3: 30 minutes
} as const;