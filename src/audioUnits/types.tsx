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
}

export type AudioUnit = Oscillator | Envelope | Reverb | LFO | Filter;
export type SavedUnit =
  | SavedOscillator
  | SavedEnvelope
  | SavedReverb
  | SavedLFO
  | SavedFilter;
export type Patch = Array<SavedUnit>;
