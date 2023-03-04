import { CONTEXT } from "../App";
import { ConnectionTypes } from "../ConnectionContext";
import { BaseUnit, FADE } from "./BaseUnit";
import { Connection } from "./Connection";
import { AudioUnitTypes } from "./types";

export interface SavedReverb {
  unitKey: string;
  type: AudioUnitTypes.REVERB;
  dry: number;
  wet: number;
  reverbType: ReverbTypes;
}

export enum ReverbTypes {
  HALL = "hall",
  DIRTY = "dirty",
  CHURCH = "church",
  SPRING = "spring",
  WAREHOUSE = "warehouse",
  ROOM = "room",
}

export class Reverb extends BaseUnit {
  reverb: ConvolverNode;
  input: Connection;
  dry: GainNode;
  reverbVolume: GainNode;
  setReverbVolume: (value: number) => void;
  setDryVolume: (value: number) => void;
  reverbType: ReverbTypes;
  setType: (type: ReverbTypes) => void;
  addReverb: (convolver: ConvolverNode, type: ReverbTypes) => Promise<void>;

  constructor(input?: SavedReverb) {
    super(AudioUnitTypes.REVERB, input?.unitKey);
    this.output.node.gain.value = 1;
    this.input = new Connection("INPUT", ConnectionTypes.INPUT);
    this.input.node.gain.value = 1;

    this.addReverb = async (convolver: ConvolverNode, type: ReverbTypes) => {
      const path = "/audio/" + type + ".wav";
      const response = await fetch(path);
      const arraybuffer = await response.arrayBuffer();
      const buffer = await CONTEXT.decodeAudioData(arraybuffer);
      convolver.buffer = buffer;
    };

    // TYPE

    this.reverbType = input?.reverbType || ReverbTypes.HALL;
    this.setType = (type: ReverbTypes) => {
      this.reverbType = type;
      this.addReverb(this.reverb, type);
    };

    // DRY

    this.dry = CONTEXT.createGain();
    this.input.node.connect(this.dry);
    this.dry.gain.value = input?.dry === undefined ? 1 : input.dry;
    this.dry.connect(this.output.node);

    this.setDryVolume = (value: number) => {
      this.dry.gain.linearRampToValueAtTime(value, CONTEXT.currentTime + FADE);
    };

    // REVERB

    this.reverb = CONTEXT.createConvolver();
    this.addReverb(this.reverb, this.reverbType);
    this.input.node.connect(this.reverb);

    this.reverbVolume = CONTEXT.createGain();
    this.reverbVolume.gain.value = input?.wet === undefined ? 1 : input.wet;
    this.reverb.connect(this.reverbVolume);
    this.reverbVolume.connect(this.output.node);

    this.setReverbVolume = (value: number) => {
      this.reverbVolume.gain.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
    };
  }
}
