import { createContext, useCallback, useContext, useRef } from "react";
import { CONTEXT, MAIN_OUT } from "../../App";
import { ZERO } from "../../audioUnits/BaseUnit";
import { Filter } from "../../audioUnits/Filter";
import { Oscillator } from "../../audioUnits/Oscillator";
import { AudioUnitTypes } from "../../audioUnits/types";
import { useAudioUnitContext } from "../AudioUnitContext";
import { useConnectionContext } from "../ConnectionContext";
import { useSequencerContext } from "../SequencerContext";
import {
  bpmToMS,
  findUnits,
  getEnvelopes,
  getIndex,
  getNoteAtIndex,
  playNote,
  ScheduledNotes,
} from "./utils";

interface PlayAndStopContextType {
  playModular: () => void;
  stopModular: (onComplete?: () => void) => void;
}

const PlayAndStopContext = createContext<PlayAndStopContextType>({
  playModular: () => null,
  stopModular: () => null,
});

export const PlayAndStopContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const timeout = useRef<NodeJS.Timeout>();
  const nextScheduledNotes = useRef<ScheduledNotes>();
  const nextScheduledIndexSequencerOne = useRef(0);
  const nextScheduledIndexSequencerTwo = useRef(0);
  const nextScheduledIndexSequencerThree = useRef(0);
  const audioUnits = useAudioUnitContext();
  const { connections } = useConnectionContext();
  const unitsWithEnvelopeConnections = getEnvelopes(audioUnits, connections);

  const { gridOneUnits, gridTwoUnits, gridThreeUnits } = findUnits({
    audioUnits: unitsWithEnvelopeConnections,
    connections,
  });

  const {
    seqOneLoop,
    seqTwoLoop,
    seqThreeLoop,
    seqOneGridNotes,
    seqTwoGridNotes,
    seqThreeGridNotes,
    tempo,
  } = useSequencerContext();

  const ms = bpmToMS(tempo * 4);

  const scheduleNextNotes = useCallback(() => {
    const nextNotes = {
      grid1: getNoteAtIndex({
        grid: seqOneGridNotes,
        index: nextScheduledIndexSequencerOne.current,
        loop: seqOneLoop,
      }),
      grid2: getNoteAtIndex({
        grid: seqTwoGridNotes,
        index: nextScheduledIndexSequencerTwo.current,
        loop: seqTwoLoop,
      }),
      grid3: getNoteAtIndex({
        grid: seqThreeGridNotes,
        index: nextScheduledIndexSequencerThree.current,
        loop: seqThreeLoop,
      }),
    };

    nextScheduledNotes.current = nextNotes;
  }, [
    seqOneGridNotes,
    seqOneLoop,
    seqThreeGridNotes,
    seqThreeLoop,
    seqTwoGridNotes,
    seqTwoLoop,
  ]);

  const calculateNextIndex = useCallback(() => {
    nextScheduledIndexSequencerOne.current = getIndex(
      nextScheduledIndexSequencerOne.current,
      seqOneLoop
    );
    nextScheduledIndexSequencerTwo.current = getIndex(
      nextScheduledIndexSequencerTwo.current,
      seqTwoLoop
    );
    nextScheduledIndexSequencerThree.current = getIndex(
      nextScheduledIndexSequencerThree.current,
      seqThreeLoop
    );
  }, [seqOneLoop, seqThreeLoop, seqTwoLoop]);

  const play = useCallback(() => {
    scheduleNextNotes();
    calculateNextIndex();
    playNote(gridOneUnits, nextScheduledNotes.current?.grid1);
    playNote(gridTwoUnits, nextScheduledNotes.current?.grid2);
    playNote(gridThreeUnits, nextScheduledNotes.current?.grid3);
    timeout.current = setTimeout(() => {
      if (timeout.current) {
        play();
      }
    }, ms);
  }, [
    calculateNextIndex,
    gridOneUnits,
    gridThreeUnits,
    gridTwoUnits,
    ms,
    scheduleNextNotes,
  ]);

  const playModular = useCallback(() => {
    MAIN_OUT.node.gain.cancelAndHoldAtTime(0);
    MAIN_OUT.node.gain.cancelScheduledValues(0);
    MAIN_OUT.node.gain.linearRampToValueAtTime(1, CONTEXT.currentTime + 0.01);

    if (!nextScheduledNotes.current) {
      play();
    }
  }, [play]);

  const stopModular = useCallback(
    (onComplete?: () => void) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      nextScheduledNotes.current = undefined;
      nextScheduledIndexSequencerOne.current = 0;
      nextScheduledIndexSequencerTwo.current = 0;
      nextScheduledIndexSequencerThree.current = 0;
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
    },
    [audioUnits]
  );

  return (
    <PlayAndStopContext.Provider value={{ playModular, stopModular }}>
      {children}
    </PlayAndStopContext.Provider>
  );
};

export const usePlayAndStopContext = () => useContext(PlayAndStopContext);
