import {
  Dispatch,
  PointerEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { debounce } from "../../utils/debounce";
import { create_UUID } from "../../utils/guid";
import { GridNote, Note, CELL_WIDTH, CELL_HEIGHT } from "./Note";
import { NOTES } from "./notes";

const GRID_HEIGHT = 43 * CELL_HEIGHT;
const GRID_WIDTH = 128 * CELL_WIDTH;

interface Coord {
  x: number;
  y: number;
}

const outOfBoundaries = (coord: Coord): boolean => {
  return (
    coord.x < 0 ||
    coord.x >= GRID_WIDTH ||
    coord.y < 0 ||
    coord.y >= GRID_HEIGHT
  );
};

const createNote = (from: Coord | null, to: Coord | null): GridNote | null => {
  if (!from || !to) return null;
  if (outOfBoundaries(from) || outOfBoundaries(to)) return null;
  const start = Math.floor(from.x / CELL_WIDTH);
  const end = Math.round(to.x / CELL_WIDTH);
  const length = end - start;
  if (length <= 0) return null;
  const note = NOTES.length - Math.ceil(from.y / CELL_HEIGHT);

  return {
    start,
    length,
    note,
    noteKey: create_UUID(),
  };
};

interface Props {
  gridNotes: Array<GridNote>;
  setGridNotes: Dispatch<SetStateAction<Array<GridNote>>>;
  color: string;
}

export function Notes({ gridNotes, setGridNotes, color }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseDownCoord = useRef<Coord | null>(null);
  const [creatingNote, setCreatingNote] = useState<GridNote | null>();

  const getCoord = (e: any): Coord | null => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    }

    return null;
  };

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    mouseDownCoord.current = getCoord(e);
  };

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = (e) => {
    if (creatingNote) {
      mouseDownCoord.current = null;
      const newNote = { ...creatingNote };
      newNote.noteKey = create_UUID();
      setCreatingNote(null);
      setGridNotes((notes) => [...notes, newNote as unknown as GridNote]);
    }
  };

  const handlePointerLeave = () => {
    mouseDownCoord.current = null;
    setCreatingNote(null);
  };

  useEffect(() => {
    const handlePointerMove = debounce((e) => {
      if (mouseDownCoord.current) {
        const toCoord = getCoord(e);
        const note = createNote(mouseDownCoord.current, toCoord);
        setCreatingNote(note || null);
      }
    }, 100);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <Wrapper
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {gridNotes.map((note) => (
        <Note
          color={color}
          key={note.noteKey}
          {...note}
          setGridNotes={setGridNotes}
        />
      ))}
      {creatingNote && (
        <Note
          color={color}
          key={creatingNote.noteKey}
          {...creatingNote}
          setGridNotes={() => null}
          isBeingCreated
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
`;
