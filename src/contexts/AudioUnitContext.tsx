import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { AudioUnit } from "../audioUnits/types";

const AudioUnitContext = createContext<Array<AudioUnit>>([]);

const UpdateAudioUnitContext = createContext<
  Dispatch<SetStateAction<Array<AudioUnit>>>
>(() => null);

export const AudioUnitContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [audioUnits, setAudioUnits] = useState<Array<AudioUnit>>([]);

  return (
    <AudioUnitContext.Provider value={audioUnits}>
      <UpdateAudioUnitContext.Provider value={setAudioUnits}>
        {children}
      </UpdateAudioUnitContext.Provider>
    </AudioUnitContext.Provider>
  );
};

export const useAudioUnitContext = () => useContext(AudioUnitContext);
export const useUpdateAudioUnitContext = () =>
  useContext(UpdateAudioUnitContext);
