import { Delay, SavedDelay } from "../audioUnits/Delay";
import { Envelope, SavedEnvelope } from "../audioUnits/Envelope";
import { Filter, SavedFilter } from "../audioUnits/Filter";
import { LFO, SavedLFO } from "../audioUnits/LFO";
import { Oscillator, SavedOscillator } from "../audioUnits/Oscillator";
import { Reverb, SavedReverb } from "../audioUnits/Reverb";
import {
  AudioUnit,
  AudioUnitTypes,
  Patch,
  SavedUnit,
} from "../audioUnits/types";

export const formatOnLoad = (units: Patch): Array<AudioUnit> => {
  return units
    .map((unit) => {
      switch (unit.type) {
        case AudioUnitTypes.OSCILLATOR:
          return new Oscillator(unit as SavedOscillator);
        case AudioUnitTypes.ENVELOPE:
          return new Envelope(unit as SavedEnvelope);
        case AudioUnitTypes.REVERB:
          return new Reverb(unit as SavedReverb);
        case AudioUnitTypes.LFO:
          return new LFO(unit as SavedLFO);
        case AudioUnitTypes.FILTER:
          return new Filter(unit as SavedFilter);
        case AudioUnitTypes.DELAY:
          return new Delay(unit as SavedDelay);
        default:
          return null;
      }
    })
    .filter((unit) => !!unit) as Array<AudioUnit>;
};

export const formatOnSave = (units: Array<any>): Patch => {
  return units
    .map((unit) => {
      switch (unit.type) {
        case AudioUnitTypes.OSCILLATOR:
          return {
            type: AudioUnitTypes.OSCILLATOR,
            mainVolume: unit.mainVolume.gain.value,
            waveform: unit.oscillator.type,
            octave: unit.octave,
            detune: unit.oscillator.detune.value,
            pan: unit.pan.pan.value,
            unitKey: unit.unitKey,
            amAmount: unit.amIn.node.gain.value,
            fmAmount: unit.fmIn.node.gain.value,
          } as SavedOscillator;
        case AudioUnitTypes.ENVELOPE:
          return {
            type: AudioUnitTypes.ENVELOPE,
            unitKey: unit.unitKey,
            attack: unit.attack,
            decay: unit.decay,
            sustain: unit.sustain,
            release: unit.release,
          } as SavedEnvelope;
        case AudioUnitTypes.REVERB:
          return {
            type: AudioUnitTypes.REVERB,
            unitKey: unit.unitKey,
            reverbType: unit.reverbType,
            dry: unit.dry.gain.value,
            wet: unit.reverbVolume.gain.value,
          } as SavedReverb;
        case AudioUnitTypes.LFO:
          return {
            type: AudioUnitTypes.LFO,
            unitKey: unit.unitKey,
            waveform: unit.oscillator.type,
            rate: unit.oscillator.frequency.value,
            amount: unit.output.node.gain.value,
            fmAmount: unit.fmIn.node.gain.value,
            amAmount: unit.amIn.node.gain.value,
          } as SavedLFO;
        case AudioUnitTypes.FILTER:
          return {
            type: AudioUnitTypes.FILTER,
            unitKey: unit.unitKey,
            waveform: unit.filter.type,
            fmAmount: unit.fmAmount,
            resonance: unit.filter.Q.value,
            frequency: unit.filter.frequency.value,
          } as SavedFilter;
        case AudioUnitTypes.DELAY:
          return {
            type: AudioUnitTypes.DELAY,
          } as SavedDelay;
        default:
          return null as unknown as SavedUnit;
      }
    })
    .filter((unit) => !!unit);
};
