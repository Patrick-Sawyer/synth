import { RefObject } from "react";
import { Envelope } from "../../audioUnits/Envelope";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { BaseAudioUI } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { Knob } from "../unitBlocks/Knob";

import { UnitColumn } from "../unitBlocks/UnitColumn";

export function EnvelopeComponent(
  props: Envelope & { wrapperRef: RefObject<HTMLDivElement> }
) {
  return (
    <BaseAudioUI color={props.color}>
      <UnitColumn>
        <Knob
          text={"ATTACK"}
          min={0}
          max={1}
          initValue={props.attack}
          resetValue={0}
          onChange={props.setAttack}
        />
        <Knob
          text={"SUSTAIN"}
          min={0}
          max={1}
          initValue={props.sustain}
          resetValue={1}
          onChange={props.setSustain}
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.input}
          unitKey={props.unitKey}
          connectionKey={"input"}
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.cvIn}
          unitKey={props.unitKey}
          connectionKey={"cvIn"}
        />
      </UnitColumn>
      <UnitColumn>
        <Knob
          text={"DECAY"}
          min={0}
          max={3}
          initValue={props.decay}
          resetValue={3}
          onChange={props.setDecay}
        />
        <Knob
          text={"RELEASE"}
          min={0}
          max={3}
          initValue={props.release}
          resetValue={0}
          onChange={props.setRelease}
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.invertedOutput}
          unitKey={props.unitKey}
          connectionKey={"invertedOutput"}
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