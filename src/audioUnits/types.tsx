import { Delay, SavedDelay } from "./Delay";
import { Envelope, SavedEnvelope } from "./Envelope";
import { Filter, SavedFilter } from "./Filter";
import { LFO, SavedLFO } from "./LFO";
import { Oscillator, SavedOscillator } from "./Oscillator";
import { Reverb, SavedReverb } from "./Reverb";

export enum AudioUnitTypes {
  OSCILLATOR = "Oscillator",
  ENVELOPE = "Enveloper",
  REVERB = "Reverb",
  LFO = "LFO",
  FILTER = "filter",
  DELAY = "delay",
}

export type AudioUnit = Oscillator | Envelope | Reverb | LFO | Filter | Delay;
export type SavedUnit =
  | SavedOscillator
  | SavedEnvelope
  | SavedReverb
  | SavedLFO
  | SavedFilter
  | SavedDelay;

export type Patch = Array<SavedUnit>;
