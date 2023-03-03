import { useEffect, useState } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { Screw } from "./Screw";

export function Screws() {
  const [screws, setScrews] = useState<Array<React.ReactElement>>([]);

  useEffect(() => {
    const resize = () => {
      const width = window.innerWidth;
      const numberOfScrews = Math.ceil(width / 13);
      if (screws.length !== numberOfScrews) {
        const newScrews = new Array(numberOfScrews)
          .fill(null)
          .map((_, index) => <Screw key={index} />);
        setScrews(newScrews);
      }
    };
    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [screws.length]);

  return <Wrapper>{[...screws]}</Wrapper>;
}

const Wrapper = styled.div`
  height: 15px;
  width: 100%;
  background-color: ${Colors.screwBackground};
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 4px;
  overflow: hidden;
  border-bottom: 1px solid ${Colors.darkBorder};
`;
