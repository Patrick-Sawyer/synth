import { useRef, useState } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";

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
  const mouseOver = useRef(false);

  return (
    <Wrapper
      onMouseEnter={() => {
        mouseOver.current = true;
      }}
      onMouseLeave={() => {
        mouseOver.current = false;
        setTimeout(() => {
          if (!mouseOver.current) {
            setActive(false);
          }
        }, 400);
      }}
    >
      <Select>
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
        {active &&
          options.map(({ value, text, key, color }, index) => (
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
              {!!color && <Block background={color} />}
            </OptionComponent>
          ))}
        {active && !options.length && <OptionComponent>{"-"}</OptionComponent>}
      </Select>
    </Wrapper>
  );
}

const Block = styled.div<{
  background: string;
}>`
  height: 15px;
  width: 15px;
  border-radius: 4.5px;
  background-color: ${({ background }) => background};
  transition: 0.2s;
  border: 1.5px solid transparent;
`;

const OptionComponent = styled.span<{
  first?: boolean;
  last?: boolean;
}>`
  height: ${OPTION_HEIGHT};
  width: 180px;
  color: black;
  font-size: 16px;
  background: white;
  padding: 0 10px;
  display: flex;
  align-items: center;
  line-height: ${OPTION_HEIGHT};
  justify-content: space-between;
  display: block;

  overflow: hidden;
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
  }

  `}

  ${({ first }) =>
    !!first &&
    `
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  `}

  ${({ last }) =>
    !!last &&
    `
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  `}
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 200px;
  height: ${OPTION_HEIGHT};
  position: relative;
`;

const Select = styled.div`
  width: 200px;
  outline: none;
  max-height: 400px;
  overflow-y: scroll;

  position: absolute;
  top: 0;
`;
