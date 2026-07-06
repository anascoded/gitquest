import React, { createContext, useContext, useEffect, useState } from 'react';

const ProgressContext = createContext(null);
const STORAGE_KEY = 'gitquest-progress';

const defaultProgress = {
  completedLevels: [], // e.g. ['M1-L1', 'M1-L2', 'M3-L3']
  currentMission: 'M1',
  currentLevel: 'M1L1',
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultProgress, ...JSON.parse(raw) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadFromStorage);

  // Auto-save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  function completeLevel(levelId) {
    setProgress(prev =>
      prev.completedLevels.includes(levelId)
        ? prev
        : { ...prev, completedLevels: [...prev.completedLevels, levelId] }
    );
  }

  function isLevelComplete(levelId) {
    return progress.completedLevels.includes(levelId);
  }

  function setCurrent(missionId, levelId) {
    setProgress(prev => ({ ...prev, currentMission: missionId, currentLevel: levelId }));
  }

  function setMode(mode) {
    setProgress(prev => ({ ...prev, mode }));
  }

  function resetProgress() {
    setProgress(defaultProgress);
  }

  // Export progress as a downloadable .json file
  function exportProgress() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gitquest-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import progress from a user-selected .json file
  function importProgress(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          setProgress({ ...defaultProgress, ...parsed });
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  const value = {
    progress,
    completeLevel,
    isLevelComplete,
    setCurrent,
    setMode,
    resetProgress,
    exportProgress,
    importProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside a ProgressProvider');
  return ctx;
}