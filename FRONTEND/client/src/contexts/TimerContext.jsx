// src/contexts/TimerContext.jsx

import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { endSeance } from '../utils/seanceService';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [phase, setPhase] = useState('idle');
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeElapsedTotal, setTimeElapsedTotal] = useState(0);
  const [pomodoroConfig, setPomodoroConfig] = useState(null);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [interruptions, setInterruptions] = useState(0);
  const intervalRef = useRef(null);
  const [upcomingBreakType, setUpcomingBreakType] = useState('courte');
  const [loaded, setLoaded] = useState(false);

  // --- CORRECTED: Read activeSeanceId from localStorage on initial render ---
  const [activeSeanceId, setActiveSeanceId] = useState(() => {
    // This function runs only once during the initial render.
    return localStorage.getItem("active_seance_id") || null;
  });
  
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
            setPhase((currentPhase) => {
              if (currentPhase === 'study') {
                setPomodoroCount((p) => p + 1);
                return 'awaiting_break';
              } else if (currentPhase === 'break') {
                return 'awaiting_study';
              }
              return currentPhase;
            });
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

  // --- MODIFIED: startSeance now saves the ID to localStorage ---
  const startSeance = useCallback((config, seanceId) => {
    setPomodoroConfig(config);
    setPomodoroCount(0);
    setTimeElapsedTotal(0);
    setInterruptions(0);
    setActiveSeanceId(seanceId);
    if (seanceId) {
      localStorage.setItem("active_seance_id", seanceId);
    }

    const isFirstBreakLong = 1 % config.nbre_pomodoro_avant_pause_longue === 0;
    setUpcomingBreakType(isFirstBreakLong ? 'longue' : 'courte');

    beginPhase('study', config.duree_seance);
  }, []);

  const startBreak = () => {
    if (!pomodoroConfig) return;
    const { duree_pause_courte, duree_pause_longue } = pomodoroConfig;

    const duration = upcomingBreakType === 'longue' ? duree_pause_longue : duree_pause_courte;
    beginPhase('break', duration);
  };

  const resumeStudy = () => {
    if (!pomodoroConfig) return;
    if (pomodoroConfig.duree_seance_totale > 0 && timeElapsedTotal >= pomodoroConfig.duree_seance_totale) {
      setPhase('completed');
      clearTimer();
      return;
    }
    
    const nextPomodoroCount = pomodoroCount + 1;
    const isNextBreakLong = nextPomodoroCount % pomodoroConfig.nbre_pomodoro_avant_pause_longue === 0 && nextPomodoroCount !== 0;
    setUpcomingBreakType(isNextBreakLong ? 'longue' : 'courte');

    beginPhase('study', pomodoroConfig.duree_seance);
  };

  // --- MODIFIED: stopSeance now removes the ID from localStorage ---
  const stopSeance = async () => {
    if (activeSeanceId) {
      try {
        const seanceData = {
          duree_reelle: timeElapsedTotal,
          nbre_pomodoro_effectues: pomodoroCount,
          interruptions: interruptions,
          est_complete: true,
          statut: 'terminee',
        };
        const response = await endSeance(activeSeanceId, seanceData);
        console.log('Séance terminée avec succès:', response);
      } catch (error) {
        console.error("Erreur lors de la fin de la séance :", error);
      }
    }
    clearTimer();
    setPhase('idle');
    setTimeLeft(0);
    setIsPaused(false);
    setPomodoroCount(0);
    setPomodoroConfig(null);
    setTimeElapsedTotal(0);
    setInterruptions(0);
    setUpcomingBreakType('courte');
    setActiveSeanceId(null);
    localStorage.removeItem('active_seance_id'); // <-- REMOVE JUST THE ID KEY
  };

  const pauseTimer = () => {
    clearTimer();
    setIsPaused(true);
    incrementInterruptions();
  };

  const resumeTimer = () => {
    if (!isPaused || timeLeft <= 0 || !pomodoroConfig) return;
    setIsPaused(false);
  };

  const incrementInterruptions = () => setInterruptions(prev => prev + 1);

  // --- MODIFIED: This useEffect now ONLY handles the general timer state, not the seance ID ---
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
        // We no longer load activeSeanceId from here, as it's handled on initial state.
        setInterruptions(data.interruptions || 0);
      } catch (e) {
        console.error('Failed to parse timerState from localStorage', e);
        localStorage.removeItem('timerState');
      }
    }
    setLoaded(true);
  }, []); // Empty dependency array to run only on mount

  // This useEffect saves the entire state, including the ID, which is fine for consistency.
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
        activeSeanceId, // The ID is included here when saving.
        interruptions,
      };
      localStorage.setItem('timerState', JSON.stringify(data));
    }
  }, [phase, isPaused, timeLeft, timeElapsedTotal, pomodoroCount, pomodoroConfig, upcomingBreakType, activeSeanceId, loaded, interruptions]);

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
      activeSeanceId,
      startSeance, // Do not expose setActiveSeanceId, use startSeance/stopSeance
      stopSeance,
      startBreak,
      resumeStudy,
      pauseTimer,
      resumeTimer,
      interruptions,
      incrementInterruptions,
    }}>
      {children}
    </TimerContext.Provider>
  );
};