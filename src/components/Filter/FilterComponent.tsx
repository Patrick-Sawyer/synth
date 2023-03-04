import { RefObject } from "react";
import {
  Filter,
  FilterTypes,
  FILTER_INIT_FREQ,
  FILTER_INIT_RESONANCE,
} from "../../audioUnits/Filter";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { BaseAudioUI } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { Knob } from "../unitBlocks/Knob";
import { MultiSelect } from "../unitBlocks/MultiSelect";
import { UnitColumn } from "../unitBlocks/UnitColumn";

const FILTER_TYPES = ["low", "high", "band"];

export function FilterComponent(
  props: Filter & { wrapperRef: RefObject<HTMLDivElement> }
) {
  return (
    <BaseAudioUI color={props.color}>
      <UnitColumn>
        <Knob
          text="FREQ"
          min={20}
          max={20000}
          exponentialAmount={3}
          resetValue={20000}
          initValue={
            props.filter.frequency.value === undefined
              ? FILTER_INIT_FREQ
              : props.filter.frequency.value
          }
          onChange={props.setFreq}
        />
        <MultiSelect
          label="TYPE"
          options={FILTER_TYPES}
          chars={10}
          onPress={(value) => {
            props.setType((value + "pass") as FilterTypes);
          }}
        />
        <AudioConnection
          unitKey={props.unitKey}
          connectionKey={"input"}
          wrapperRef={props.wrapperRef}
          connection={props.input}
        />
      </UnitColumn>
      <UnitColumn>
        <Knob
          text="RES"
          min={0}
          max={10}
          exponentialAmount={2}
          resetValue={0}
          initValue={
            props.filter.Q.value === undefined
              ? FILTER_INIT_RESONANCE
              : props.filter.Q.value
          }
          onChange={props.setResonance}
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.fmIn}
          unitKey={props.unitKey}
          connectionKey={"fmIn"}
        >
          <Knob
            min={0}
            max={20000}
            resetValue={0}
            initValue={props.fmAmount}
            small
            onChange={props.setFmAmount}
            exponentialAmount={2}
          />
        </AudioConnection>
        <AudioConnection
          unitKey={props.unitKey}
          connectionKey={"output"}
          wrapperRef={props.wrapperRef}
          connection={props.output}
        />
      </UnitColumn>
    </BaseAudioUI>
  );
}
