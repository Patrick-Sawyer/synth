import { Filter } from "../../audioUnits/Filter";
import { Oscillator } from "../../audioUnits/Oscillator";
import { AudioUnit, AudioUnitTypes } from "../../audioUnits/types";
import { GridNote } from "../../components/Sequencer/Note";
import { NOTES } from "../../components/Sequencer/notes";
import { FullConnection } from "../ConnectionContext";

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
  return 60000 / bpm;
};

export const getNoteAtIndex = ({
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
