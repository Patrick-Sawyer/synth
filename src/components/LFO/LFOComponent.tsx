import { RefObject } from "react";
import { INIT_RATE, INIT_VOL, LFO } from "../../audioUnits/LFO";
import { WaveTypes } from "../../audioUnits/Oscillator";
import {
  calcInitTypeIndex,
  WAVE_TYPES,
} from "../Oscillator/OscillatorComponent";
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
      </UnitColumn>
      <UnitColumn>
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.amIn}
          unitKey={props.unitKey}
          connectionKey={"amIn"}
        >
          <Knob
            min={0}
            max={10}
            resetValue={0}
            initValue={
              props.amIn.node.gain.value === undefined
                ? 0
                : props.amIn.node.gain.value
            }
            small
            onChange={props.setAmAmount}
            exponentialAmount={2}
          />
        </AudioConnection>
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
            initValue={
              props.amIn.node.gain.value === undefined
                ? 0
                : props.amIn.node.gain.value
            }
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
