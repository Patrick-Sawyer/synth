import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import { OPTION_HEIGHT } from "./UnitSelector";

interface Props {
  onClick: (word: string) => void;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}

export function SaveComponent({ onClick, text, setText }: Props) {
  return (
    <Wrapper>
      <Input
        type="text"
        name="saveAs"
        onChange={(e) => setText(e.target.value)}
        placeholder={"Save patch"}
        value={text}
      />
      <SaveButton
        onClick={() => {
          if (text.length) {
            onClick(text);
          }
        }}
      >
        SAVE
      </SaveButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  height: ${OPTION_HEIGHT};
  flex: 1;
  min-width: 200px;
  color: black;
  font-size: 16px;
  background: white;
  overflow: hidden;
  border-radius: 3px;
  gap: 5px;
`;

const Input = styled.input`
  border: none;
  outline: none;
  appearance: none;
  min-width: 0;
  flex: 1;
  color: black;
  font-size: 16px;
  padding-left: 8px;
`;

const SaveButton = styled.div`
  background-color: ${Colors.darkBorder};
  color: white;
  padding: 0 10px;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  line-height: 0;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: bold;

  cursor: pointer;
  &:hover {
    background-color: #0800ff;
  }

  &:active {
    background-color: black;
  }
`;
