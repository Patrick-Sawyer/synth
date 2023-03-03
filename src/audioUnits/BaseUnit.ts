import { ConnectionTypes } from "../ConnectionContext";
import { create_UUID } from "../utils/guid";
import { Colors } from "../utils/theme";
import { Connection } from "./Connection";
import { AudioUnitTypes } from "./types";

export const ZERO = 0.00001;
export const FADE = 0.01;

interface LabelAndColor {
  label: string;
  color: string;
}

const CONFIG: Record<AudioUnitTypes, LabelAndColor> = {
  [AudioUnitTypes.OSCILLATOR]: {
    label: "Oscillator",
    color: Colors.oscillator,
  },
  [AudioUnitTypes.ENVELOPE]: {
    label: "Envelope",
    color: Colors.envelope,
  },
  [AudioUnitTypes.REVERB]: {
    label: "Reverb",
    color: Colors.reverb,
  },
};

export class BaseUnit {
  type: AudioUnitTypes;
  label: string;
  unitKey: string;
  key: string;
  color: string;
  output: Connection;
  shutdown: () => void;

  constructor(type: AudioUnitTypes, oldUnitKey?: string) {
    const uuid = oldUnitKey || create_UUID();
    const { label, color } = CONFIG[type];
    this.type = type;
    this.unitKey = uuid;
    this.key = uuid;
    this.label = label;
    this.color = color;
    this.output = new Connection("OUTPUT", ConnectionTypes.OUTPUT);
    this.shutdown = () => null;
  }
}
