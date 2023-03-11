import { useEffect, useState } from "react";
import styled from "styled-components";
import { Label } from "./Label";

interface Props {
  label?: string;
  options: Array<string>;
  onPress: (option: string) => void;
  initIndex?: number;
  chars?: number;
}

export function MultiSelect({
  label,
  options,
  onPress,
  initIndex = 0,
  chars = 3,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(initIndex);

  const handleButton = () => {
    const nextValue =
      selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(nextValue);
  };

  useEffect(() => {
    onPress(options[selectedIndex]);
  }, [onPress, options, selectedIndex]);

  return (
    <Wrapper>
      <div>
        {options?.map((option, index) => (
          <Option
            key={option}
            onPointerDown={() => {
              setSelectedIndex(index);
            }}
          >
            <Light selected={index === selectedIndex} />
            {option.substring(0, chars)}
          </Option>
        ))}
      </div>
      {!!label && (
        <Label onPointerDown={handleButton} button>
          {label}
        </Label>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Option = styled.div`
  font-size: 10px;
  font-family: "Courier New", Courier, monospace;
  font-weight: bold;
  text-align: center;
  color: white;
  opacity: 0.7;
  display: flex;
  gap: 5px;
  cursor: pointer;
  align-items: center;
`;

const Light = styled.div<{
  selected: boolean;
}>`
  background: ${({ selected }) => (selected ? "#8cff00" : "#131313")};
  ${({ selected }) => selected && "box-shadow: 0 0 5px 0 #8cff00;"}
  height: 6px;
  width: 6px;
  position: relative;
  top: 1px;
  border-radius: 50%;
`;
