import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { MAIN_OUT } from "../../App";
import { Connection } from "../../audioUnits/Connection";
import { Envelope } from "../../audioUnits/Envelope";
import { LFO } from "../../audioUnits/LFO";
import { Oscillator } from "../../audioUnits/Oscillator";
import { Reverb } from "../../audioUnits/Reverb";
import { AudioUnit, AudioUnitTypes } from "../../audioUnits/types";
import {
  FullConnection,
  useConnectionContext,
  useConnectionUpdateContext,
} from "../../ConnectionContext";
import { formatOnLoad, formatOnSave } from "../../utils/formatPatch";
import { Colors } from "../../utils/theme";
import { SaveComponent } from "./SaveComponent";
import { Option, UnitSelector } from "./UnitSelector";

const PATCH_PREFIX = "@turntablism-modular-patch-";

interface Props {
  audioUnits: Array<AudioUnit>;
  setAudioUnits: Dispatch<SetStateAction<AudioUnit[]>>;
}

const AudioUnitListOption: Array<Option> = [
  {
    text: "Oscillator",
    value: AudioUnitTypes.OSCILLATOR,
    key: AudioUnitTypes.OSCILLATOR,
    color: Colors.oscillator,
  },
  {
    text: "Envelope",
    value: AudioUnitTypes.ENVELOPE,
    key: AudioUnitTypes.ENVELOPE,
    color: Colors.envelope,
  },
  {
    text: "Reverb",
    value: AudioUnitTypes.REVERB,
    key: AudioUnitTypes.REVERB,
    color: Colors.reverb,
  },
  {
    text: "LFO",
    value: AudioUnitTypes.LFO,
    key: AudioUnitTypes.LFO,
    color: Colors.lfo,
  },
];

const getUnit = (type: AudioUnitTypes) => {
  switch (type) {
    case AudioUnitTypes.OSCILLATOR:
      return new Oscillator();
    case AudioUnitTypes.ENVELOPE:
      return new Envelope();
    case AudioUnitTypes.REVERB:
      return new Reverb();
    case AudioUnitTypes.LFO:
      return new LFO();
  }
};

export function Settings({ audioUnits, setAudioUnits }: Props) {
  const [savedPatches, setSavedPatches] = useState<Array<string>>([]);
  const { connections } = useConnectionContext();
  const { setConnections } = useConnectionUpdateContext();

  const [text, setText] = useState("");

  const addUnit = (type: AudioUnitTypes) => {
    const newUnit = getUnit(type);

    setAudioUnits((array) => {
      return [...array, newUnit];
    });
  };

  const removeUnit = (keyToDelete: string) => {
    setAudioUnits((array) => {
      const index = array.findIndex(({ unitKey }) => unitKey === keyToDelete);
      array[index]?.shutdown();
      return [...array.slice(0, index), ...array.slice(index + 1)];
    });

    const newConnections = [...connections];
    const filtered = newConnections.filter((conn) => {
      return (
        conn.from.unitKey !== keyToDelete && conn.to.unitKey !== keyToDelete
      );
    });

    setConnections && setConnections(filtered);
  };

  const saveAs = (name: string) => {
    const saveName = PATCH_PREFIX + name;
    const patch = window.localStorage.getItem(saveName);

    if (audioUnits.length === 0) {
      alert("NOTHING TO SAVE FOOL");
    } else if (patch) {
      alert("ALREADY EXISTS FOOL");
    } else {
      try {
        const mapped = formatOnSave(audioUnits);
        const patchAsString = JSON.stringify({
          patch: mapped,
          connections,
        });
        window.localStorage.setItem(saveName, patchAsString);
      } catch {
        alert("SOMETHING WENT WRONG FOOL");
      }
    }
  };

  const load = async (name: string) => {
    audioUnits.forEach((unit) => {
      unit.shutdown();
    });

    const patch = window.localStorage.getItem(name);

    if (patch) {
      try {
        const parsedJson = JSON.parse(patch);
        const units = formatOnLoad(parsedJson.patch);

        const connectionsToSetup = parsedJson.connections;
        console.log("UNITS", units);
        console.log("Connections", connectionsToSetup);
        setConnections && setConnections(connectionsToSetup);

        connectionsToSetup.forEach((conn: FullConnection) => {
          try {
            let fromConnection: Connection | undefined;

            if (conn.from.connectionKey === "MAIN_OUT") {
              fromConnection = MAIN_OUT;
            } else {
              const unit = units.find(
                (unit) => unit.unitKey === conn.from.unitKey
              );

              const fromKey = conn.from.connectionKey as keyof typeof unit;
              fromConnection = unit?.[fromKey];
            }

            let toConnection: Connection | undefined;

            if (conn.to.connectionKey === "MAIN_OUT") {
              toConnection = MAIN_OUT;
            } else {
              const unit = units.find(
                (unit) => unit.unitKey === conn.to.unitKey
              );
              const toKey = conn.to.connectionKey as keyof typeof unit;
              toConnection = unit?.[toKey];
              console.log("FOUND UNIT", unit, "LOOGIN FOR KEY", toKey);
            }

            console.log(fromConnection, toConnection);

            if (fromConnection && toConnection) {
              fromConnection.node.connect(toConnection.node);
            }
          } catch {}
        });
        setAudioUnits(units);

        setText(name.replace(PATCH_PREFIX, ""));
      } catch {
        alert("SOMETHING WENT WRONG FOOL");
      }
    } else {
      alert("SOMETHING WENT WRONG FOOL");
    }
  };

  useEffect(() => {
    const patches = Object.keys(localStorage)
      .filter((key) => key.startsWith(PATCH_PREFIX))
      .map((key) => key.replace(PATCH_PREFIX, ""));

    setSavedPatches(patches);
  }, []);

  return (
    <Wrapper>
      <Section>
        <UnitSelector
          options={AudioUnitListOption}
          onSelect={addUnit}
          label={`Add unit: `}
        />
        <UnitSelector
          options={audioUnits.map(({ label, unitKey, color }) => ({
            text: label,
            value: unitKey,
            color,
            key: unitKey,
          }))}
          onSelect={removeUnit}
          label={`Remove unit: `}
        />
      </Section>

      <Section>
        <UnitSelector
          options={savedPatches.map((patch) => ({
            key: patch,
            value: patch,
            text: patch,
          }))}
          closeOnClick
          onSelect={(value) => {
            load(PATCH_PREFIX + value);
          }}
          label={`Load patch: `}
        />
        <SaveComponent text={text} setText={setText} onClick={saveAs} />
      </Section>
    </Wrapper>
  );
}

const Section = styled.div`
  display: flex;
  flex: 1;
  gap: 15px;
  justify-content: space-evenly;
`;

const Wrapper = styled.div`
  width: 100%;
  gap: 10px;
  background-color: ${Colors.screwBackground};
  border-bottom: 1px solid ${Colors.darkBorder};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  flex-wrap: wrap;
  z-index: 1000;
  position: relative;
`;
