import { useEffect } from 'react';
import { useTimerStore } from '../stores/useTimerStore';

export const Timer = () => {
  const { days, hours, minutes, seconds, updateTimer } = useTimerStore();

  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  return (
    <div className="timer">
      <span>{days.toString().padStart(2, '0')}</span>:
      <span>{hours.toString().padStart(2, '0')}</span>:
      <span>{minutes.toString().padStart(2, '0')}</span>:
      <span>{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
};
