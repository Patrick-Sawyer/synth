import { useCallback, useEffect, useRef, useState } from "react";
import { bpmToMS } from "../contexts/PlayAndStopContext/utils";

export const useTimer = (tempo: number) => {
  const interval = useRef<NodeJS.Timeout>();
  const [timerIndex, setTimerIndex] = useState(0);

  const resetTimer = () => {
    setTimerIndex(0);
  };

  const startTimer = useCallback(() => {
    const ms = bpmToMS(tempo);

    interval.current = setInterval(() => {
      setTimerIndex(timerIndex + 1);
    }, ms);
  }, [tempo, timerIndex]);

  const stopTimer = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
  };

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);

      startTimer();
    }
  }, [startTimer, tempo]);

  return { startTimer, stopTimer, resetTimer, timerIndex };
};
