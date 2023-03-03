import { RefObject } from "react";
import styled from "styled-components";
import { MAIN_OUT } from "../../App";
import { Colors } from "../../utils/theme";
import { AudioConnection } from "../unitBlocks/AudioConnection";

interface Props {
  onClick: (freq?: number) => void;
  wrapperRef: RefObject<HTMLDivElement>;
}

export function Sequencer({ onClick, wrapperRef }: Props) {
  return (
    <Wrapper>
      <MainOut>
        <AudioConnection
          darkText
          wrapperRef={wrapperRef}
          connection={MAIN_OUT}
          unitKey="MAIN_OUT"
          connectionKey="MAIN_OUT"
        />
      </MainOut>
      <button
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
      </button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 15px;
  border-bottom: 1px solid ${Colors.darkBorder};
`;

const MainOut = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 190px;
`;
