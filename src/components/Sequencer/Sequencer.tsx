import { RefObject } from "react";
import styled from "styled-components";
import { MAIN_OUT } from "../../App";
import { Colors } from "../../utils/theme";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { Collapsible } from "./Collapsible";
import { Grid } from "./Grid";

interface Props {
  onClick: (freq?: number) => void;
  wrapperRef: RefObject<HTMLDivElement>;
}

export function Sequencer({ onClick, wrapperRef }: Props) {
  return (
    <Wrapper>
      {/* <button
        onClick={() => {
          onClick(Math.random() * 400);
        }}
      >
        PLAY
      </button>
      <button
        onClick={() => {
          onClick(undefined);
        }}
      >
        STOP
      </button> */}

      <SequencerWrapper>
        <Collapsible wrapperRef={wrapperRef} title={"SEQ ONE"} name={"SEQ_ONE"}>
          <Grid />
        </Collapsible>
        <Collapsible wrapperRef={wrapperRef} title={"SEQ TWO"} name={"SEQ_ONE"}>
          <Grid />
        </Collapsible>
        <Collapsible
          wrapperRef={wrapperRef}
          title={"SEQ THREE"}
          name={"SEQ_ONE"}
        >
          <Grid />
        </Collapsible>
      </SequencerWrapper>
      <MainOut>
        <AudioConnection
          darkText
          wrapperRef={wrapperRef}
          connection={MAIN_OUT}
          unitKey="MAIN_OUT"
          connectionKey="MAIN_OUT"
        />
      </MainOut>
    </Wrapper>
  );
}

const SequencerWrapper = styled.div`
  width: calc(100% - 150px);
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${Colors.darkBorder};
  position: relative;
  gap: 15px;
`;

const MainOut = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 70px;
  position: absolute;
  right: 30px;
  bottom: 50px;
`;
