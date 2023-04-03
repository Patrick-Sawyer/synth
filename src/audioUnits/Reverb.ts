import { CONTEXT } from "../App";
import { ConnectionTypes } from "../ConnectionContext";
import { BaseUnit, FADE, ZERO } from "./BaseUnit";
import { Connection } from "./Connection";
import { AudioUnitTypes } from "./types";

export interface SavedReverb {
  unitKey: string;
  type: AudioUnitTypes.REVERB;
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
  reverbType: ReverbTypes;
  setType: (type: ReverbTypes) => void;
  addReverb: (convolver: ConvolverNode, type: ReverbTypes) => Promise<void>;
  dryWetValue: number;

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
    this.dry.gain.value = input?.wet === undefined ? 0 : 1 - input.wet;
    this.dry.connect(this.output.node);

    // this.setDryVolume = (value: number) => {
    //   this.dry.gain.linearRampToValueAtTime(value, CONTEXT.currentTime + FADE);
    // };

    // REVERB

    this.reverb = CONTEXT.createConvolver();
    this.addReverb(this.reverb, this.reverbType);
    this.input.node.connect(this.reverb);

    this.reverbVolume = CONTEXT.createGain();
    this.reverbVolume.gain.value = input?.wet === undefined ? 1 : input.wet;
    this.reverb.connect(this.reverbVolume);
    this.reverbVolume.connect(this.output.node);
    this.dryWetValue = input?.wet === undefined ? 1 : input.wet;

    this.setReverbVolume = (value: number) => {
      this.dryWetValue = value;
      const newWet = Math.pow(value, 0.5);
      const newDry = Math.pow(1 - value, 0.5);
      this.reverbVolume.gain.linearRampToValueAtTime(
        newWet,
        CONTEXT.currentTime + FADE
      );
      this.dry.gain.linearRampToValueAtTime(newDry, CONTEXT.currentTime + FADE);
    };

    this.shutdown = () => {
      this.output.node.gain.value = ZERO;
      this.output.node.disconnect();
      this.reverb.disconnect();
      this.input.node.disconnect();
      this.dry.disconnect();
      this.reverbVolume.disconnect();
    };
  }
}
