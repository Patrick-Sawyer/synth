import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { debounce } from "./utils/debounce";

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
}

export interface FullConnection {
  from: MakeConnection;
  to: MakeConnection;
}

const ConnectionContext = createContext<{
  fromConnection: MakeConnection | null;
  connections: Array<FullConnection>;
  connectionPositions: Record<
    string,
    {
      x: number;
      y: number;
    }
  >;
}>({ fromConnection: null, connections: [], connectionPositions: {} });

interface ConnectionUpdates {
  setFromValue: Dispatch<SetStateAction<MakeConnection | null>> | null;
  setConnections: Dispatch<SetStateAction<Array<FullConnection>>> | null;
}

const UpdateConnectionContext = createContext<ConnectionUpdates>({
  setFromValue: null,
  setConnections: null,
});

export const ConnectionContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  useEffect(() => {
    const onResize = debounce(() => {
      const newConnections = [...connections];
      const mapped = newConnections.map((conn) => {
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

      setConnections(mapped);
    }, 500);

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [connections]);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [connections.length]);

  return (
    <ConnectionContext.Provider
      value={{
        fromConnection,
        connections,
        connectionPositions: connectionPositions.current,
      }}
    >
      <UpdateConnectionContext.Provider
        value={{ setFromValue, setConnections }}
      >
        {children}
      </UpdateConnectionContext.Provider>
    </ConnectionContext.Provider>
  );
};

export const useConnectionContext = () => useContext(ConnectionContext);
export const useConnectionUpdateContext = () =>
  useContext(UpdateConnectionContext);
