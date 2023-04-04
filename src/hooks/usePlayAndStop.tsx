import { useRef } from "react";
import { CONTEXT, MAIN_OUT } from "../App";
import { ZERO } from "../audioUnits/BaseUnit";
import { Filter } from "../audioUnits/Filter";
import { Oscillator } from "../audioUnits/Oscillator";
import { AudioUnit, AudioUnitTypes } from "../audioUnits/types";
import { GridNote } from "../components/Sequencer/Note";
import { NOTES } from "../components/Sequencer/notes";
import { useAudioUnitContext } from "../contexts/AudioUnitContext";
import {
  FullConnection,
  useConnectionContext,
} from "../contexts/ConnectionContext";
import { useSequencerContext } from "../contexts/SequencerContext";

interface ScheduledNotes {
  grid1?: GridNote | "stop";
  grid2?: GridNote | "stop";
  grid3?: GridNote | "stop";
}
// TODO: GET IT TO WORK WITH UPDATING ARGUMENTS

type AudioUnitWithEnvConnections = AudioUnit & {
  connectedUnits?: Array<AudioUnit>;
};

export const usePlayAndStop = () => {
  const audioUnits = useAudioUnitContext();
  const { connections } = useConnectionContext();
  const {
    seqOneLoop,
    seqTwoLoop,
    seqThreeLoop,
    seqOneGridNotes,
    seqTwoGridNotes,
    seqThreeGridNotes,
    tempo,
  } = useSequencerContext();

  const unitsWithEnvelopeConnections = audioUnits.map((unit) => {
    const unitToReturn: AudioUnitWithEnvConnections = {
      ...unit,
    };

    if (unit.type === AudioUnitTypes.ENVELOPE) {
      const conns = connections
        .filter((conn) => {
          return (
            conn.from.unitKey === unit.unitKey &&
            conn.from.connectionKey === "envOut"
          );
        })
        .map((conn) => conn.to.unitKey);

      unitToReturn.connectedUnits = audioUnits.filter((unit) => {
        return conns.includes(unit.unitKey);
      });
    }

    return unitToReturn;
  });

  const nextScheduledNotes = useRef<ScheduledNotes>();
  const nextScheduledIndexSequencerOne = useRef(0);
  const nextScheduledIndexSequencerTwo = useRef(0);
  const nextScheduledIndexSequencerThree = useRef(0);

  const timeout = useRef<NodeJS.Timeout>();
  const { gridOneUnits, gridTwoUnits, gridThreeUnits } = findUnits({
    audioUnits: unitsWithEnvelopeConnections,
    connections,
  });

  const scheduleNextNotes = () => {
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
  };

  const calculateNextIndex = () => {
    nextScheduledIndexSequencerOne.current =
      nextScheduledIndexSequencerOne.current + 1 >= seqOneLoop * 16
        ? 0
        : nextScheduledIndexSequencerOne.current + 1;
    nextScheduledIndexSequencerTwo.current =
      nextScheduledIndexSequencerTwo.current + 1 >= seqTwoLoop * 16
        ? 0
        : nextScheduledIndexSequencerTwo.current + 1;
    nextScheduledIndexSequencerThree.current =
      nextScheduledIndexSequencerThree.current + 1 >= seqThreeLoop * 16
        ? 0
        : nextScheduledIndexSequencerThree.current + 1;
  };

  const play = () => {
    const ms = bpmToMS(tempo * 4);
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
  };

  const playModular = () => {
    MAIN_OUT.node.gain.cancelAndHoldAtTime(0);
    MAIN_OUT.node.gain.cancelScheduledValues(0);
    MAIN_OUT.node.gain.linearRampToValueAtTime(1, CONTEXT.currentTime + 0.01);

    if (!nextScheduledNotes.current) {
      play();
    }
  };

  const stopModular = (onComplete?: () => void) => {
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
  };

  return { playModular, stopModular };
};

const playNote = (
  units?: Array<AudioUnit | undefined>,
  note?: GridNote | "stop"
) => {
  if (!note) return;

  units?.forEach((unit: any) => {
    if (!unit) return;
    switch (unit.type) {
      case AudioUnitTypes.OSCILLATOR:
        if (note && note !== "stop") {
          unit.play(NOTES[note.note].freq);
        }
        break;
      case AudioUnitTypes.ENVELOPE:
        unit.trigger(note === "stop" ? "stop" : "start");

        unit.connectedUnits?.forEach((connectedUnit: Filter | Oscillator) => {
          if (note !== "stop") {
            connectedUnit.triggerEnvelope &&
              connectedUnit.triggerEnvelope(
                unit.attack,
                unit.decay,
                unit.sustain
              );
          } else {
            connectedUnit.triggerRelease &&
              connectedUnit.triggerRelease(unit.release);
          }
        });

        break;
      default:
        break;
    }
  });
};

const bpmToMS = (bpm: number): number => {
  return 60000 / bpm;
};

interface PlayAtIndexArgs {
  index: number;
  grid: Array<GridNote>;
  loop: number;
}

const getNoteAtIndex = ({
  grid,
  index,
  loop,
}: PlayAtIndexArgs): GridNote | undefined | "stop" => {
  const noteToPlay = grid.find((note) => note.start === index);
  if (noteToPlay) return noteToPlay;

  const stop = grid.find((note) => {
    const end = (note.start + note.length + 1) % (loop * 16);

    return end === index;
  });

  if (stop) return "stop";
};

interface FindUnitsArgs {
  audioUnits: Array<AudioUnitWithEnvConnections>;
  connections: Array<FullConnection>;
}

const findUnits = ({ audioUnits, connections }: FindUnitsArgs) => {
  const gridOneConnections = getConnections(connections, "SEQ_ONE");
  const gridTwoConnections = getConnections(connections, "SEQ_TWO");
  const gridThreeConnections = getConnections(connections, "SEQ_THREE");
  const gridOneUnits = getUnits(gridOneConnections, audioUnits);
  const gridTwoUnits = getUnits(gridTwoConnections, audioUnits);
  const gridThreeUnits = getUnits(gridThreeConnections, audioUnits);

  return { gridOneUnits, gridTwoUnits, gridThreeUnits };
};

const getConnections = (connections: Array<FullConnection>, key: string) => {
  return connections.filter((conn) => conn.from.unitKey === key);
};

const getUnits = (
  connections: Array<FullConnection>,
  audioUnits: Array<AudioUnit>
) => {
  return connections.map((conn) =>
    audioUnits.find((unit) => unit.unitKey === conn.to.unitKey)
  );
};
