import { Envelope, SavedEnvelope } from "./Envelope";
import { LFO, SavedLFO } from "./LFO";
import { Oscillator, SavedOscillator } from "./Oscillator";
import { Reverb, SavedReverb } from "./Reverb";

export enum AudioUnitTypes {
  OSCILLATOR = "Oscillator",
  ENVELOPE = "Enveloper",
  REVERB = "Reverb",
  LFO = "LFO",
}

export type AudioUnit = Oscillator | Envelope | Reverb | LFO;
export type SavedUnit =
  | SavedOscillator
  | SavedEnvelope
  | SavedReverb
  | SavedLFO;
export type Patch = Array<SavedUnit>;
