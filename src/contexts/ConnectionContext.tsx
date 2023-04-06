import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export enum ConnectionTypes {
  INPUT = "input",
  OUTPUT = "output",
  CV_IN = "cv-in",
  CV_OUT = "cv-out",
}

export interface MakeConnection {
  unitKey: string;
  connectionKey: string;
  type: ConnectionTypes;
  position: {
    x: number;
    y: number;
  };
  node: GainNode;
  limit: number;
}

export interface FullConnection {
  from: MakeConnection;
  to: MakeConnection;
}

const ConnectionContext = createContext<{
  fromConnection: MakeConnection | null;
  connections: Array<FullConnection>;
  wireConnections: Array<FullConnection>;
  connectionPositions: Record<
    string,
    {
      x: number;
      y: number;
    }
  >;
  hiddenUnits: Array<string>;
}>({
  fromConnection: null,
  connections: [],
  connectionPositions: {},
  hiddenUnits: [],
  wireConnections: [],
});

interface ConnectionUpdates {
  setFromValue: Dispatch<SetStateAction<MakeConnection | null>> | null;
  setConnections: Dispatch<SetStateAction<Array<FullConnection>>> | null;
  setHiddenUnits: Dispatch<SetStateAction<Array<string>>> | null;
  clearConnections: () => void;
  disconnectThisConnection: (unitKey: string, connectionKey: string) => void;
}

const UpdateConnectionContext = createContext<ConnectionUpdates>({
  setFromValue: () => null,
  setConnections: () => null,
  setHiddenUnits: () => null,
  clearConnections: () => null,
  disconnectThisConnection: () => null,
});

export const ConnectionContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hiddenUnits, setHiddenUnits] = useState<Array<string>>([]);

  const [fromConnection, setFromValue] = useState<MakeConnection | null>(null);
  const connectionPositions = useRef<
    Record<
      string,
      {
        x: number;
        y: number;
      }
    >
  >({});

  const [connections, setConnections] = useState<Array<FullConnection>>([]);

  const clearConnections = () => {
    setHiddenUnits([]);
    setFromValue(null);
    setConnections([]);
  };

  const disconnectThisConnection = (unitKey: string, connectionKey: string) => {
    const newConnections: Array<FullConnection> = [];

    connections.forEach((conn) => {
      if (
        (conn.from?.unitKey === unitKey &&
          conn.from?.connectionKey === connectionKey) ||
        (conn.to?.unitKey === unitKey &&
          conn.to?.connectionKey === connectionKey)
      ) {
        try {
          conn.from?.node?.disconnect &&
            conn.from?.node?.disconnect(conn.to.node);
        } catch (e) {
          console.log(e);
        }
      } else {
        newConnections.push(conn);
      }
    });

    setConnections(newConnections);
  };

  const wireTimeout = useRef<NodeJS.Timeout>();

  const [wireConnections, setWireConnections] = useState<Array<FullConnection>>(
    []
  );

  const calculateWirePositions = useCallback(() => {
    const newWires = connections
      .filter((conn) => {
        return (
          !hiddenUnits.includes(conn.from.unitKey) &&
          !hiddenUnits.includes(conn.to.unitKey)
        );
      })
      .map((conn) => {
        const newConn = { ...conn };
        const from = conn.from.unitKey + conn.from.connectionKey;
        const to = conn.to.unitKey + conn.to.connectionKey;
        const newFrom = connectionPositions.current[from];
        const newTo = connectionPositions.current[to];

        if (newFrom) {
          newConn.from.position = newFrom;
        }

        if (newTo) {
          newConn.to.position = newTo;
        }

        return newConn;
      });
    setWireConnections(newWires);
  }, [connections, hiddenUnits]);

  useEffect(() => {
    const onResize = async () => {
      if (wireTimeout.current) {
        clearTimeout(wireTimeout.current);
      }

      if (wireConnections.length) {
        setWireConnections([]);
        await Promise.resolve((r: () => void) => setTimeout(r, 0));
      }

      wireTimeout.current = setTimeout(calculateWirePositions, 200);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [calculateWirePositions, wireConnections.length]);

  useEffect(() => {
    calculateWirePositions();
  }, [calculateWirePositions, connections.length, hiddenUnits.length]);

  return (
    <ConnectionContext.Provider
      value={{
        fromConnection,
        connections, // MIGHT NEED TO BE MAPPED CONNECTIONS
        wireConnections,
        connectionPositions: connectionPositions.current,
        hiddenUnits,
      }}
    >
      <UpdateConnectionContext.Provider
        value={{
          setFromValue,
          setConnections,
          setHiddenUnits,
          clearConnections,
          disconnectThisConnection,
        }}
      >
        {children}
      </UpdateConnectionContext.Provider>
    </ConnectionContext.Provider>
  );
};

export const useConnectionContext = () => useContext(ConnectionContext);
export const useConnectionUpdateContext = () =>
  useContext(UpdateConnectionContext);
