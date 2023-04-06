import { Delay, SavedDelay } from "./Delay";
import { DrumMachine, SavedDrumMachine } from "./DrumMachine";
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
  DRUM_MACHINE = "drum-machine",
}

export type AudioUnit =
  | Oscillator
  | Envelope
  | Reverb
  | LFO
  | Filter
  | Delay
  | DrumMachine;
export type SavedUnit =
  | SavedOscillator
  | SavedEnvelope
  | SavedReverb
  | SavedLFO
  | SavedFilter
  | SavedDelay
  | SavedDrumMachine;

export type Patch = Array<SavedUnit>;
