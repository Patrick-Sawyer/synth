import { CONTEXT } from "../App";
import { BaseUnit, FADE, ZERO } from "./BaseUnit";
import { AudioUnitTypes } from "./types";

const INIT_GRID = new Array(16).fill(false);

interface SampleOption {
  text: string;
  path: string;
}

interface SampleCategory {
  name: string;
  samples: Array<SampleOption>;
}

export const SAMPLES: Array<SampleCategory> = [
  {
    name: "KICKS",
    samples: [
      { text: "KICK 1", path: "kick1.wav" },
      { text: "KICK 2", path: "kick2.wav" },
      { text: "KICK 3", path: "kick3.wav" },
      { text: "KICK 4", path: "kick4.wav" },
      { text: "KICK 5", path: "kick5.wav" },
      { text: "KICK 6", path: "kick6.wav" },
      { text: "KICK 7", path: "kick7.wav" },
    ],
  },
  {
    name: "SNARES",
    samples: [
      { text: "SNARE 1", path: "snare1.wav" },
      { text: "SNARE 2", path: "snare2.wav" },
      { text: "SNARE 3", path: "snare3.wav" },
      { text: "CLAP 1", path: "clap1.wav" },
      { text: "CLAP 2", path: "clap2.wav" },
      { text: "CLAP 3", path: "clap3.wav" },
      { text: "CLAP 4", path: "clap4.wav" },
      { text: "CLAP 5", path: "clap5.wav" },
      { text: "CLAP 6", path: "clap6.wav" },
    ],
  },
  {
    name: "HI HATS",
    samples: [
      { text: "HH 1", path: "hh1.wav" },
      { text: "HH 2", path: "hh2.wav" },
      { text: "HH 3", path: "hh3.wav" },
      { text: "HH 4", path: "hh4.wav" },
      { text: "HH 5", path: "hh5.wav" },
      { text: "HH 6", path: "hh6.wav" },
      { text: "HH 7", path: "hh7.wav" },
      { text: "HH 8", path: "hh8.wav" },
      { text: "HH 9", path: "hh9.wav" },
      { text: "HH 10", path: "hh10.wav" },
    ],
  },
  {
    name: "MISC",
    samples: [
      { text: "RIDE 1", path: "ride1.wav" },
      { text: "RIDE 2", path: "ride2.wav" },
      { text: "RIDE 3", path: "ride3.wav" },
      { text: "TAMB", path: "tamb1.wav" },
      { text: "SHAKER", path: "shaker.wav" },
      { text: "CONGA", path: "conga.wav" },
    ],
  },
];

export interface SavedDrumMachine {
  unitKey: string;
  type: AudioUnitTypes.DRUM_MACHINE;
  pitch: number;
  volume: number;
  selectedIndex: number;
  selectedCategoryIndex: number;
  grid: Array<boolean>;
}

export class DrumMachine extends BaseUnit {
  sampleSelect: (option: string, index: number) => void;
  grid: Array<boolean>;
  pitch: number;
  play: () => void;
  setPitch: (pitch: number) => void;
  setVolume: (value: number) => void;
  loadBuffer: (catIndex: number, sampleIndex: number) => void;
  buffer?: AudioBuffer;
  selectedIndex: number;
  selectedCategoryIndex: number;
  updateGrid: (grid: Array<boolean>) => void;
  source?: AudioBufferSourceNode;
  volume: number;

  constructor(input?: SavedDrumMachine) {
    super(AudioUnitTypes.DRUM_MACHINE, input?.unitKey);
    this.output.node.gain.value =
      input?.volume === undefined ? 1 : input.volume;
    this.grid = input?.grid || INIT_GRID;
    this.pitch = input?.pitch === undefined ? 1 : input.pitch;
    this.selectedIndex = input?.selectedIndex || 0;
    this.selectedCategoryIndex = input?.selectedCategoryIndex || 0;
    this.volume = input?.volume === undefined ? 1 : input.volume;

    this.sampleSelect = (option: string, index: number) => {
      this.selectedCategoryIndex = index;
      const category = SAMPLES[index];
      const sampleIndex = category.samples
        .map(({ text }) => text)
        .indexOf(option);
      this.loadBuffer(index, sampleIndex);
    };

    this.play = () => {
      if (!this.buffer) return;
      this.source = CONTEXT.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.connect(this.output.node);
      const pitch = this.pitch >= 1 ? this.pitch : this.pitch / 2 + 0.5;
      this.source.playbackRate.value = pitch;
      this.source.start();
    };

    this.setPitch = (pitch: number) => {
      this.pitch = pitch;
    };

    this.setVolume = (value: number) => {
      this.volume = value;
      this.output.node.gain.linearRampToValueAtTime(
        value,
        CONTEXT.currentTime + FADE
      );
    };

    this.loadBuffer = async (catIndex: number, sampleIndex: number) => {
      if (catIndex < 0) return;
      if (sampleIndex < 0) return;
      const name = SAMPLES[catIndex].samples[sampleIndex].path;
      if (!name) return;
      const path = "samples/" + name;
      const audioBuffer = await fetch(path)
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => CONTEXT.decodeAudioData(arrayBuffer));

      this.buffer = audioBuffer;
    };

    this.shutdown = () => {
      this.output.node.gain.value = ZERO;
      this.output.node.disconnect();
      this.source?.disconnect();
      delete this.source;
      delete this.buffer;
      this.buffer = undefined;
      this.source = undefined;
    };

    this.updateGrid = (grid: Array<boolean>) => {
      this.grid = grid;
    };

    this.loadBuffer(this.selectedIndex, this.selectedCategoryIndex);
  }
}
