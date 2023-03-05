import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { UNIT_HEIGHT } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { Screws } from "./Screws";

export function RackRow() {
  return (
    <Wrapper>
      <Screws key={1} />
      <Screws key={2} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: ${UNIT_HEIGHT};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #202020;
`;
