import { RefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { FADE, ZERO } from "../../audioUnits/BaseUnit";
import { DrumMachine } from "../../audioUnits/DrumMachine";
import { usePlayAndStopContext } from "../../contexts/PlayAndStopContext/PlayAndStopContext";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { BaseAudioUI } from "../unitBlocks/BaseAudioUI/BaseAudioUI";
import { DrumButton } from "../unitBlocks/DrumButton";
import { Knob } from "../unitBlocks/Knob";
import { Label } from "../unitBlocks/Label";
import { MultiSelect } from "../unitBlocks/MultiSelect";
import { UnitColumn } from "../unitBlocks/UnitColumn";

const INIT_GRID = new Array(16).fill(false);

export function DrumMachineComponent(
  props: DrumMachine & { wrapperRef: RefObject<HTMLDivElement> }
) {
  const [grid, setGrid] = useState(INIT_GRID);
  const { timerIndex, isPlaying } = usePlayAndStopContext();
  const [rolling, setRolling] = useState(false);

  const handleButtonClick = (index: number) => {
    const newGrid = [...grid];
    newGrid[index] = !newGrid[index];
    setGrid(newGrid);
  };

  const handleSampleSelect = (option: string) => {};

  const handleVolumeChange = (value: number) => {};

  const handleLengthChange = (value: number) => {};

  const handlePointerUp = () => {
    setRolling(false);
  };

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <BaseAudioUI color={props.color} title="drums" thisUnitKey={props.unitKey}>
      <MinWidthUnitColumn>
        <MultiSelect
          options={SAMPLE_OPTIONS}
          onPress={handleSampleSelect}
          initIndex={0} // TODO: get from class
          chars={10}
        />
        <RollButton onPointerDown={() => setRolling(true)} />
        <Label>{"ROLL"}</Label>
        <AudioConnection
          connection={props.output}
          unitKey={props.unitKey}
          connectionKey={"main-vol"}
          wrapperRef={props.wrapperRef}
        />
      </MinWidthUnitColumn>
      <UnitColumn>
        <Knob
          min={-0.5}
          max={2}
          resetValue={0}
          onChange={handleVolumeChange}
          initValue={0}
          text="PITCH"
          exponentialAmount={2.4}
        />
        <Knob
          min={FADE}
          max={1}
          resetValue={1}
          onChange={handleLengthChange}
          initValue={1}
          text="LENGTH"
        />
        <Knob
          min={ZERO}
          max={1}
          resetValue={1}
          onChange={handleVolumeChange}
          initValue={1}
          text="VOL"
        />
      </UnitColumn>
      <UnitColumn>
        {grid.map((selected, index) => (
          <DrumButton
            number={index + 1}
            active={isPlaying && timerIndex % 16 === index}
            selected={selected || rolling}
            key={index}
            onClick={() => {
              handleButtonClick(index);
            }}
          />
        ))}
      </UnitColumn>
    </BaseAudioUI>
  );
}

const SAMPLE_OPTIONS = [
  "KICK 1",
  "KICK 2",
  "KICK 3",
  "SNARE 1",
  "SNARE 2",
  "CLAP 1",
  "CLAP 2",
  "HI HAT 1",
  "HI HAT 2",
  "OPEN HH1",
  "OPEN HH2",
  "RIDE 1",
  "RIDE 2",
];

const MinWidthUnitColumn = styled(UnitColumn)`
  min-width: 70px;
  display: flex;
  align-items: center;
`;

const RollButton = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  position: relative;
  top: 3px;

  &:hover {
    border: 1px solid white;
  }

  &:active {
    border: 1px solid white;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
