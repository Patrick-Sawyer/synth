import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ZERO } from "../../audioUnits/BaseUnit";
import { DrumMachine, SAMPLES } from "../../audioUnits/DrumMachine";
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
  const [grid, setGrid] = useState(props.grid || INIT_GRID);
  const { timerIndex, isPlaying } = usePlayAndStopContext();
  const [rolling, setRolling] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [currentSoundCategoryIndex, setCurrentSoundCategoryIndex] = useState(0);
  const lastPlayedIndex = useRef(0);

  const handleButtonClick = useCallback(
    (index: number) => {
      const newGrid = [...grid];
      newGrid[index] = !newGrid[index];
      setGrid(newGrid);
    },
    [grid]
  );

  const handlePointerUp = () => {
    setRolling(false);
  };

  const categories = SAMPLES.map(({ name }) => name);

  const handleSampleSelect = useCallback(
    (value: string, index: number) => {
      props.sampleSelect(value, index);
      setCurrentSoundCategoryIndex(index);
    },
    [props]
  );

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  useEffect(() => {
    props.updateGrid(grid);
  }, [grid, props]);

  const handlePlay = useCallback(
    (index: number) => {
      if (lastPlayedIndex.current !== 0 && lastPlayedIndex.current === index)
        return;

      if (grid[index % 16] || rolling) {
        props.play();
      }

      lastPlayedIndex.current = index;
    },
    [grid, props, rolling]
  );

  useEffect(() => {
    handlePlay(timerIndex);
  }, [handlePlay, timerIndex]);

  return (
    <BaseAudioUI color={props.color} title="drums" thisUnitKey={props.unitKey}>
      <MinWidthUnitColumn>
        <Selectors>
          <MultiSelect
            options={categories}
            align="left"
            onPress={(value) => {
              const index = categories.indexOf(value);
              setSelectedCategoryIndex(index);
            }}
            initIndex={props.selectedCategoryIndex || 0}
            chars={10}
          />
          <SamplesSelector>
            {SAMPLES.map(({ samples }, index) => {
              if (selectedCategoryIndex !== index) return null;
              const options = samples.map(({ text }) => text);

              return (
                <MultiSelect
                  options={options}
                  align="left"
                  onPress={(value: string) => {
                    handleSampleSelect(value, index);
                  }}
                  initIndex={props.selectedIndex || 0}
                  chars={10}
                  active={currentSoundCategoryIndex === index}
                />
              );
            })}
          </SamplesSelector>
        </Selectors>
        <AudioConnection
          connection={props.output}
          unitKey={props.unitKey}
          connectionKey={"output"}
          wrapperRef={props.wrapperRef}
        />
      </MinWidthUnitColumn>
      <UnitColumn>
        <Knob
          min={0}
          max={2}
          resetValue={1}
          onChange={props.setPitch}
          initValue={props.pitch || 1}
          text="PITCH"
        />
        <RollWrapper>
          <RollButton onPointerDown={() => setRolling(true)} />
          <Label>{"ROLL"}</Label>
        </RollWrapper>
        <Knob
          min={ZERO}
          max={1}
          resetValue={1}
          onChange={props.setVolume}
          initValue={props.volume || ZERO}
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

const RollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

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

  &:hover {
    border: 1px solid white;
  }

  &:active {
    border: 1px solid white;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const SamplesSelector = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  width: 70px;
  padding-top: 6px;
  padding-bottom: 6px;
  display: flex;
`;

const Selectors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 12px;
`;
