import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { Collapsible } from "./Collapsible";
import { Grid, ROW_HEIGHT } from "./Grid";
import { GridNote } from "./Note";
import { NOTES } from "./notes";

interface Props {
  seqOneGridNotes: Array<GridNote>;
  seqTwoGridNotes: Array<GridNote>;
  seqThreeGridNotes: Array<GridNote>;
  setSeqOneGridNotes: Dispatch<SetStateAction<Array<GridNote>>>;
  setSeqTwoGridNotes: Dispatch<SetStateAction<Array<GridNote>>>;
  setSeqThreeGridNotes: Dispatch<SetStateAction<Array<GridNote>>>;
  seqOneLoop: number;
  seqTwoLoop: number;
  seqThreeLoop: number;
  setSeqOneLoop: Dispatch<SetStateAction<number>>;
  setSeqTwoLoop: Dispatch<SetStateAction<number>>;
  setSeqThreeLoop: Dispatch<SetStateAction<number>>;
}

const COLORS = [
  Colors.sequencerOneColor,
  Colors.sequencerTwoColor,
  Colors.sequencerThreeColor,
];

export function Sequencer({
  seqOneGridNotes,
  seqTwoGridNotes,
  seqThreeGridNotes,
  setSeqOneGridNotes,
  setSeqTwoGridNotes,
  setSeqThreeGridNotes,
  seqOneLoop,
  seqTwoLoop,
  seqThreeLoop,
  setSeqOneLoop,
  setSeqTwoLoop,
  setSeqThreeLoop,
}: Props) {
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
      <Collapsible title={"SEQUENcERS"}>
        <Line />
        <Selector>
          <Option
            color={Colors.sequencerOneColor}
            onClick={() => {
              setActiveSeq(0);
            }}
            active={activeSeq === 0}
          >
            {"Sequencer One"}
          </Option>
          <Option
            color={Colors.sequencerTwoColor}
            onClick={() => {
              setActiveSeq(1);
            }}
            active={activeSeq === 1}
          >
            {"Sequencer Two"}
          </Option>
          <Option
            color={Colors.sequencerThreeColor}
            onClick={() => {
              setActiveSeq(2);
            }}
            active={activeSeq === 2}
          >
            {"Sequencer Three"}
          </Option>
        </Selector>
        <Line />
        <GridOuterWrapper>
          <GridWrapper>
            <img
              src="images/piano.png"
              alt="Piano"
              width="50px"
              height={ROW_HEIGHT * 43 + "px"}
              style={{
                position: "relative",
                top: "26px",
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

const Line = styled.div`
  width: calc(100% - 30px);
  margin-bottom: 20px;
  border-top: 1px solid white;
  opacity: 0.1;
`;

const Option = styled.div<{ active: boolean; color: string }>`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  color: ${({ color, active }) =>
    active ? color : "rgba(255, 255, 255, 0.2)"};
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 5px 15px;
  line-height: 0;
  min-height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  cursor: pointer;

  ${({ active }) =>
    active &&
    `
      -webkit-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
      -moz-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
      box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
  `}

  &:hover {
    opacity: 1;
    -webkit-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
    border: 1.5px solid rgba(255, 255, 255, 0.4);
  }
`;

const Selector = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-bottom: 20px;
  margin-right: 30px;
  gap: 10px;

  @media screen and (min-width: 500px) {
    flex-direction: row;
  }
`;

const SequencerWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  gap: 5px;
  padding: 5px 10px 10px 10px;
`;

const GridOuterWrapper = styled.div`
  height: 515px;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const Button = styled.span`
  font-size: 14px;
  color: white;
  text-align: center;
  opacity: 0.5;

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
  text-align: center;
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
  top: 26px;
`;

const Bottom = styled.div`
  height: 45px;
  gap: 20px;
  width: calc(100% - 30px);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GridWrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: 480px;
  position: relative;
  flex: 1;
  border-radius: 2px;
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
