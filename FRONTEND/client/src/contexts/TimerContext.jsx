// src/contexts/TimerContext.jsx
import React, { createContext, useState, useEffect, useRef } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [phase, setPhase] = useState('idle');
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeElapsedTotal, setTimeElapsedTotal] = useState(0);
  const [pomodoroConfig, setPomodoroConfig] = useState(null);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const intervalRef = useRef(null);
  const [upcomingBreakType, setUpcomingBreakType] = useState('courte');
  const [loaded, setLoaded] = useState(false);

  // State to store the active seance ID
  const [activeSeanceId, setActiveSeanceId] = useState(null); // This is defined

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = null;
  };

  useEffect(() => {
    if ((phase === 'study' || phase === 'break') && !isPaused && timeLeft > 0) {
      clearTimer();

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearTimer();
            if (phase === 'study') {
              setPhase('awaiting_break');
              setPomodoroCount((p) => p + 1);
            } else if (phase === 'break') {
              setPhase('awaiting_study');
            }
            return 0;
          }
          return newTime;
        });
        setTimeElapsedTotal((prev) => prev + 1);
      }, 1000);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [phase, isPaused, timeLeft]);

  const beginPhase = (newPhase, duration, pausedState = false) => {
    setPhase(newPhase);
    setTimeLeft(duration);
    setIsPaused(pausedState);
  };

  // UPDATED: startSeance now accepts seanceId
  const startSeance = (config, seanceId) => {
    setPomodoroConfig(config);
    setPomodoroCount(0);
    setTimeElapsedTotal(0);
    setUpcomingBreakType('courte');
    setActiveSeanceId(seanceId); // Store the active seance ID
    beginPhase('study', config.duree_seance);
  };

  const startBreak = () => {
    if (!pomodoroConfig) return;
    const { duree_pause_courte, duree_pause_longue, nbre_pomodoro_avant_pause_longue } = pomodoroConfig;

    const isLong = pomodoroCount % nbre_pomodoro_avant_pause_longue === 0 && pomodoroCount !== 0;
    setUpcomingBreakType(isLong ? 'longue' : 'courte');

    const duration = isLong ? duree_pause_longue : duree_pause_courte;
    beginPhase('break', duration);
  };

  const resumeStudy = () => {
    if (!pomodoroConfig) return;
    if (pomodoroConfig.duree_seance_totale > 0 && timeElapsedTotal >= pomodoroConfig.duree_seance_totale) {
      setPhase('completed');
      clearTimer();
      return;
    }
    beginPhase('study', pomodoroConfig.duree_seance);
  };

  const stopSeance = () => {
    clearTimer();
    setPhase('idle');
    setTimeLeft(0);
    setIsPaused(false);
    setPomodoroCount(0);
    setPomodoroConfig(null);
    setTimeElapsedTotal(0);
    setUpcomingBreakType('courte');
    setActiveSeanceId(null); // Clear the active seance ID
    localStorage.removeItem('timerState');
  };

  const pauseTimer = () => {
    clearTimer();
    setIsPaused(true);
  };

  const resumeTimer = () => {
    if (!isPaused || timeLeft <= 0 || !pomodoroConfig) return;
    setIsPaused(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('timerState');
    if (saved) {
      try {
        const data = JSON.parse(saved);

        setPhase(data.phase || 'idle');
        setIsPaused(data.isPaused || false);
        setTimeLeft(data.timeLeft || 0);
        setTimeElapsedTotal(data.timeElapsedTotal || 0);
        setPomodoroCount(data.pomodoroCount || 0);
        setPomodoroConfig(data.pomodoroConfig || null);
        setUpcomingBreakType(data.upcomingBreakType || 'courte');
        setActiveSeanceId(data.activeSeanceId || null); // Load activeSeanceId
      } catch (e) {
        console.error('Failed to parse timerState from localStorage', e);
        localStorage.removeItem('timerState');
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      const data = {
        phase,
        isPaused,
        timeLeft,
        timeElapsedTotal,
        pomodoroCount,
        pomodoroConfig,
        upcomingBreakType,
        activeSeanceId, // Save activeSeanceId
      };
      localStorage.setItem('timerState', JSON.stringify(data));
    }
  }, [phase, isPaused, timeLeft, timeElapsedTotal, pomodoroCount, pomodoroConfig, upcomingBreakType, activeSeanceId, loaded]);

  useEffect(() => {
    if (loaded && (phase === 'awaiting_break' || phase === 'awaiting_study')) {
      const audio = new Audio('/ringtone/phaseNotification.mp3');
      audio.play().catch(err => {
        console.warn('Notification sound failed to play:', err);
      });
    }
  }, [phase, loaded]);

  return (
    <TimerContext.Provider value={{
      phase,
      isPaused,
      timeLeft,
      timeElapsedTotal,
      pomodoroCount,
      pomodoroConfig,
      upcomingBreakType,
      loaded,
      activeSeanceId, // Expose activeSeanceId
      setActiveSeanceId, // <--- ADDED THIS LINE: Expose setActiveSeanceId
      startSeance,
      stopSeance,
      startBreak,
      resumeStudy,
      pauseTimer,
      resumeTimer
    }}>
      {children}
    </TimerContext.Provider>
  );
};
