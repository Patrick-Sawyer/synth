import { Dispatch, memo, SetStateAction } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { CELL_WIDTH, GridNote } from "./Note";
import { NOTES } from "./notes";
import { Notes } from "./NotesComponent";

export const ROW_HEIGHT = 10;

interface Props {
  loop: number;
  setLoop: Dispatch<SetStateAction<number>>;
  gridNotes: Array<GridNote>;
  setGridNotes: Dispatch<SetStateAction<Array<GridNote>>>;
  color: string;
}

export function Grid({ loop, setLoop, gridNotes, setGridNotes, color }: Props) {
  const deleteNotes = () => {
    setGridNotes([]);
  };

  const handleLoopClick = () => {
    setLoop(loop === 8 ? 1 : loop + 1);
  };

  return (
    <GridOuterWrapper>
      <GridWrapper>
        <img
          src="images/piano.png"
          alt="Piano"
          width="50px"
          height={ROW_HEIGHT * 43 + "px"}
          style={{
            position: "relative",
            top: "10px",
          }}
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
            <LoopMarker backgroundColor={color} loop={loop} />
            <Columns />
            <Notes
              color={color}
              gridNotes={gridNotes}
              setGridNotes={setGridNotes}
            />
          </Main>
        </Scroll>
      </GridWrapper>
      <Bottom>
        <LoopText
          textColor={color}
          onClick={handleLoopClick}
        >{`LOOP: ${loop} bars`}</LoopText>
        <Button onClick={deleteNotes} id={"here"}>
          {"Delete all notes"}
        </Button>
      </Bottom>
    </GridOuterWrapper>
  );
}

const LoopText = styled.span<{
  textColor: string;
}>`
  color: ${({ textColor }) => textColor};
  font-size: 14px;
  position: relative;
  top: 5px;

  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: white;
  }

  &:active {
    color: white;
    opacity: 0.5;
  }
`;

const LoopMarker = styled.div<{
  loop: number;
  backgroundColor: string;
}>`
  width: ${({ loop }) => loop * 16 * CELL_WIDTH}px;
  height: 5px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 1.5px;
  position: absolute;
  top: -10px;
  left: 0px;
`;

const NoteNames = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 430px;
  width: 25px;
  padding-left: 5px;
  position: relative;
  top: 10px;
`;

const Scroll = styled.div`
  padding-top: 10px;
  overflow-x: scroll;
  overflow-y: hidden;
  flex: 1;
`;

const GridOuterWrapper = styled.div`
  height: 470px;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const Button = styled.span`
  font-size: 14px;
  color: white;
  opacity: 0.5;
  position: relative;
  top: 5px;

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
  width: calc(100% - 30px);
  bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GridWrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: 440px;
  position: relative;
  flex: 1;
  border-radius: 2px;
`;

const Main = styled.div`
  height: ${ROW_HEIGHT * 43 + "px"};
  margin-left: 10px;
  flex: 1;
  position: relative;
  margin-right: 30px;
  display: flex;
  gap: 1px;
  flex-direction: column;
`;

const RowComponent = styled.div`
  flex: 1;
  display: flex;
  width: 1850px;
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
