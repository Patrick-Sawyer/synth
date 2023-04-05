import { useState } from "react";
import styled from "styled-components";
import { CloseIcon } from "../../assets/svg";
import { useMrTContext } from "../../contexts/MrTContext";
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
  onCloseIconClick?: (value: string) => void;
}

export const OPTION_HEIGHT = "26px";

export function UnitSelector({
  label,
  options,
  onSelect,
  closeOnClick = false,
  onCloseIconClick,
}: Props) {
  const [active, setActive] = useState<boolean>(false);
  const { fireMrT, mrTActive } = useMrTContext();

  return (
    <Wrapper
      onMouseLeave={() => {
        if (!mrTActive) {
          setActive(false);
        }
      }}
    >
      <Inner>
        <OptionComponent
          first
          key={"top"}
          last={!active}
          onPointerDown={() => {
            setActive(!active);
          }}
        >
          <Text>{label}</Text>
        </OptionComponent>
        <Scroll active={active}>
          {options.map(({ value, text, key }, index) => (
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
              <Text>{text}</Text>
              {onCloseIconClick && (
                <IconWrapper
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    fireMrT({
                      text: "DELETE THIS FOOL?",
                      callback: () => {
                        onCloseIconClick(value);
                        setActive(false);
                      },
                      onCancel: () => {
                        setActive(false);
                      },
                    });
                  }}
                >
                  <CloseIcon color={Colors.hoverColor} size="14px" />
                </IconWrapper>
              )}
            </OptionComponent>
          ))}
          {!options.length && (
            <OptionComponent>
              <Text>{"-"}</Text>
            </OptionComponent>
          )}
        </Scroll>
      </Inner>
      <ChevronContainer active={active}>
        <Chevron height={"11px"} color={"black"} />
      </ChevronContainer>
    </Wrapper>
  );
}

const IconWrapper = styled.div`
  cursor: pointer;
  height: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-right: 4px;
  border-radius: 2px;
  transition: 0.2s;

  &:hover {
    background: white;

    svg {
      fill: ${Colors.hoverColor} !important;
    }
  }
`;

const Inner = styled.div`
  background-color: white;
  border-radius: 3px !important;
  -webkit-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
`;

const Text = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100;
`;

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

const OptionComponent = styled.div<{
  first?: boolean;
  last?: boolean;
}>`
  height: ${OPTION_HEIGHT};
  width: 100%;
  color: black;
  position: relative;
  font-size: 16px;
  display: flex;
  align-items: center;
  line-height: ${OPTION_HEIGHT};
  justify-content: space-between;

  transition: 0.2s;
  cursor: pointer;

  user-select: none;

  ${({ first }) =>
    !first &&
    `
      &:hover {
    background-color: ${Colors.hoverColor};
    color: white;

    svg {
      fill: white;
    }

  }`}
`;

const Wrapper = styled.div`
  flex: 1;
  height: ${OPTION_HEIGHT};
  z-index: 51000;
  position: relative;
`;

const Scroll = styled.div<{
  active: boolean;
}>`
  width: 100%;
  outline: none;
  max-height: ${({ active }) => (active ? "400px" : 0)};
  overflow-y: scroll;
  transition: 0.3s;
  opacity: ${({ active }) => (active ? 1 : 0)};
`;
