import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { GridNote } from "../components/Sequencer/Note";

export interface SequencerContextType {
  tempo: number;
  seqOneLoop: number;
  seqTwoLoop: number;
  seqThreeLoop: number;
  seqOneGridNotes: Array<GridNote>;
  seqTwoGridNotes: Array<GridNote>;
  seqThreeGridNotes: Array<GridNote>;
}

interface UpdateSequencerContextType {
  setTempo: Dispatch<SetStateAction<number>>;
  setSeqOneLoop: Dispatch<SetStateAction<number>>;
  setSeqTwoLoop: Dispatch<SetStateAction<number>>;
  setSeqThreeLoop: Dispatch<SetStateAction<number>>;
  setSeqOneGridNotes: Dispatch<SetStateAction<Array<GridNote>>>;
  setSeqTwoGridNotes: Dispatch<SetStateAction<Array<GridNote>>>;
  setSeqThreeGridNotes: Dispatch<SetStateAction<Array<GridNote>>>;
  clearSequencer: () => void;
}

const SequencerContext = createContext<SequencerContextType>({
  tempo: 128,
  seqOneLoop: 2,
  seqTwoLoop: 2,
  seqThreeLoop: 2,
  seqOneGridNotes: [],
  seqTwoGridNotes: [],
  seqThreeGridNotes: [],
});

const UpdateSequencerContext = createContext<UpdateSequencerContextType>({
  setTempo: () => null,
  setSeqOneLoop: () => null,
  setSeqTwoLoop: () => null,
  setSeqThreeLoop: () => null,
  setSeqOneGridNotes: () => null,
  setSeqTwoGridNotes: () => null,
  setSeqThreeGridNotes: () => null,
  clearSequencer: () => null,
});

export const SequencerContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tempo, setTempo] = useState(128);
  const [seqOneLoop, setSeqOneLoop] = useState<number>(2);
  const [seqTwoLoop, setSeqTwoLoop] = useState<number>(2);
  const [seqThreeLoop, setSeqThreeLoop] = useState<number>(2);
  const [seqOneGridNotes, setSeqOneGridNotes] = useState<Array<GridNote>>([]);
  const [seqTwoGridNotes, setSeqTwoGridNotes] = useState<Array<GridNote>>([]);
  const [seqThreeGridNotes, setSeqThreeGridNotes] = useState<Array<GridNote>>(
    []
  );

  const clearSequencer = () => {
    setSeqOneLoop(2);
    setSeqTwoLoop(2);
    setSeqThreeLoop(2);
    setSeqOneGridNotes([]);
    setSeqTwoGridNotes([]);
    setSeqThreeGridNotes([]);
  };

  return (
    <SequencerContext.Provider
      value={{
        tempo,
        seqOneLoop,
        seqTwoLoop,
        seqThreeLoop,
        seqOneGridNotes,
        seqTwoGridNotes,
        seqThreeGridNotes,
      }}
    >
      <UpdateSequencerContext.Provider
        value={{
          setTempo,
          setSeqOneLoop,
          setSeqTwoLoop,
          setSeqThreeLoop,
          setSeqOneGridNotes,
          setSeqTwoGridNotes,
          setSeqThreeGridNotes,
          clearSequencer,
        }}
      >
        {children}
      </UpdateSequencerContext.Provider>
    </SequencerContext.Provider>
  );
};

export const useSequencerContext = () => useContext(SequencerContext);
export const useUpdateSequencerContext = () =>
  useContext(UpdateSequencerContext);
