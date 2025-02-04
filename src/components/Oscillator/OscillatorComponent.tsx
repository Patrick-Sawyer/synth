import { RefObject } from "react";
import { ZERO } from "../../audioUnits/BaseUnit";
import { Oscillator, WaveTypes } from "../../audioUnits/Oscillator";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { BaseAudioUI } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { Knob } from "../unitBlocks/Knob";
import { MultiSelect } from "../unitBlocks/MultiSelect";
import { UnitColumn } from "../unitBlocks/UnitColumn";

export const WAVE_TYPES: Array<WaveTypes | "pulse"> = [
  "sine",
  "sawtooth",
  "triangle",
  "pulse",
];

const OCTAVES = ["1", "2", "4", "8"];

export const calcInitTypeIndex = (type: string) => {
  if (type === "sine") return 0;
  if (type === "sawtooth") return 1;
  if (type === "triangle") return 2;
  if (type === "pulse" || "square") return 3;

  return 0;
};

const calcInitOctaveIndex = (oct: number) => {
  if (oct === 1) return 0;
  if (oct === 2) return 1;
  if (oct === 4) return 2;
  if (oct === 8) return 3;

  return 0;
};

export function OscillatorComponent(
  props: Oscillator & { wrapperRef: RefObject<HTMLDivElement> }
) {
  return (
    <BaseAudioUI
      color={props.color}
      title={"oscillator"}
      thisUnitKey={props.unitKey}
    >
      <UnitColumn>
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.cvIn}
          unitKey={props.unitKey}
          connectionKey={"cvIn"}
        />
        <MultiSelect
          label="WAVE"
          options={WAVE_TYPES}
          initIndex={calcInitTypeIndex(props.currentWaveform)}
          onPress={(option: any) => {
            props.setWaveform(option as WaveTypes);
          }}
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.pwm}
          unitKey={props.unitKey}
          connectionKey={"pwm"}
        >
          <Knob
            min={0}
            max={1.5}
            resetValue={ZERO}
            initValue={
              props.pulseGain.gain.value !== undefined
                ? props.pulseGain.gain.value
                : ZERO
            }
            small
            onChange={props.setPwm}
            exponentialAmount={3}
          />
        </AudioConnection>
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
          small
        />
        <Knob
          text="PW"
          min={0}
          max={0.7}
          initValue={
            props.pulse.width?.value === undefined ? 0 : props.pulse.width.value
          }
          resetValue={0}
          onChange={props.setPulseWidth}
          exponentialAmount={2}
          small
        />
        <AudioConnection
          wrapperRef={props.wrapperRef}
          connection={props.fmIn}
          unitKey={props.unitKey}
          connectionKey={"fmIn"}
        >
          <Knob
            min={0}
            max={10000}
            resetValue={0}
            initValue={
              props.fmIn.node.gain.value === undefined
                ? 0
                : props.fmIn.node.gain.value
            }
            small
            onChange={props.setFmAmount}
            exponentialAmount={2}
          />
        </AudioConnection>
      </UnitColumn>
      <UnitColumn>
        <Knob
          text={"VOL"}
          min={0}
          max={1}
          initValue={props.mainVolume.gain.value || 0}
          resetValue={0}
          onChange={props.setVolume}
        />
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
