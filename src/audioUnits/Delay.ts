import { CONTEXT } from "../App";
import { ConnectionTypes } from "../ConnectionContext";
import { BaseUnit, FADE } from "./BaseUnit";
import { Connection } from "./Connection";
import { AudioUnitTypes } from "./types";

export interface SavedDelay {
  unitKey: string;
  type: AudioUnitTypes.DELAY;
  wet: number;
  dry: number;
  feedback: number;
  time: number;
}

export const INIT_DELAY_TIME = 500;
export const INIT_DELAY_FEEDBACK = 0.5;
export const INIT_DRY_VALUE = 1;
export const INIT_WET_VALUE = 1;

export class Delay extends BaseUnit {
  input: Connection;
  delay: DelayNode;
  feedback: GainNode;
  dry: GainNode;
  wet: GainNode;
  setWet: (value: number) => void;
  setDry: (value: number) => void;
  setFeedback: (value: number) => void;
  setDelayTime: (value: number) => void;
  constructor(input?: SavedDelay) {
    super(AudioUnitTypes.DELAY, input?.unitKey);
    this.output.node.gain.value = 1;

    this.input = new Connection("INPUT", ConnectionTypes.INPUT);
    this.input.node.gain.value = 1;

    this.delay = CONTEXT.createDelay();
    this.delay.delayTime.value =
      input?.time === undefined ? INIT_DELAY_TIME : input.time;
    this.input.node.connect(this.delay);

    this.feedback = CONTEXT.createGain();
    this.feedback.gain.value =
      input?.feedback === undefined ? INIT_DELAY_FEEDBACK : input.feedback;
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);

    this.dry = CONTEXT.createGain();
    this.dry.gain.value = input?.dry === undefined ? INIT_DRY_VALUE : input.dry;
    this.input.node.connect(this.dry);
    this.dry.connect(this.output.node);

    this.wet = CONTEXT.createGain();
    this.wet.gain.value = input?.wet === undefined ? INIT_WET_VALUE : input.wet;
    this.delay.connect(this.wet);
    this.wet.connect(this.output.node);

    this.setWet = (value: number) => {
      this.wet.gain.linearRampToValueAtTime(value, CONTEXT.currentTime + FADE);
    };

    this.setDry = (value: number) => {
      this.dry.gain.linearRampToValueAtTime(value, CONTEXT.currentTime + FADE);
    };

    this.setFeedback = (value: number) => {
      this.feedback.gain.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
    };

    this.setDelayTime = (value: number) => {
      this.delay.delayTime.value = value;
    };
  }
}
