import { useState } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import Chevron from "../Chevron";

export interface Option {
  value: any;
  text: string;
  key: string;
  color?: string;
}

interface Props {
  label: string;
  options: Array<Option>;
  onSelect: (option: any) => void;
  closeOnClick?: boolean;
}

export const OPTION_HEIGHT = "26px";

export function UnitSelector({
  label,
  options,
  onSelect,
  closeOnClick = false,
}: Props) {
  const [active, setActive] = useState<boolean>(false);

  return (
    <Wrapper
      onMouseLeave={() => {
        setActive(false);
      }}
    >
      <Select active={active}>
        <OptionComponent
          first
          key={"top"}
          last={!active}
          onPointerDown={() => {
            setActive(!active);
          }}
        >
          {label}
        </OptionComponent>
        {options.map(({ value, text, key, color }, index) => (
          <OptionComponent
            key={key}
            last={index === options.length - 1}
            onPointerDown={() => {
              onSelect(value);
              closeOnClick &&
                setTimeout(() => {
                  setActive(false);
                }, 200);
            }}
          >
            {text}
          </OptionComponent>
        ))}
        {!options.length && <OptionComponent>{"-"}</OptionComponent>}
      </Select>
      <ChevronContainer active={active}>
        <Chevron height={"11px"} color={"black"} />
      </ChevronContainer>
    </Wrapper>
  );
}

const ChevronContainer = styled.div<{
  active: boolean;
}>`
  height: ${OPTION_HEIGHT};
  width: ${OPTION_HEIGHT};
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.35;
  transition: 0.3s;
  transform: rotate(${({ active }) => (active ? "270deg" : "90deg")});
  pointer-events: none;
`;

const OptionComponent = styled.span<{
  first?: boolean;
  last?: boolean;
}>`
  height: ${OPTION_HEIGHT};
  width: 100%;
  color: black;
  position: relative;
  font-size: 16px;
  background: white;
  padding: 0 10px;
  display: flex;
  align-items: center;
  line-height: ${OPTION_HEIGHT};
  justify-content: space-between;
  display: block;

  transition: 0.2s;
  cursor: pointer;

  user-select: none;

  ${({ first }) =>
    !first &&
    `
      &:hover {
    background-color: ${Colors.background};
    color: white;
    > div {
        border: 1.5px solid rgba(255, 255, 255, 0.4);
    }
  }`}
`;

const Wrapper = styled.div`
  flex: 1;
  height: ${OPTION_HEIGHT};
  z-index: 51000;
  min-width: 200px;
  position: relative;
`;

const Select = styled.div<{
  active: boolean;
}>`
  width: 100%;
  outline: none;

  max-height: ${({ active }) => (active ? "400px" : OPTION_HEIGHT)};
  overflow-y: scroll;

  transition: 0.3s;

  border-radius: 3px !important;

  > span:not(:first-child) {
    opacity: ${({ active }) => (active ? 1 : 0)};
  }

  > span:last-child {
    border-bottom-left-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
  }

  > span:first-child {
    border-top-left-radius: 3px !important;
    border-top-right-radius: 3px !important;
  }
`;
