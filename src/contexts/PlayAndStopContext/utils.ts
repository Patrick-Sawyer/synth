import { Filter } from "../../audioUnits/Filter";
import { Oscillator } from "../../audioUnits/Oscillator";
import { AudioUnit, AudioUnitTypes } from "../../audioUnits/types";
import { GridNote } from "../../components/Sequencer/Note";
import { NOTES } from "../../components/Sequencer/notes";
import { FullConnection } from "../ConnectionContext";
import { SequencerContextType } from "../SequencerContext";

export type AudioUnitWithEnvConnections = AudioUnit & {
  connectedUnits?: Array<AudioUnit>;
};

export interface ScheduledNotes {
  grid1?: GridNote | "stop";
  grid2?: GridNote | "stop";
  grid3?: GridNote | "stop";
}

interface FindUnitsArgs {
  audioUnits: Array<AudioUnitWithEnvConnections>;
  connections: Array<FullConnection>;
}

interface PlayAtIndexArgs {
  index: number;
  grid: Array<GridNote>;
  loop: number;
}

export const playNote = (
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

export const bpmToMS = (bpm: number): number => {
  return 15000 / bpm;
};

export const getPriorityNoteAtIndex = ({
  grid,
  index,
  loop,
}: PlayAtIndexArgs): GridNote | undefined => {
  const loopLength = 16 * loop;
  const positionInLoop = index % loopLength;
  const sorted = grid.sort(byFreq).sort(byStart);
  const noteNow = sorted.filter((note) => note.start === positionInLoop)?.[0];

  if (noteNow) return noteNow;

  return sorted
    .filter(
      (note) =>
        note.start <= positionInLoop &&
        (note.start + note.length) % loopLength > positionInLoop
    )
    .sort(byFreq)
    .sort(byStart)?.[0];
};

const byStart = (a: GridNote, b: GridNote) =>
  a.start < b.start ? 1 : a.start > b.start ? -1 : 0;

const byFreq = (a: GridNote, b: GridNote) =>
  a.note < b.note ? 1 : a.note > b.note ? -1 : 0;

export const findUnits = ({ audioUnits, connections }: FindUnitsArgs) => {
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

export const getEnvelopes = (
  units: Array<AudioUnit>,
  connections: Array<FullConnection>
): Array<AudioUnit> => {
  return units.map((unit) => {
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

      unitToReturn.connectedUnits = units.filter((unit) => {
        return conns.includes(unit.unitKey);
      });
    }

    return unitToReturn;
  });
};

export const getIndex = (index: number, loop: number) => {
  return index + 1 >= loop * 16 ? 0 : index + 1;
};

export const getNotesAtIndex = (
  index: number,
  sequencer: SequencerContextType
) => {
  const {
    seqOneLoop,
    seqTwoLoop,
    seqThreeLoop,
    seqOneGridNotes,
    seqTwoGridNotes,
    seqThreeGridNotes,
  } = sequencer;

  return {
    gridOneNote: getPriorityNoteAtIndex({
      grid: seqOneGridNotes,
      index,
      loop: seqOneLoop,
    }),
    gridTwoNote: getPriorityNoteAtIndex({
      grid: seqTwoGridNotes,
      index,
      loop: seqTwoLoop,
    }),
    gridThreeNote: getPriorityNoteAtIndex({
      grid: seqThreeGridNotes,
      index,
      loop: seqThreeLoop,
    }),
  };
};
