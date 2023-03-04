import { RefObject } from "react";
import { INIT_RATE, INIT_VOL, LFO } from "../../audioUnits/LFO";
import { WaveTypes } from "../../audioUnits/Oscillator";
import { calcInitTypeIndex, WAVE_TYPES } from "../Oscillator/Oscillator";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { BaseAudioUI } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { Knob } from "../unitBlocks/Knob";
import { MultiSelect } from "../unitBlocks/MultiSelect";
import { UnitColumn } from "../unitBlocks/UnitColumn";

export function LFOComponent(
  props: LFO & { wrapperRef: RefObject<HTMLDivElement> }
) {
  return (
    <BaseAudioUI color={props.color}>
      <UnitColumn>
        <Knob
          text="RATE"
          min={1}
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
        <Knob
          text="AMOUNT"
          min={0}
          max={1}
          onChange={props.setAmount}
          initValue={
            props.output.node.gain.value === undefined
              ? INIT_VOL
              : props.output.node.gain.value
          }
          resetValue={0.3}
          exponentialAmount={2}
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
