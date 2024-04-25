import { useState } from 'react';

const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]);
  const lastModeInHistory = history[history.length - 1];

  const transition = (mode, replace = false) => {
    if (replace) return setHistory((prev) => [...prev.slice(0, -1), mode]);
    setHistory((prev) => [...prev, mode]);
  };
  const back = () => {
    if (history.length > 1) setHistory((prev) => [...prev.slice(0, -1)]);
  };

  return { mode: lastModeInHistory, transition, back };
};

export default useVisualMode;
