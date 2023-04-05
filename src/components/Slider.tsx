import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { debounce } from "../utils/debounce";

interface Props {
  onChange: (value: number) => void;
  inputValue: number;
}

export function Slider({ onChange, inputValue }: Props) {
  const [value, setValue] = useState(128);
  const handleChange = useRef(debounce(onChange, 100));

  useEffect(() => {
    handleChange.current(value);
  }, [handleChange, value]);

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  return (
    <Wrapper>
      <Text>{"SPEED"}</Text>
      <Input
        type="range"
        name="Tempo"
        value={value}
        min="30"
        max="300"
        onChange={(e) => setValue(Number(e.currentTarget.value))}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
  width: 100%;

  @media screen and (min-width: 541px) {
    max-width: 500px;
  }
`;

const Text = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: bold;
  padding: 0;
  margin: 0;
  color: black;
`;

const Input = styled.input`
  width: 100%;
  height: 3px;
  -webkit-appearance: none;
  outline: none;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 3px;
  -webkit-box-shadow: 0px 2px 11px -3px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 2px 11px -3px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 2px 11px -3px rgba(0, 0, 0, 0.75);

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 60px;
    height: 24px;
    border-radius: 3px;
    background: #eaeaea;
    border: 2px solid white;
    cursor: pointer;
    -webkit-box-shadow: 0px 2px 11px -3px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 2px 11px -3px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 2px 11px -3px rgba(0, 0, 0, 0.75);
  }
`;
