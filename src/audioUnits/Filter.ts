import { CONTEXT } from "../App";
import { ConnectionTypes } from "../ConnectionContext";
import { BaseUnit, FADE, ZERO } from "./BaseUnit";
import { Connection } from "./Connection";
import { INIT_RATE } from "./LFO";
import { AudioUnitTypes } from "./types";

export enum FilterTypes {
  LOWPASS = "lowpass",
  HIGHPASS = "highpass",
  BANDPASS = "bandpass",
}

export interface SavedFilter {
  unitKey: string;
  type: AudioUnitTypes.FILTER;
  waveform: FilterTypes;
  frequency: number;
  resonance: number;
  fmAmount: number;
}

const calculateFmAmount = (frequency: number, fmAmount: number) => {
  const diff = Math.max(frequency - 50, 0);
  const asFraction = diff / 20000;
  return asFraction * fmAmount;
};

export const FILTER_INIT_FREQ = 20000;
export const FILTER_INIT_WAVE = FilterTypes.LOWPASS;
export const INIT_FILTER_FM_VALUE = 0;
export const FILTER_INIT_RESONANCE = 0;

export class Filter extends BaseUnit {
  filter: BiquadFilterNode;
  input: Connection;
  setFreq: (value: number) => void;
  setType: (next: FilterTypes) => void;
  fmIn: Connection;
  setFmAmount: (value: number) => void;
  setResonance: (value: number) => void;
  fmAmount: number;

  constructor(input?: SavedFilter) {
    super(AudioUnitTypes.FILTER, input?.unitKey);
    this.output.node.gain.value = 1;
    this.fmIn = new Connection("FM IN", ConnectionTypes.INPUT, 1);
    this.fmIn.node.gain.value = calculateFmAmount(
      input?.frequency === undefined ? INIT_RATE : input.frequency,
      input?.fmAmount === undefined ? INIT_FILTER_FM_VALUE : input.fmAmount
    );
    console.log("FILTER INPUT", input);
    this.filter = CONTEXT.createBiquadFilter();
    this.filter.frequency.value =
      input?.frequency === undefined ? FILTER_INIT_FREQ : input.frequency;
    this.filter.type =
      input?.waveform === undefined ? FILTER_INIT_WAVE : input.waveform;
    this.filter.Q.value =
      input?.resonance === undefined ? FILTER_INIT_RESONANCE : input.resonance;
    this.filter.connect(this.output.node);
    this.fmAmount =
      input?.fmAmount === undefined ? INIT_FILTER_FM_VALUE : input.fmAmount;
    this.fmIn.node.connect(this.filter.frequency);
    this.input = new Connection("INPUT", ConnectionTypes.INPUT);
    this.input.node.gain.value = 1;
    this.input.node.connect(this.filter);
    this.filter.connect(this.output.node);

    this.setFreq = (value: number) => {
      this.filter.frequency.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );

      const fmAmount = calculateFmAmount(
        this.filter.frequency.value,
        this.fmAmount
      );
      this.fmIn.node.gain.linearRampToValueAtTime(
        fmAmount,
        CONTEXT.currentTime + FADE
      );
    };

    this.setType = (next: FilterTypes) => {
      this.filter.type = next;
    };

    this.setFmAmount = (value: number) => {
      this.fmAmount = value;
      const fmAmount = calculateFmAmount(this.filter.frequency.value, value);
      this.fmIn.node.gain.linearRampToValueAtTime(
        fmAmount,
        CONTEXT.currentTime + FADE
      );
    };

    this.setResonance = (value: number) => {
      this.filter.Q.linearRampToValueAtTime(value, CONTEXT.currentTime + FADE);
    };
    this.shutdown = () => {
      this.output.node.gain.value = ZERO;
      this.output.node.disconnect();
      this.fmIn.node.disconnect();
      this.input.node.disconnect();
    };
  }
}