import { memo, useState } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { GridNote } from "./Note";
import { NOTES } from "./notes";
import { Notes } from "./NotesComponent";

export const ROW_HEIGHT = 10;

export function Grid() {
  const [gridNotes, setGridNotes] = useState<Array<GridNote>>([]);

  const deleteNotes = () => {
    setGridNotes([]);
  };

  return (
    <OuterWrapper>
      <Wrapper>
        <img
          src="images/piano.png"
          alt="Piano"
          width="50px"
          height={ROW_HEIGHT * 43 + "px"}
        />
        <NoteNames>
          {NOTES.map((note) => {
            return <NoteName key={note.name}>{note.name}</NoteName>;
          })}
        </NoteNames>
        <Scroll>
          <Main>
            {NOTES.map((note, index) => (
              <Row {...note} key={index} />
            ))}
            <Columns />
            <Notes gridNotes={gridNotes} setGridNotes={setGridNotes} />
          </Main>
        </Scroll>
      </Wrapper>

      <Bottom>
        <Button onClick={deleteNotes} id={"here"}>
          {"Delete all notes"}
        </Button>
      </Bottom>
    </OuterWrapper>
  );
}

const NoteNames = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 430px;
  width: 25px;
  padding-left: 5px;
`;

const Scroll = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
`;

const OuterWrapper = styled.div`
  height: 470px;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const Button = styled.span`
  font-size: 14px;
  color: white;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &:active {
    opacity: 0.5;
  }
`;

const Bottom = styled.div`
  position: absolute;
  bottom: 4px;
  left: calc(50% - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  overflow-y: scroll;
  height: 430px;
  position: relative;
  flex: 1;
  border-radius: 2px;
  width: 1991px;
`;

const Main = styled.div`
  height: ${ROW_HEIGHT * 43 + "px"};
  margin-left: 10px;
  width: 2600px;
  position: relative;
  margin-right: 30px;
  display: flex;
  gap: 1px;
  flex-direction: column;
`;

const RowComponent = styled.div`
  flex: 1;
  display: flex;
`;

interface RowProps {
  name: string;
}

const Row = memo(({ name }: RowProps) => {
  return (
    <RowComponent>
      <GridRow />
    </RowComponent>
  );
});

const GridRow = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  width: 1792px;
  flex: 1;
`;

const NoteName = styled.span`
  color: #828282;
  width: 25px;
  line-height: 0;
  width: 30px;
  display: flex;
  align-items: center;
  padding-left: 1px;
  justify-content: left;
  font-size: 9px;
  font-weight: 600;
  flex: 1;
`;

const Columns = memo(() => {
  const columns = new Array(128).fill(null);

  return (
    <ColumnComponent>
      {columns.map((_, index) => (
        <Column key={index} />
      ))}
    </ColumnComponent>
  );
});

const ColumnComponent = styled.div`
  height: ${ROW_HEIGHT * 43}px;
  width: 1792px;
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  cursor: pointer;
  border-left: 1px solid #c9c9c9;
  border-right: 1px solid #c9c9c9;

  div:nth-child(4n) {
    border-right: 1px solid #646464;
  }

  div:nth-child(16n) {
    border-right: 1px solid #c9c9c9;
  }
`;

const Column = styled.div`
  height: 100%;
  flex: 1;
  border-right: 1px solid ${Colors.background};
`;
