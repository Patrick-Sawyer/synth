import { CONTEXT } from "../App";
import { ConnectionTypes } from "../ConnectionContext";
import { BaseUnit, FADE, ZERO } from "./BaseUnit";
import { Connection } from "./Connection";
import { AudioUnitTypes } from "./types";

export type WaveTypes = "sine" | "sawtooth" | "square" | "triangle";

export interface SavedOscillator {
  mainVolume: number;
  waveform: WaveTypes;
  octave: number;
  type: AudioUnitTypes.OSCILLATOR;
  detune: number;
  pan: number;
  unitKey: string;
  fmAmount: number;
  amAmount: number;
}

export class Oscillator extends BaseUnit {
  cvIn: Connection;
  fmIn: Connection;
  oscillator: OscillatorNode;
  setWaveform: (next: WaveTypes) => void;
  play: (frequency?: number) => void;
  setVolume: (next: number) => void;
  mainVolume: GainNode;
  octave: number;
  setOctave: (next: number) => void;
  offset: number;
  setOffset: (value: any) => void;
  amIn: Connection;
  pan: StereoPannerNode;
  setPan: (value: number) => void;
  setAmAmount: (value: number) => void;
  setFmAmount: (value: number) => void;

  constructor(input?: SavedOscillator) {
    super(AudioUnitTypes.OSCILLATOR, input?.unitKey);
    this.output.node.gain.value = 0.3;

    this.cvIn = new Connection("CV IN", ConnectionTypes.CV_IN);
    this.fmIn = new Connection("FM IN", ConnectionTypes.INPUT);
    this.fmIn.node.gain.value =
      input?.fmAmount === undefined ? 0 : input.fmAmount;

    this.amIn = new Connection("AM IN", ConnectionTypes.INPUT);
    this.amIn.node.gain.value =
      input?.amAmount === undefined ? 0 : input.amAmount;

    this.octave = input?.octave === undefined ? 4 : input.octave;

    this.oscillator = CONTEXT.createOscillator();
    this.oscillator.frequency.value = 220 * this.octave;
    this.oscillator.start();
    this.oscillator.type = input?.waveform || "sine";

    this.oscillator.detune.value = input?.detune || 0;

    this.mainVolume = CONTEXT.createGain();
    this.mainVolume.gain.value = input?.mainVolume || 0.3;
    this.oscillator.connect(this.mainVolume);
    this.pan = CONTEXT.createStereoPanner();
    this.pan.pan.value = input?.pan || 0;
    this.mainVolume.connect(this.pan);
    this.pan.connect(this.output.node);
    this.amIn.node.connect(this.output.node.gain);

    this.offset = 0;

    this.fmIn.node.connect(this.oscillator.frequency);

    this.setWaveform = (next: WaveTypes) => {
      this.oscillator.type = next;
    };

    this.setVolume = (next: number) => {
      this.mainVolume.gain.value = next;
    };

    this.setOctave = (next: number) => {
      const diff = next / this.octave;
      this.oscillator.frequency.value = this.oscillator.frequency.value * diff;
      this.octave = next;
    };

    this.play = (frequency?: number) => {
      if (frequency) {
        this.output.node.gain.exponentialRampToValueAtTime(ZERO, 10);

        setTimeout(() => {
          this.oscillator.frequency.value = frequency * this.octave;
          this.output.node.gain.exponentialRampToValueAtTime(0.3, FADE);
        }, 10);
      }
    };

    this.setOffset = (value) => {
      this.oscillator.detune.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
    };

    this.shutdown = () => {
      this.output.node.gain.value = ZERO;
      this.oscillator.disconnect();
      this.output.node.disconnect();
      this.mainVolume.disconnect();
    };

    this.setPan = (value: number) => {
      this.pan.pan.linearRampToValueAtTime(value, CONTEXT.currentTime + FADE);
    };

    this.setAmAmount = (value: number) => {
      this.amIn.node.gain.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
    };

    this.setFmAmount = (value: number) => {
      this.fmIn.node.gain.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
    };
  }
}
