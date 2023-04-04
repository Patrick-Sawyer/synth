import { CONTEXT, PulseNode } from "../App";
import { ConnectionTypes } from "../contexts/ConnectionContext";
import { BaseUnit, FADE, ZERO } from "./BaseUnit";
import { Connection } from "./Connection";
import { AudioUnitTypes } from "./types";

export type WaveTypes = "sine" | "sawtooth" | "triangle" | "square";

export interface SavedOscillator {
  mainVolume: number;
  waveform: WaveTypes | "pulse";
  octave: number;
  type: AudioUnitTypes.OSCILLATOR;
  detune: number;
  pan: number;
  unitKey: string;
  fmAmount: number;
  amAmount: number;
  pulseWidth: number;
  pulseWidthModulation: number;
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
  pulse: PulseNode;
  pulseGain: GainNode;
  allOtherOscillatorsGain: GainNode;
  pwm: Connection;
  setPwm: (value: number) => void;
  setPulseWidth: (value: number) => void;
  currentWaveform: WaveTypes | "pulse";
  triggerEnvelope: (attack: number, decay: number, sustain: number) => void;
  triggerRelease: (release: number) => void;
  timeout: NodeJS.Timeout | null;
  sustaining: boolean;
  detune: number;

  constructor(input?: SavedOscillator) {
    super(AudioUnitTypes.OSCILLATOR, input?.unitKey);
    this.output.node.gain.value = 1;
    // @ts-ignore
    this.pulse = CONTEXT.createPulseOscillator();

    this.cvIn = new Connection("CV IN", ConnectionTypes.CV_IN, 1);
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
    this.oscillator.type =
      input?.waveform === undefined || input?.waveform === "pulse"
        ? "sine"
        : input.waveform;

    this.oscillator.detune.value = input?.detune || 0;

    this.mainVolume = CONTEXT.createGain();
    this.mainVolume.gain.value = input?.mainVolume || 0.3;

    this.pulseGain = CONTEXT.createGain();
    this.pulseGain.gain.value = input?.waveform === "pulse" ? 1 : ZERO;
    this.allOtherOscillatorsGain = CONTEXT.createGain();
    this.allOtherOscillatorsGain.gain.value =
      input?.waveform === "pulse" ? ZERO : 1;
    this.oscillator.connect(this.allOtherOscillatorsGain);
    this.pulse.start();
    this.pulse.frequency.value = 220 * this.octave;
    this.pulse.connect(this.pulseGain);
    this.pulseGain.connect(this.mainVolume);
    this.allOtherOscillatorsGain.connect(this.mainVolume);
    this.pan = CONTEXT.createStereoPanner();
    this.pan.pan.value = input?.pan || 0;
    this.mainVolume.connect(this.pan);
    this.pan.connect(this.output.node);
    this.amIn.node.connect(this.output.node.gain);
    this.currentWaveform = input?.waveform || "sine";

    this.offset = 0;

    this.fmIn.node.connect(this.oscillator.frequency);
    this.fmIn.node.connect(this.pulse.frequency);

    this.setWaveform = (next: WaveTypes | "pulse") => {
      this.currentWaveform = next;

      if (next === "pulse") {
        this.allOtherOscillatorsGain.gain.linearRampToValueAtTime(
          ZERO,
          CONTEXT.currentTime + FADE
        );
        this.pulseGain.gain.linearRampToValueAtTime(
          1,
          CONTEXT.currentTime + FADE
        );
      } else {
        this.oscillator.type = next;
        this.allOtherOscillatorsGain.gain.linearRampToValueAtTime(
          1,
          CONTEXT.currentTime + FADE
        );
        this.pulseGain.gain.linearRampToValueAtTime(
          ZERO,
          CONTEXT.currentTime + FADE
        );
      }
    };

    this.setVolume = (next: number) => {
      this.mainVolume.gain.value = next;
    };

    this.setOctave = (next: number) => {
      const diff = next / this.octave;
      const nextOctave = this.oscillator.frequency.value * diff;
      this.oscillator.frequency.value = nextOctave;
      this.pulse.frequency.value = nextOctave;
      this.octave = next;
    };

    this.play = (frequency?: number) => {
      if (frequency) {
        this.oscillator.frequency.value = frequency * this.octave;
        this.pulse.frequency.value = frequency * this.octave;
      }
    };

    this.detune = 0;

    this.setOffset = (value) => {
      this.detune = value;
      if (!this.sustaining) return;

      this.oscillator.detune.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
      this.pulse.detune.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
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

    this.pwm = new Connection("PWM", ConnectionTypes.INPUT);
    this.pwm.node.gain.value =
      input?.pulseWidthModulation === undefined
        ? ZERO
        : input.pulseWidthModulation;

    if (this.pulse.width !== undefined) {
      this.pulse.width.value =
        input?.pulseWidth === undefined ? 0 : input.pulseWidth;
      this.pwm.node.connect(this.pulse.width);
    }

    this.setPwm = (value: number) => {
      this.pwm.node.gain.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
    };

    this.setPulseWidth = (value: number) => {
      this.pulse.width?.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
    };

    this.shutdown = () => {
      this.output.node.gain.value = ZERO;
      this.oscillator.disconnect();
      this.output.node.disconnect();
      this.mainVolume.disconnect();
      this.pulse.disconnect();
      this.fmIn.node.disconnect();
      this.amIn.node.disconnect();
      this.pan.disconnect();
      this.pulseGain.disconnect();
      this.allOtherOscillatorsGain.disconnect();
      this.cvIn.node.disconnect();
    };

    this.timeout = null;
    this.sustaining = true;

    this.triggerEnvelope = (attack: number, decay: number, sustain: number) => {
      if (this.timeout) clearTimeout(this.timeout);
      this.sustaining = false;
      this.timeout = setTimeout(() => {
        this.sustaining = true;
      }, 1000 * (attack + decay + FADE));

      this.oscillator.detune.cancelScheduledValues(0);
      this.oscillator.detune.cancelAndHoldAtTime(0);

      const toValue = this.fmIn.node.gain.value / 8.333 + this.detune;

      const sustainValue =
        (sustain * this.fmIn.node.gain.value) / 8.33 + this.detune;

      this.oscillator.detune.linearRampToValueAtTime(
        toValue + 0.1,
        CONTEXT.currentTime + attack
      );

      this.oscillator.detune.linearRampToValueAtTime(
        sustainValue,
        CONTEXT.currentTime + attack + decay
      );
    };

    this.triggerRelease = (release: number) => {
      this.sustaining = true;
      if (this.timeout) clearTimeout(this.timeout);
      this.oscillator.detune.cancelScheduledValues(0);
      this.oscillator.detune.cancelAndHoldAtTime(0);
      this.oscillator.detune.linearRampToValueAtTime(
        this.detune,
        CONTEXT.currentTime + release
      );
    };
  }
}
