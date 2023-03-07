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
  ReverbTypes.ROOM,
];

const calculateInitTypeIndex = (type: ReverbTypes) => {
  switch (type) {
    case ReverbTypes.HALL:
      return 0;
    case ReverbTypes.SPRING:
      return 1;
    case ReverbTypes.WAREHOUSE:
      return 2;
    case ReverbTypes.CHURCH:
      return 3;
    case ReverbTypes.DIRTY:
      return 4;
    case ReverbTypes.ROOM:
      return 5;

    default:
      return 0;
  }
};

export function ReverbComponent(
  props: Reverb & { wrapperRef: RefObject<HTMLDivElement> }
) {
  return (
    <BaseAudioUI color={props.color} title={"Reverb unit"} letterSpacing={17}>
      <UnitColumn>
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.input}
          unitKey={props.unitKey}
          connectionKey={"input"}
        />

        <MultiSelect
          label="TYPE"
          options={OPTIONS}
          initIndex={calculateInitTypeIndex(props.reverbType)}
          onPress={(value) => {
            props.setType(value as ReverbTypes);
          }}
          chars={10}
        />
        <Knob
          text="DRY / WET"
          min={0}
          max={1}
          resetValue={0}
          initValue={props.dryWetValue === undefined ? 1 : props.dryWetValue}
          onChange={props.setReverbVolume}
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
