import { RefObject } from "react";
import { INIT_RATE, INIT_VOL, LFO } from "../../audioUnits/LFO";
import { WaveTypes } from "../../audioUnits/Oscillator";
import { calcInitTypeIndex } from "../Oscillator/OscillatorComponent";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { BaseAudioUI } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { Knob } from "../unitBlocks/Knob";
import { MultiSelect } from "../unitBlocks/MultiSelect";
import { UnitColumn } from "../unitBlocks/UnitColumn";

const WAVE_TYPES: Array<WaveTypes | "pulse"> = [
  "sine",
  "sawtooth",
  "triangle",
  "square",
];

export function LFOComponent(
  props: LFO & { wrapperRef: RefObject<HTMLDivElement> }
) {
  return (
    <BaseAudioUI color={props.color} title={"Low Frequency Osc"}>
      <UnitColumn>
        <Knob
          text="RATE"
          min={0}
          max={100}
          onChange={props.setLFO}
          initValue={
            props.oscillator.frequency.value === undefined
              ? INIT_RATE
              : props.oscillator.frequency.value
          }
          resetValue={10}
          exponentialAmount={3}
        />
        <MultiSelect
          label={"WAVE"}
          options={WAVE_TYPES}
          initIndex={calcInitTypeIndex(props.oscillator.type)}
          onPress={(option: any) => {
            props.setWaveform(option as WaveTypes);
          }}
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.fmIn}
          unitKey={props.unitKey}
          connectionKey={"fmIn"}
        >
          <Knob
            min={0}
            max={10}
            resetValue={0}
            initValue={props.fmAmount || 0}
            small
            onChange={props.setFmAmount}
            exponentialAmount={2}
          />
        </AudioConnection>
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
