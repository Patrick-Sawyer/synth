import { Dispatch, memo, SetStateAction } from "react";
import styled from "styled-components";
import { usePlayAndStopContext } from "../../contexts/PlayAndStopContext/PlayAndStopContext";
import { Colors } from "../../utils/theme";
import { CELL_WIDTH, GridNote } from "./Note";
import { NOTES } from "./notes";
import { Notes } from "./NotesComponent";

export const ROW_HEIGHT = 10;

const BarsComponent = memo(() => {
  return (
    <Bars>
      {new Array(8).fill(null).map((_, index) => (
        <Bar key={index}>{index + 1}</Bar>
      ))}
    </Bars>
  );
});

interface Props {
  loop: number;
  gridNotes: Array<GridNote>;
  setGridNotes: Dispatch<SetStateAction<Array<GridNote>>>;
  color: string;
}

export function Grid({ loop, gridNotes, setGridNotes, color }: Props) {
  const { timerIndex } = usePlayAndStopContext();

  const position = timerIndex % (loop * 16);

  return (
    <Scroll>
      <PositionIndicator
        background={color}
        style={{
          left: 0,
          transform: `translateX(${position * CELL_WIDTH}px)`,
          transition: position === 0 ? "0s" : "0.2s",
        }}
      />
      <BarsComponent />
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
  );
}

const PositionIndicator = styled.div<{ background: string }>`
  width: 1px;
  background: ${({ background }) => background};
  height: 100%;
  position: absolute;
  z-index: 400;
  opacity: 0.5;
  margin-top: 17px;
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

const Scroll = styled.div`
  padding-top: 10px;
  overflow-x: scroll;
  overflow-y: hidden;
  flex: 1;
  position: relative;

  ::-webkit-scrollbar-track {
    background: red;
  }

  ::-webkit-scrollbar-thumb {
    background: blue;
  }
`;

const Main = styled.div`
  height: ${ROW_HEIGHT * 43 + "px"};
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

const Bar = styled.div`
  width: ${CELL_WIDTH * 16}px;
`;

const Bars = styled.div`
  width: ${CELL_WIDTH * 128}px;
  display: flex;
  font-size: 10px;
  opacity: 0.7;
  color: white;
  margin-bottom: 5px;
  position: relative;
  left: 8px;
  bottom: 8px;
`;
