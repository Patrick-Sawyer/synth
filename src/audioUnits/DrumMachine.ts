import { BaseUnit } from "./BaseUnit";
import { AudioUnitTypes } from "./types";

export interface SavedDrumMachine {
  unitKey: string;
  type: AudioUnitTypes.DRUM_MACHINE;
}

export class DrumMachine extends BaseUnit {
  constructor(input?: SavedDrumMachine) {
    super(AudioUnitTypes.DRUM_MACHINE, input?.unitKey);
  }
}
