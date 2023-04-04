import { RefObject } from "react";
import {
  Delay,
  INIT_DELAY_FEEDBACK,
  INIT_DELAY_TIME,
  INIT_DRY_VALUE,
  INIT_WET_VALUE,
} from "../../audioUnits/Delay";
import { debounce } from "../../utils/debounce";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { BaseAudioUI } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { Knob } from "../unitBlocks/Knob";
import { UnitColumn } from "../unitBlocks/UnitColumn";

export function DelayComponent(
  props: Delay & { wrapperRef: RefObject<HTMLDivElement> }
) {
  return (
    <BaseAudioUI
      color={props.color}
      title={"delay"}
      thisUnitKey={props.unitKey}
    >
      <UnitColumn>
        <Knob
          text="TIME"
          initValue={
            props.delay.delayTime.value === undefined
              ? INIT_DELAY_TIME
              : props.delay.delayTime.value
          }
          resetValue={INIT_DELAY_TIME}
          onChange={debounce(props.setDelayTime, 300)}
          min={0}
          max={1}
        />
        <Knob
          text="DRY"
          initValue={
            props.dry.gain.value === undefined
              ? INIT_DRY_VALUE
              : props.dry.gain.value
          }
          resetValue={0}
          exponentialAmount={2}
          onChange={props.setDry}
          min={0}
          max={1}
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.input}
          unitKey={props.unitKey}
          connectionKey={"input"}
        />
      </UnitColumn>
      <UnitColumn>
        <Knob
          text="FEEDBACK"
          initValue={
            props.feedback.gain.value === undefined
              ? INIT_DELAY_FEEDBACK
              : props.feedback.gain.value
          }
          resetValue={0}
          exponentialAmount={2}
          onChange={props.setFeedback}
          min={0}
          max={0.9}
        />
        <Knob
          text="WET"
          initValue={
            props.wet.gain.value === undefined
              ? INIT_WET_VALUE
              : props.wet.gain.value
          }
          resetValue={0}
          exponentialAmount={2}
          onChange={props.setWet}
          min={0}
          max={1}
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
