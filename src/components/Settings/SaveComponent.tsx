import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { useMrTContext } from "../../contexts/MrTContext";
import { Colors } from "../../utils/theme";
import { OPTION_HEIGHT } from "./UnitSelector";

interface Props {
  onClick: (word: string) => void;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}

export function SaveComponent({ onClick, text, setText }: Props) {
  const { fireMrT } = useMrTContext();

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
          } else {
            fireMrT({ text: "ENTER SOME TEXT FOOL!" });
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
  -webkit-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
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
    background-color: ${Colors.hoverColor};
  }

  &:active {
    background-color: black;
  }
`;
