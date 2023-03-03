import { RefObject } from "react";
import { Reverb, ReverbTypes } from "../../audioUnits/Reverb";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { BaseAudioUI } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { Knob } from "../unitBlocks/Knob";
import { MultiSelect } from "../unitBlocks/MultiSelect";
import { UnitColumn } from "../unitBlocks/UnitColumn";

const OPTIONS: Array<ReverbTypes> = [
  ReverbTypes.HALL,
  ReverbTypes.SPRING,
  ReverbTypes.WAREHOUSE,
  ReverbTypes.CHURCH,
  ReverbTypes.DIRTY,
];

export function ReverbComponent(
  props: Reverb & { wrapperRef: RefObject<HTMLDivElement> }
) {
  return (
    <BaseAudioUI color={props.color}>
      <UnitColumn>
        <MultiSelect
          label="TYPE"
          options={OPTIONS}
          onPress={(value) => {
            props.setType(value as ReverbTypes);
          }}
          chars={10}
        />
        <Knob
          text="DRY"
          min={0}
          max={1}
          resetValue={0}
          initValue={props.dry.gain.value || 1}
          onChange={props.setDryVolume}
        />
      </UnitColumn>
      <UnitColumn>
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.input}
          unitKey={props.unitKey}
          connectionKey={"input"}
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.output}
          unitKey={props.unitKey}
          connectionKey={"output"}
        />
        <Knob
          text="WET"
          min={0}
          max={1}
          resetValue={0}
          initValue={props.reverbVolume.gain.value || 1}
          onChange={props.setReverbVolume}
        />
      </UnitColumn>
    </BaseAudioUI>
  );
}
