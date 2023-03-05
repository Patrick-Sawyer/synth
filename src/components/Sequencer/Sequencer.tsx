import { Dispatch, memo, SetStateAction, useState } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { Collapsible } from "./Collapsible";
import { Grid, ROW_HEIGHT } from "./Grid";
import { CELL_WIDTH, GridNote } from "./Note";
import { NOTES } from "./notes";

interface Props {
  playNote: (freq?: number) => void;
}

const COLORS = [
  Colors.sequencerOneColor,
  Colors.sequencerTwoColor,
  Colors.sequencerThreeColor,
];

export function Sequencer({ playNote }: Props) {
  const [seqOneGridNotes, setSeqOneGridNotes] = useState<Array<GridNote>>([]);
  const [seqTwoGridNotes, setSeqTwoGridNotes] = useState<Array<GridNote>>([]);
  const [seqThreeGridNotes, setSeqThreeGridNotes] = useState<Array<GridNote>>(
    []
  );
  const [seqOneLoop, setSeqOneLoop] = useState<number>(2);
  const [seqTwoLoop, setSeqTwoLoop] = useState<number>(2);
  const [seqThreeLoop, setSeqThreeLoop] = useState<number>(2);

  const [activeSeq, setActiveSeq] = useState(0);

  const color = COLORS[activeSeq];
  const loops = [seqOneLoop, seqTwoLoop, seqThreeLoop];
  const loop = loops[activeSeq];

  const deleteNotes = () => {
    if (activeSeq === 0) {
      setSeqOneGridNotes([]);
    } else if (activeSeq === 1) {
      setSeqTwoGridNotes([]);
    } else if (activeSeq === 2) {
      setSeqThreeGridNotes([]);
    }
  };

  const setLoops: Array<Dispatch<SetStateAction<number>>> = [
    setSeqOneLoop,
    setSeqTwoLoop,
    setSeqThreeLoop,
  ];

  const handleLoopClick = () => {
    const setLoop = setLoops[activeSeq];
    setLoop(loop < 8 ? loop + 1 : 1);
  };

  return (
    <SequencerWrapper>
      <Collapsible title={"SEQUENZERS"}>
        <Selector>
          <Option
            onClick={() => {
              setActiveSeq(0);
            }}
            active={activeSeq === 0}
          >
            {"Sequencer One"}
          </Option>
          <Option
            onClick={() => {
              setActiveSeq(1);
            }}
            active={activeSeq === 1}
          >
            {"Sequencer Two"}
          </Option>
          <Option
            onClick={() => {
              setActiveSeq(2);
            }}
            active={activeSeq === 2}
          >
            {"Sequencer Three"}
          </Option>
        </Selector>
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
            {activeSeq === 0 && (
              <Grid
                loop={seqOneLoop}
                gridNotes={seqOneGridNotes}
                setGridNotes={setSeqOneGridNotes}
                color={color}
              />
            )}
            {activeSeq === 1 && (
              <Grid
                loop={seqTwoLoop}
                gridNotes={seqTwoGridNotes}
                setGridNotes={setSeqTwoGridNotes}
                color={color}
              />
            )}
            {activeSeq === 2 && (
              <Grid
                loop={seqThreeLoop}
                gridNotes={seqThreeGridNotes}
                setGridNotes={setSeqThreeGridNotes}
                color={color}
              />
            )}
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
      </Collapsible>
    </SequencerWrapper>
  );
}

const Option = styled.span<{ active: boolean }>`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  color: white;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  text-align: center;

  text-decoration: ${({ active }) => (active ? "underline" : "none")};

  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &:active {
    opacity: 0.5;
  }
`;

const Selector = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 20px;
  margin-right: 20px;
  gap: 10px;
`;

const SequencerWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  gap: 5px;
  padding: 0 5px 10px 5px;
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

const NoteNames = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 430px;
  width: 25px;
  padding-left: 5px;
  position: relative;
  top: 10px;
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

const Row = memo(() => {
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
