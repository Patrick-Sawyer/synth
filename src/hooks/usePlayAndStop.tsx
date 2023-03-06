import { useRef } from "react";
import { AudioUnit, AudioUnitTypes } from "../audioUnits/types";
import { GridNote } from "../components/Sequencer/Note";
import { FullConnection } from "../ConnectionContext";

interface Args {
  audioUnits: Array<AudioUnit>;
  gridOne: Array<GridNote>;
  gridTwo: Array<GridNote>;
  gridThree: Array<GridNote>;
  tempo: number;
  connections: Array<FullConnection>;
}

interface ScheduledNotes {
  grid1?: GridNote;
  grid2?: GridNote;
  grid3?: GridNote;
}

export const usePlayAndStop = ({
  audioUnits,
  gridOne,
  gridTwo,
  gridThree,
  tempo,
  connections,
}: Args) => {
  const nextScheduledNotes = useRef<ScheduledNotes>();
  const nextScheduledIndex = useRef(0);
  const timeout = useRef<NodeJS.Timeout>();

  const { gridOneUnits, gridTwoUnits, gridThreeUnits } = findUnits({
    audioUnits,
    connections,
  });

  const scheduleNextNotes = () => {
    const nextNotes = {
      grid1: getNoteAtIndex({
        grid: gridOne,
        index: nextScheduledIndex.current,
      }),
      grid2: getNoteAtIndex({
        grid: gridTwo,
        index: nextScheduledIndex.current,
      }),
      grid3: getNoteAtIndex({
        grid: gridThree,
        index: nextScheduledIndex.current,
      }),
    };
    console.log("SCHEDULING NOTES", nextNotes);
    nextScheduledNotes.current = nextNotes;
  };

  const play = () => {
    console.log("PLAYING");
    const ms = bpmToMS(tempo * 4);
    scheduleNextNotes();
    nextScheduledIndex.current++;
    timeout.current = setTimeout(() => {
      playNote(gridOneUnits, nextScheduledNotes.current?.grid1);
      playNote(gridTwoUnits, nextScheduledNotes.current?.grid2);
      playNote(gridThreeUnits, nextScheduledNotes.current?.grid3);
      if (timeout.current) {
        play();
      }
    }, ms);
  };

  const playModular = () => {
    if (!nextScheduledNotes.current) {
      play();
    }
  };

  const stopModular = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    nextScheduledNotes.current = undefined;
    nextScheduledIndex.current = 0;
  };

  return { playModular, stopModular };
};

const playNote = (units?: Array<AudioUnit | undefined>, note?: GridNote) => {
  console.log("PLAYING NOTE", note);
  if (!note) return;
  units?.forEach((unit: any) => {
    if (!unit) return;

    switch (unit.type) {
      case AudioUnitTypes.OSCILLATOR:
        unit.play(note.note * 8);
        break;
      case AudioUnitTypes.ENVELOPE:
        unit.trigger(note.note);
        break;

      default:
        return;
    }
  });
};

const bpmToMS = (bpm: number): number => {
  return 60000 / bpm;
};

interface PlayAtIndexArgs {
  index: number;
  grid: Array<GridNote>;
}

const getNoteAtIndex = ({ grid, index }: PlayAtIndexArgs) => {
  console.log("grid", grid, "index", index);
  return grid.find((note) => note.start === index);
};

interface FindUnitsArgs {
  audioUnits: Array<AudioUnit>;
  connections: Array<FullConnection>;
}

const findUnits = ({ audioUnits, connections }: FindUnitsArgs) => {
  const gridOneConnections = getConnections(connections, "SEQ_ONE");
  const gridTwoConnections = getConnections(connections, "SEQ_TWO");
  const gridThreeConnections = getConnections(connections, "SEQ_ONE");
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
