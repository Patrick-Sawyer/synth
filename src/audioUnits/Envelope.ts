import { CONTEXT } from "../App";
import { ConnectionTypes } from "../ConnectionContext";
import { BaseUnit, FADE, ZERO } from "./BaseUnit";
import { Connection } from "./Connection";
import { AudioUnitTypes } from "./types";

export interface SavedEnvelope {
  type: AudioUnitTypes.ENVELOPE;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  unitKey: string;
}

export class Envelope extends BaseUnit {
  input: Connection;
  cvIn: Connection;
  invertedOutput: Connection;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  trigger: (freq?: number) => void;
  start: () => void;
  stop: () => void;
  invertedTimeout: null | NodeJS.Timeout;
  setAttack: (value: number) => void;
  setDecay: (value: number) => void;
  setSustain: (value: number) => void;
  setRelease: (value: number) => void;
  timeout: NodeJS.Timeout | null;
  sustaining: boolean;

  constructor(input?: SavedEnvelope) {
    super(AudioUnitTypes.ENVELOPE, input?.unitKey);
    this.output.node.gain.value = ZERO;
    this.input = new Connection("INPUT", ConnectionTypes.INPUT);
    this.cvIn = new Connection("CV IN", ConnectionTypes.CV_IN, 1);
    this.cvIn.node.gain.value = ZERO;
    this.input.node.gain.value = 1;
    this.input.node.connect(this.output.node);
    this.invertedOutput = new Connection("INVERTED", ConnectionTypes.OUTPUT);
    this.attack = input ? input.attack : 0;
    this.decay = input ? input.decay : 3;
    this.sustain = input ? input.sustain : 1;
    this.release = input ? input.release : 0;
    this.invertedTimeout = null;
    this.sustaining = false;

    this.setAttack = (value: number) => {
      this.attack = value;
    };
    this.setDecay = (value: number) => {
      this.decay = value;
    };
    this.setSustain = (value: number) => {
      this.sustain = value;
      if (this.sustaining) {
        this.output.node.gain.linearRampToValueAtTime(
          value,
          CONTEXT.currentTime + FADE
        );
      }
    };
    this.setRelease = (value: number) => {
      this.release = value;
    };

    this.timeout = null;

    this.start = async () => {
      if (this.timeout) clearTimeout(this.timeout);
      this.output.node.gain.cancelScheduledValues(0);
      this.output.node.gain.cancelAndHoldAtTime(0);
      this.sustaining = false;

      //MUTE

      if (this.attack > 0) {
        this.output.node.gain.exponentialRampToValueAtTime(
          ZERO,
          CONTEXT.currentTime + FADE
        );
      }

      //ATTACK

      this.timeout = setTimeout(() => {
        this.output.node.gain.linearRampToValueAtTime(
          1,
          CONTEXT.currentTime + this.attack + FADE
        );

        // DECAY TO SUSTAIN

        this.timeout = setTimeout(() => {
          this.output.node.gain.linearRampToValueAtTime(
            this.sustain,
            CONTEXT.currentTime + this.attack + this.decay
          );
          this.timeout = setTimeout(() => {
            this.sustaining = true;
          }, (this.decay + FADE) * 1000);
        }, (this.attack + FADE) * 1000);
      }, FADE * 1000);
    };

    this.stop = () => {
      if (this.timeout) clearTimeout(this.timeout);
      this.output.node.gain.cancelScheduledValues(0);
      this.output.node.gain.cancelAndHoldAtTime(0);
      this.sustaining = false;
      this.output.node.gain.linearRampToValueAtTime(
        ZERO,
        CONTEXT.currentTime + this.release + FADE
      );
    };

    this.trigger = (freq?: number) => {
      if (freq) {
        this.start();
      } else {
        this.stop();
      }
    };

    this.shutdown = () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.output.node.gain.value = ZERO;
      this.output.node.disconnect();
      this.input.node.disconnect();
      this.cvIn.node.disconnect();
    };
  }
}
