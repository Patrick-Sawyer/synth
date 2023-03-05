import {
  Dispatch,
  memo,
  MouseEventHandler,
  PointerEventHandler,
  SetStateAction,
} from "react";
import styled from "styled-components";

export const CELL_WIDTH = 14;
export const CELL_HEIGHT = 10;

export interface GridNote {
  start: number; // 0 - 127
  length: number; // 0 - 127
  note: number; // 0 - 42
  noteKey: string;
}

interface Props extends GridNote {
  setGridNotes: Dispatch<SetStateAction<Array<GridNote>>>;
  isBeingCreated?: boolean;
}

function NoteComponent({ setGridNotes, ...props }: Props) {
  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const deleteNote = () => {
    setGridNotes((notes) =>
      notes.filter((note) => note.noteKey !== props.noteKey)
    );
  };

  return (
    <Wrapper
      onDoubleClick={deleteNote}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      {...props}
    />
  );
}

const Wrapper = styled.div<GridNote & { isBeingCreated?: boolean }>`
  position: absolute;
  height: 10px;
  width: ${({ length }) => CELL_WIDTH * length - 1}px;
  background-color: #331286;
  bottom: ${({ note }) => CELL_HEIGHT * note}px;
  left: ${({ start }) => start * CELL_WIDTH + 1}px;
  border-radius: 2px;
  border: 1px solid
    ${({ isBeingCreated }) =>
      isBeingCreated ? "white" : " rgba(255, 255, 255, 0.5)"};
  box-sizing: border-box;

  &:hover {
    border: 1px solid white;
  }
`;

export const Note = memo(NoteComponent);
