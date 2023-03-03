import { RefObject, useEffect, useRef } from "react";
import styled from "styled-components";
import { Connection } from "../../audioUnits/Connection";
import {
  FullConnection,
  MakeConnection,
  useConnectionContext,
  useConnectionUpdateContext,
} from "../../ConnectionContext";
import { debounce } from "../../utils/debounce";
import { Label } from "./Label";

export enum ConnectionTypes {
  INPUT = "input",
  OUTPUT = "output",
  CV_IN = "cv-in",
  CV_OUT = "cv-out",
}

interface Props {
  wrapperRef: RefObject<HTMLDivElement>;
  connection: Connection;
  unitKey: string;
  connectionKey: string;

  darkText?: boolean;
}

const typesMatch = (from: ConnectionTypes, to: ConnectionTypes): boolean => {
  if (from === ConnectionTypes.CV_OUT && to === ConnectionTypes.CV_IN)
    return true;
  if (from === ConnectionTypes.OUTPUT && to === ConnectionTypes.INPUT)
    return true;

  return false;
};

const connectionDoesNotAlreadyExist = (
  from: MakeConnection,
  to: MakeConnection,
  connections: FullConnection[]
): boolean => {
  let value = true;

  for (let i = 0; i < connections.length; i++) {
    const conn = connections[i];
    if (
      conn.from.unitKey === from.unitKey &&
      conn.from.connectionKey === from.connectionKey &&
      conn.to.unitKey === to.unitKey &&
      conn.to.connectionKey === to.connectionKey
    ) {
      value = false;
      break;
    }
  }

  return value;
};

export function AudioConnection({
  wrapperRef,
  connection,
  darkText,
  unitKey,
  connectionKey,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { fromConnection, connections, connectionPositions } =
    useConnectionContext();
  const { setFromValue, setConnections } = useConnectionUpdateContext();

  const onPointerDown = () => {
    setFromValue &&
      setFromValue({
        unitKey,
        connectionKey,
        type: connection.type,
        position: connection.position,
        node: connection.node,
      });
  };

  const onPointerUp = () => {
    const thisConnection: MakeConnection = {
      unitKey,
      connectionKey,
      type: connection.type,
      position: connection.position,
      node: connection.node,
    };

    if (
      fromConnection &&
      setConnections &&
      fromConnection.unitKey !== unitKey &&
      typesMatch(fromConnection.type, connection.type) &&
      connectionDoesNotAlreadyExist(fromConnection, thisConnection, connections)
    ) {
      const all = [...connections];
      all.push({
        from: fromConnection,
        to: thisConnection,
      });

      fromConnection.node.connect(thisConnection.node);
      setConnections(all);
      setFromValue && setFromValue(null);
    } else {
      setFromValue && setFromValue(null);
    }
  };

  useEffect(() => {
    const calculateCentre = () => {
      if (ref.current && wrapperRef.current) {
        const rect = ref.current.getBoundingClientRect();

        const position = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };

        connection.position = position;
        const thisConnectionKey = unitKey + connectionKey;
        connectionPositions[thisConnectionKey] = position;
      }
    };

    const handlePointerUp = () => {
      setFromValue && setFromValue(null);
    };

    calculateCentre();

    window.addEventListener("resize", calculateCentre);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("resize", calculateCentre);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    connection,
    connectionKey,
    connectionPositions,
    setFromValue,
    unitKey,
    wrapperRef,
  ]);

  return (
    <Wrapper ref={ref}>
      <Plug onPointerDown={onPointerDown} onPointerUp={onPointerUp} />
      <Label darkText={darkText}>{connection.name}</Label>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  gap: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 15px;
  min-width: 35px;
`;

const Plug = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: black;
  border: 4px solid white;
  cursor: pointer;
  box-shadow: 7px 6px 20px -7px rgba(0, 0, 0, 0.75);
`;
