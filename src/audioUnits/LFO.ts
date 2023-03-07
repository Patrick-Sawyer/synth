import { CONTEXT } from "../App";
import { ConnectionTypes } from "../ConnectionContext";
import { BaseUnit, FADE, ZERO } from "./BaseUnit";
import { Connection } from "./Connection";
import { WaveTypes } from "./Oscillator";
import { AudioUnitTypes } from "./types";

export interface SavedLFO {
  unitKey: string;
  type: AudioUnitTypes.LFO;
  rate: number;
  waveform: WaveTypes;
  fmAmount: number;
}

export const INIT_RATE = 14;
export const INIT_VOL = 0.2;

export class LFO extends BaseUnit {
  oscillator: OscillatorNode;
  setLFO: (value: number) => void;
  setWaveform: (next: WaveTypes) => void;
  fmIn: Connection;
  setFmAmount: (value: number) => void;
  fmAmount: number;

  constructor(input?: SavedLFO) {
    super(AudioUnitTypes.LFO, input?.unitKey);
    this.output.node.gain.value = 0.6;
    this.oscillator = CONTEXT.createOscillator();
    this.oscillator.type =
      input?.waveform === undefined ? "sine" : input.waveform;
    this.oscillator.frequency.value =
      input?.rate === undefined ? INIT_RATE : input.rate;
    this.oscillator.connect(this.output.node);
    this.oscillator.start();

    this.setLFO = (value: number) => {
      this.oscillator.frequency.linearRampToValueAtTime(value, FADE);
    };

    this.setWaveform = (next: WaveTypes) => {
      this.oscillator.type = next;
    };

    this.fmIn = new Connection("FM IN", ConnectionTypes.INPUT);
    this.fmIn.node.gain.value =
      input?.fmAmount === undefined ? 0 : input.fmAmount * 10;
    this.fmIn.node.connect(this.oscillator.frequency);

    this.fmAmount = input?.fmAmount || 0;

    this.setFmAmount = (value: number) => {
      this.fmAmount = value;
      this.fmIn.node.gain.linearRampToValueAtTime(
        value * 10,
        CONTEXT.currentTime + FADE
      );
    };

    this.shutdown = () => {
      this.output.node.gain.value = ZERO;
      this.output.node.disconnect();
      this.oscillator.disconnect();
      this.fmIn.node.disconnect();
    };
  }
}
