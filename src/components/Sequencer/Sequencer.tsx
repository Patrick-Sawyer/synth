import { useState } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { Collapsible } from "./Collapsible";
import { Grid } from "./Grid";
import { GridNote } from "./Note";

interface Props {
  playNote: (freq?: number) => void;
}

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
        {activeSeq === 0 && (
          <Grid
            gridNotes={seqOneGridNotes}
            setGridNotes={setSeqOneGridNotes}
            loop={seqOneLoop}
            setLoop={setSeqOneLoop}
            color={Colors.sequencerOneColor}
          />
        )}
        {activeSeq === 1 && (
          <Grid
            gridNotes={seqTwoGridNotes}
            setGridNotes={setSeqTwoGridNotes}
            loop={seqTwoLoop}
            setLoop={setSeqTwoLoop}
            color={Colors.sequencerTwoColor}
          />
        )}
        {activeSeq === 2 && (
          <Grid
            gridNotes={seqThreeGridNotes}
            setGridNotes={setSeqThreeGridNotes}
            loop={seqThreeLoop}
            setLoop={setSeqThreeLoop}
            color={Colors.sequencerThreeColor}
          />
        )}
      </Collapsible>
    </SequencerWrapper>
  );
}

const Option = styled.span<{ active: boolean }>`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  color: white;
  opacity: ${({ active }) => (active ? 1 : 0.5)};

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
`;

const SequencerWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  gap: 5px;
  padding: 0 5px 10px 5px;
`;
