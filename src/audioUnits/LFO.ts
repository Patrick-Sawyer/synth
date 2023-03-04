import { CONTEXT } from "../App";
import { BaseUnit, FADE } from "./BaseUnit";
import { WaveTypes } from "./Oscillator";
import { AudioUnitTypes } from "./types";

export interface SavedLFO {
  unitKey: string;
  type: AudioUnitTypes.LFO;
}

export const INIT_RATE = 14;
export const INIT_VOL = 0.25;

export class LFO extends BaseUnit {
  oscillator: OscillatorNode;
  setLFO: (value: number) => void;
  setWaveform: (next: WaveTypes) => void;
  setAmount: (value: number) => void;

  constructor(input?: SavedLFO) {
    super(AudioUnitTypes.LFO, input?.unitKey);
    this.output.node.gain.value = INIT_VOL;

    this.oscillator = CONTEXT.createOscillator();
    this.oscillator.frequency.value = INIT_RATE;
    this.oscillator.connect(this.output.node);
    this.oscillator.start();

    this.setLFO = (value: number) => {
      this.oscillator.frequency.linearRampToValueAtTime(value, FADE);
    };

    this.setWaveform = (next: WaveTypes) => {
      this.oscillator.type = next;
    };

    this.setAmount = (value: number) => {
      this.output.node.gain.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
    };
  }
}
