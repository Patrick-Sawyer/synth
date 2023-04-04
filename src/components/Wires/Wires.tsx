import { memo, RefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Coordinate } from "../../audioUnits/Connection";
import { useConnectionContext } from "../../ConnectionContext";
import { debounce } from "../../utils/debounce";

interface WireProps {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  colorOverride?: string;
}

const rand = () => {
  return Math.round(Math.random() * 255);
};

function getRandomColor(): string {
  return `rgb(${rand()},${rand()},${rand()})`;
}

const CURVE_AMOUNT = 200;

const calculateCurve = (p1x: number, p1y: number, p2x: number, p2y: number) => {
  const mpx = (p2x + p1x) * 0.5;
  const mpy = (p2y + p1y) * 0.5;
  const c1y = mpy + CURVE_AMOUNT;

  return (
    "M" + p1x + " " + p1y + " Q " + mpx + " " + c1y + " " + p2x + " " + p2y
  );
};

const WireComponent = ({ x1, x2, y1, y2, colorOverride }: WireProps) => {
  const color = useRef(colorOverride || getRandomColor());
  const curve = calculateCurve(x1, y1, x2, y2);

  return (
    <svg
      width="100%"
      height="100%"
      style={{ zIndex: 1000, opacity: 0.7, position: "absolute" }}
    >
      <path
        d={curve}
        strokeDasharray={!!colorOverride ? "5,10" : undefined}
        stroke={color.current}
        strokeWidth="4"
        strokeLinecap="round"
        fill="transparent"
      ></path>
    </svg>
  );
};

const Wire = memo(WireComponent);

interface Props {
  wrapperRef: RefObject<HTMLDivElement>;
}

export function Wires({ wrapperRef }: Props) {
  const { filteredConnections, fromConnection } = useConnectionContext();
  const [mousePosition, setMousePosition] = useState<Coordinate>();

  useEffect(() => {
    const handleMouseMove = debounce((e: MouseEvent) => {
      const { pageX, pageY } = e;
      const offset = wrapperRef.current?.scrollTop || 0;

      setMousePosition({
        x: pageX,
        y: pageY + offset,
      });
    }, 100);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [wrapperRef]);

  return (
    <Wrapper>
      {filteredConnections.map((connection) => {
        const key =
          connection.from.unitKey +
          connection.from.connectionKey +
          connection.to.unitKey +
          connection.to.connectionKey;

        return (
          <Wire
            key={key}
            x2={connection.from.position.x}
            y2={connection.from.position.y}
            x1={connection.to.position.x}
            y1={connection.to.position.y}
          />
        );
      })}
      {!!fromConnection && mousePosition && (
        <Wire
          key="new-connection"
          x1={fromConnection.position.x}
          y1={fromConnection.position.y}
          x2={mousePosition.x}
          y2={mousePosition.y}
          colorOverride="rgba(255,255,255,0.3)"
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0;
  width: 100%;
  height: 3000px;
`;
