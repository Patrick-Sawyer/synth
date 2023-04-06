import { memo } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { Screw } from "./Screw";

const screws = new Array(200)
  .fill(null)
  .map((_, index) => <Screw key={index} />);

function ScrewsComponent() {
  return <Wrapper>{screws}</Wrapper>;
}

const Wrapper = styled.div`
  height: 15px;
  width: fit-content;
  background-color: ${Colors.screwBackground};
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 4px;
  overflow: hidden;
  border-bottom: 1px solid ${Colors.darkBorder};
  gap: 5px;
`;

export const Screws = memo(ScrewsComponent);
