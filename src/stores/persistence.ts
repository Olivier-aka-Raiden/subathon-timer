interface TimerPersistentState {
    endTime: string;
    isPaused: boolean;
    lastUpdate: number;
}

const STORAGE_KEY = 'subathon-timer-state';

export const persistenceStore = {
    saveState: (state: TimerPersistentState): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save timer state:', error);
        }
    },

    loadState: (): TimerPersistentState | null => {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (!savedState) return null;

            const parsedState = JSON.parse(savedState);
            return {
                endTime: parsedState.endTime,
                isPaused: parsedState.isPaused,
                lastUpdate: parsedState.lastUpdate
            };
        } catch (error) {
            console.error('Failed to load timer state:', error);
            return null;
        }
    },

    clearState: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear timer state:', error);
        }
    }
};
