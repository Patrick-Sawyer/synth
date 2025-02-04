import { ComponentProps, RefObject } from "react";
import { Delay, SavedDelay } from "../audioUnits/Delay";
import { DrumMachine, SavedDrumMachine } from "../audioUnits/DrumMachine";
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
import { DelayComponent } from "../components/Delay/DelayComponent";
import { DrumMachineComponent } from "../components/DrumMachine/DrumMachineComponent";
import { EnvelopeComponent } from "../components/Envelope/EnvelopeComponent";
import { FilterComponent } from "../components/Filter/FilterComponent";
import { LFOComponent } from "../components/LFO/LFOComponent";
import { OscillatorComponent } from "../components/Oscillator/OscillatorComponent";
import { ReverbComponent } from "../components/Reverb/ReverbComponent";

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
        case AudioUnitTypes.DRUM_MACHINE:
          return new DrumMachine(unit as SavedDrumMachine);
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
            waveform: unit.currentWaveform,
            octave: unit.octave,
            detune: unit.detune,
            pan: unit.pan.pan.value,
            unitKey: unit.unitKey,
            amAmount: unit.amIn.node.gain.value,
            fmAmount: unit.fmIn.node.gain.value,
            pulseWidth: unit.pulse.width.value,
            pulseWidthModulation: unit.pwm.node.gain.value,
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
            wet: unit.dryWetValue,
          } as SavedReverb;
        case AudioUnitTypes.LFO:
          return {
            type: AudioUnitTypes.LFO,
            unitKey: unit.unitKey,
            waveform: unit.oscillator.type,
            rate: unit.oscillator.frequency.value,
            amount: unit.output.node.gain.value,
            fmAmount: unit.fmAmount,
          } as SavedLFO;
        case AudioUnitTypes.FILTER:
          return {
            type: AudioUnitTypes.FILTER,
            unitKey: unit.unitKey,
            waveform: unit.filter.type,
            fmAmount: unit.fmAmount,
            resonance: unit.filter.Q.value,
            frequency: unit.frequency,
          } as SavedFilter;
        case AudioUnitTypes.DELAY:
          return {
            type: AudioUnitTypes.DELAY,
            unitKey: unit.unitKey,
            time: unit.delay.delayTime.value,
            feedback: unit.feedback.gain.value,
            wet: unit.wet.gain.value,
            dry: unit.dry.gain.value,
          } as SavedDelay;
        case AudioUnitTypes.DRUM_MACHINE:
          return {
            type: AudioUnitTypes.DRUM_MACHINE,
            unitKey: unit.unitKey,
            pitch: unit.pitch,
            volume: unit.volume,
            selectedIndex: unit.selectedIndex,
            selectedCategoryIndex: unit.selectedCategoryIndex,
            grid: unit.grid,
          } as SavedDrumMachine;
        default:
          return null as unknown as SavedUnit;
      }
    })
    .filter((unit) => !!unit);
};

export const getUnit = (
  unit: AudioUnit & { wrapperRef: RefObject<HTMLDivElement> }
): React.ReactElement | null => {
  switch (unit.type) {
    case AudioUnitTypes.OSCILLATOR:
      return (
        <OscillatorComponent
          {...(unit as unknown as ComponentProps<typeof OscillatorComponent>)}
        />
      );

    case AudioUnitTypes.ENVELOPE:
      return (
        <EnvelopeComponent
          {...(unit as unknown as ComponentProps<typeof EnvelopeComponent>)}
        />
      );

    case AudioUnitTypes.REVERB:
      return (
        <ReverbComponent
          {...(unit as unknown as ComponentProps<typeof ReverbComponent>)}
        />
      );

    case AudioUnitTypes.LFO:
      return (
        <LFOComponent
          {...(unit as unknown as ComponentProps<typeof LFOComponent>)}
        />
      );

    case AudioUnitTypes.FILTER:
      return (
        <FilterComponent
          {...(unit as unknown as ComponentProps<typeof FilterComponent>)}
        />
      );

    case AudioUnitTypes.DELAY:
      return (
        <DelayComponent
          {...(unit as unknown as ComponentProps<typeof DelayComponent>)}
        />
      );

    case AudioUnitTypes.DRUM_MACHINE:
      return (
        <DrumMachineComponent
          {...(unit as unknown as ComponentProps<typeof DrumMachineComponent>)}
        />
      );

    default:
      return null;
  }
};
