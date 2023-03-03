import { RefObject } from "react";
import { Oscillator, WaveTypes } from "../../audioUnits/Oscillator";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { BaseAudioUI } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { Knob } from "../unitBlocks/Knob";
import { MultiSelect } from "../unitBlocks/MultiSelect";
import { UnitColumn } from "../unitBlocks/UnitColumn";

const WAVE_TYPES: WaveTypes[] = ["sine", "sawtooth", "triangle", "square"];
const OCTAVES = ["1", "2", "4", "8"];

const calcInitTypeIndex = (type: string) => {
  if (type === "sine") return 0;
  if (type === "sawtooth") return 1;
  if (type === "triangle") return 2;
  if (type === "square") return 3;

  return 0;
};

const calcInitOctaveIndex = (oct: number) => {
  if (oct === 1) return 1;
  if (oct === 2) return 2;
  if (oct === 4) return 3;
  if (oct === 8) return 4;

  return 0;
};

export function OscillatorComponent(
  props: Oscillator & { wrapperRef: RefObject<HTMLDivElement> }
) {
  return (
    <BaseAudioUI color={props.color}>
      <UnitColumn>
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.cvIn}
          unitKey={props.unitKey}
          connectionKey={"cvIn"}
        />

        <MultiSelect
          label={"TYPE"}
          options={WAVE_TYPES}
          initIndex={calcInitTypeIndex(props.oscillator.type)}
          onPress={(option: any) => {
            props.setWaveform(option as WaveTypes);
          }}
        />

        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.amIn}
          unitKey={props.unitKey}
          connectionKey={"amIn"}
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.fmIn}
          unitKey={props.unitKey}
          connectionKey={"fmIn"}
        />
      </UnitColumn>
      <UnitColumn>
        <Knob
          text={"TUNE"}
          min={-1200}
          max={1200}
          initValue={props.oscillator.detune.value || 0}
          resetValue={0}
          onChange={props.setOffset}
        />
        <Knob
          text="PAN"
          min={-1}
          max={1}
          initValue={props.pan.pan.value || 0}
          resetValue={0}
          onChange={props.setPan}
        />
      </UnitColumn>
      <UnitColumn>
        <MultiSelect
          label={"OCT"}
          options={OCTAVES}
          initIndex={calcInitOctaveIndex(props.octave)}
          onPress={(option: string) => {
            const int = Number(option);
            if (!Number.isNaN(int)) {
              props.setOctave(int);
            }
          }}
        />
        <Knob
          text={"VOL"}
          min={0}
          max={1}
          initValue={props.mainVolume.gain.value || 0}
          resetValue={0}
          onChange={props.setVolume}
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.output}
          unitKey={props.unitKey}
          connectionKey={"output"}
        />
      </UnitColumn>
    </BaseAudioUI>
  );
}
