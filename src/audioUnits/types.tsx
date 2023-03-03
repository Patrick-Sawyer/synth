import { Envelope, SavedEnvelope } from "./Envelope";
import { Oscillator, SavedOscillator } from "./Oscillator";
import { Reverb, SavedReverb } from "./Reverb";

export enum AudioUnitTypes {
  OSCILLATOR = "Oscillator",
  ENVELOPE = "Enveloper",
  REVERB = "Reverb",
}

export type AudioUnit = Oscillator | Envelope | Reverb;
export type SavedUnit = SavedOscillator | SavedEnvelope | SavedReverb;
export type Patch = Array<SavedUnit>;
