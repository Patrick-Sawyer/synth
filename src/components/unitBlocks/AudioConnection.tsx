import {
  MouseEventHandler,
  PointerEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import styled from "styled-components";
import { Connection } from "../../audioUnits/Connection";
import {
  FullConnection,
  MakeConnection,
  useConnectionContext,
  useConnectionUpdateContext,
} from "../../contexts/ConnectionContext";
import { useMrTContext } from "../../contexts/MrTContext";
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
  children?: React.ReactNode;
  darkText?: boolean;
  horizontal?: boolean;
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

const cursorNotAllowed = () => {
  const cursorStyle = document.createElement("style");
  cursorStyle.innerHTML = "*{cursor: not-allowed!important;}";
  cursorStyle.id = "cursor-style";
  document.head.appendChild(cursorStyle);
};

const normalCursor = () => {
  document.getElementById("cursor-style")?.remove();
};

export function AudioConnection({
  wrapperRef,
  connection,
  darkText,
  unitKey,
  connectionKey,
  children,
  horizontal,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { fireMrT } = useMrTContext();
  const { fromConnection, connections, connectionPositions, hiddenUnits } =
    useConnectionContext();
  const { setFromValue, setConnections, disconnectThisConnection } =
    useConnectionUpdateContext();

  const onPointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (e.button === 2) return;
    setFromValue &&
      setFromValue({
        unitKey,
        connectionKey,
        type: connection.type,
        position: connection.position,
        node: connection.node,
        limit: connection.limit,
      });
  };

  const onClick: PointerEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  const onPointerUp: PointerEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (e.button === 2) return;

    const thisConnection: MakeConnection = {
      unitKey,
      connectionKey,
      type: connection.type,
      position: connection.position,
      node: connection.node,
      limit: connection.limit,
    };

    const numberOfExistingConnections = connections.filter((conn) => {
      return (
        conn.to.connectionKey === thisConnection.connectionKey &&
        conn.to.unitKey === thisConnection.unitKey
      );
    }).length;

    if (!fromConnection || !setConnections) {
      setFromValue && setFromValue(null);
      return;
    }

    const exceedsLimit = numberOfExistingConnections >= thisConnection.limit;
    const isSameUnit = fromConnection?.unitKey === unitKey;
    const match = typesMatch(fromConnection.type, connection.type);
    const connectionExists = !connectionDoesNotAlreadyExist(
      fromConnection,
      thisConnection,
      connections
    );

    if (exceedsLimit || isSameUnit || connectionExists || !match) {
      if (!isSameUnit) {
        cursorNotAllowed();
      }
      setFromValue && setFromValue(null);
      return;
    }

    const all = [...connections];
    all.push({
      from: fromConnection,
      to: thisConnection,
    });

    fromConnection.node.connect(thisConnection.node);

    setConnections(all);
    setFromValue && setFromValue(null);
  };

  const calculateCentre = useCallback(() => {
    if (ref.current && wrapperRef.current) {
      const rect = ref.current.getBoundingClientRect();

      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2 + wrapperRef.current.scrollTop,
      };

      connection.position = position;
      const thisConnectionKey = unitKey + connectionKey;
      connectionPositions[thisConnectionKey] = position;
    }
  }, [connection, connectionKey, connectionPositions, unitKey, wrapperRef]);

  useEffect(() => {
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
    calculateCentre,
    connection,
    connectionKey,
    connectionPositions,
    setFromValue,
    unitKey,
    wrapperRef,
  ]);

  const handleRightClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    const isConnected = !!connections.find((conn) => {
      return (
        (conn.from.unitKey === unitKey &&
          conn.from.connectionKey === connectionKey) ||
        (conn.to.unitKey === unitKey && conn.to.connectionKey === connectionKey)
      );
    });

    if (isConnected) {
      fireMrT({
        text: "DELETE THESE WIRES FOOL?",
        callback: () => {
          disconnectThisConnection(unitKey, connectionKey);
        },
      });
    }
  };

  useEffect(() => {
    calculateCentre();
  }, [calculateCentre, hiddenUnits]);

  return (
    <Wrapper horizontal={!!horizontal}>
      <Blah>
        {children}
        <Plug
          onMouseLeave={() => {
            normalCursor();
          }}
          onDoubleClick={() => {
            normalCursor();
          }}
          ref={ref}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onClick={onClick}
          onContextMenu={handleRightClick}
        />
      </Blah>
      <Label darkText={darkText}>{connection.name}</Label>
    </Wrapper>
  );
}

const Blah = styled.div`
  display: flex;
  gap: 6px;
`;

const Wrapper = styled.div<{
  horizontal: boolean;
}>`
  gap: 8px;
  display: flex;
  flex-direction: ${({ horizontal }) => (horizontal ? "row" : "column")};
  align-items: center;
`;

const Plug = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: black;
  border: 4px solid white;
  cursor: pointer;
  box-shadow: 1px 5px 11px -2px rgba(0, 0, 0, 0.5);
`;
