import { RefObject } from "react";
import { DrumMachine } from "../../audioUnits/DrumMachine";
import { BaseAudioUI } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { UnitColumn } from "../unitBlocks/UnitColumn";

export function DrumMachineComponent(
  props: DrumMachine & { wrapperRef: RefObject<HTMLDivElement> }
) {
  return (
    <BaseAudioUI color={props.color} title="drums" thisUnitKey={props.unitKey}>
      <UnitColumn />
    </BaseAudioUI>
  );
}
