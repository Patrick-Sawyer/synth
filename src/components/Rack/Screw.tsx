import styled from "styled-components";
import { Colors } from "../../utils/theme";

export function Screw() {
  return <Wrapper />;
}

const Wrapper = styled.div`
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background-color: ${Colors.darkBorder};
  opacity: 0.3;
`;
