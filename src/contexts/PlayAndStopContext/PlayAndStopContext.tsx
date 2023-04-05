import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  bpmToMS,
  findUnits,
  getEnvelopes,
  getNotesAtIndex,
  playNote,
} from "./utils";
import { useAudioUnitContext } from "../AudioUnitContext";
import { useConnectionContext } from "../ConnectionContext";
import { useSequencerContext } from "../SequencerContext";
import { CONTEXT, MAIN_OUT } from "../../App";
import { ZERO } from "../../audioUnits/BaseUnit";
import { AudioUnitTypes } from "../../audioUnits/types";
import { Oscillator } from "../../audioUnits/Oscillator";
import { Filter } from "../../audioUnits/Filter";

interface Props {
  children: React.ReactNode;
}

interface CurrentNotes {
  gridOne?: string;
  gridTwo?: string;
  gridThree?: string;
}

const INIT_CURRENT_NOTES = {
  gridOne: undefined,
  gridTwo: undefined,
  gridThree: undefined,
};

interface PlayAndStopContextType {
  startModular: () => void;
  stopModular: (onComplete?: () => void) => void;
}

const PlayAndStopContext = createContext<PlayAndStopContextType>({
  startModular: () => null,
  stopModular: () => null,
});

export const PlayAndStopContextProvider = ({ children }: Props) => {
  const audioUnits = useAudioUnitContext();
  const { connections } = useConnectionContext();
  const unitsWithEnvelopeConnections = getEnvelopes(audioUnits, connections);
  const sequencer = useSequencerContext();
  const [timerIndex, setTimerIndex] = useState(0);
  const timeout = useRef<NodeJS.Timeout>();
  const lastPlayedIndex = useRef<number>();
  const currentNotes = useRef<CurrentNotes>(INIT_CURRENT_NOTES);

  const { gridOneUnits, gridTwoUnits, gridThreeUnits } = findUnits({
    audioUnits: unitsWithEnvelopeConnections,
    connections,
  });

  const nextNotes = useRef(getNotesAtIndex(0, sequencer));

  const playScheduledNotes = useCallback(
    (index: number) => {
      const { gridOneNote, gridTwoNote, gridThreeNote } =
        index === 0 ? getNotesAtIndex(0, sequencer) : nextNotes.current;

      if (currentNotes.current.gridOne !== gridOneNote?.noteKey) {
        playNote(gridOneUnits, gridOneNote || "stop");
        currentNotes.current.gridOne = gridOneNote?.noteKey;
      }

      if (currentNotes.current.gridTwo !== gridTwoNote?.noteKey) {
        playNote(gridTwoUnits, gridTwoNote || "stop");
        currentNotes.current.gridTwo = gridTwoNote?.noteKey;
      }

      if (currentNotes.current.gridThree !== gridThreeNote?.noteKey) {
        playNote(gridThreeUnits, gridThreeNote || "stop");
        currentNotes.current.gridThree = gridThreeNote?.noteKey;
      }

      const ms = bpmToMS(sequencer.tempo);

      timeout.current = setTimeout(() => {
        setTimerIndex(timerIndex + 1);
      }, ms);

      nextNotes.current = getNotesAtIndex(index + 1, sequencer);
    },
    [gridOneUnits, gridThreeUnits, gridTwoUnits, sequencer, timerIndex]
  );

  const startModular = () => {
    if (timeout.current) return;
    MAIN_OUT.node.gain.cancelAndHoldAtTime(0);
    MAIN_OUT.node.gain.cancelScheduledValues(0);
    MAIN_OUT.node.gain.linearRampToValueAtTime(1, CONTEXT.currentTime + 0.01);
    playScheduledNotes(0);
  };

  const stopModular = (onComplete?: () => void) => {
    clearTimeout(timeout.current);
    timeout.current = undefined;
    setTimerIndex(0);
    lastPlayedIndex.current = undefined;
    currentNotes.current = INIT_CURRENT_NOTES;
    MAIN_OUT.node.gain.cancelAndHoldAtTime(0);
    MAIN_OUT.node.gain.cancelScheduledValues(0);
    MAIN_OUT.node.gain.linearRampToValueAtTime(
      ZERO,
      CONTEXT.currentTime + 0.01
    );

    setTimeout(() => {
      audioUnits.forEach((unit) => {
        if (unit.type === AudioUnitTypes.OSCILLATOR) {
          const osc = unit as Oscillator;
          osc.oscillator.detune.value = osc.detune;
          osc.sustaining = true;
        } else if (unit.type === AudioUnitTypes.FILTER) {
          const filter = unit as Filter;
          filter.filter.frequency.value = filter.frequency;
          filter.sustaining = true;
        }
      });

      onComplete && onComplete();
    }, 100);
  };

  useEffect(() => {
    if (
      timerIndex > 0 &&
      timerIndex !== lastPlayedIndex.current &&
      timeout.current
    ) {
      lastPlayedIndex.current = timerIndex;
      playScheduledNotes(timerIndex);
    }
  }, [playScheduledNotes, timerIndex]);

  return (
    <PlayAndStopContext.Provider value={{ startModular, stopModular }}>
      {children}
    </PlayAndStopContext.Provider>
  );
};

export const usePlayAndStopContext = () => useContext(PlayAndStopContext);
