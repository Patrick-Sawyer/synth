import styled from "styled-components";
import { ChevronIcon, CloseIcon } from "../../../assets/svg";
import { useUpdateAudioUnitContext } from "../../../contexts/AudioUnitContext";
import {
  useConnectionContext,
  useConnectionUpdateContext,
} from "../../../contexts/ConnectionContext";
import { Colors } from "../../../utils/theme";

export const UNIT_HEIGHT = "300px";

interface Props {
  children: React.ReactNode;
  color: string;
  title: string;
  thisUnitKey: string;
}

export function BaseAudioUI({ children, color, title, thisUnitKey }: Props) {
  const { hiddenUnits, connections } = useConnectionContext();
  const { setHiddenUnits, setConnections } = useConnectionUpdateContext();
  const setAudioUnits = useUpdateAudioUnitContext();
  const collapsed = thisUnitKey && hiddenUnits.includes(thisUnitKey);

  const handleCollapseClick = () => {
    let units = [...hiddenUnits];

    if (collapsed) {
      units = units.filter((key) => key !== thisUnitKey);
    } else {
      units.push(thisUnitKey);
    }

    setHiddenUnits && setHiddenUnits(units);
  };

  const removeUnit = () => {
    setAudioUnits((array) => {
      const index = array.findIndex(({ unitKey }) => unitKey === thisUnitKey);
      array[index]?.shutdown();
      return [...array.slice(0, index), ...array.slice(index + 1)];
    });
    const newConnections = [...connections];
    const filtered = newConnections.filter((conn) => {
      return (
        conn.from.unitKey !== thisUnitKey && conn.to.unitKey !== thisUnitKey
      );
    });
    setConnections && setConnections(filtered);
  };

  return (
    <Wrapper color={color}>
      <NameWrapper>
        <Name rotate={"270deg"}>{title}</Name>
        <IconWrapper
          onPointerDown={handleCollapseClick}
          style={{ transform: `rotate(${collapsed ? "90deg" : "0"})` }}
        >
          <ChevronIcon color={Colors.darkBorder} size="14px" />
        </IconWrapper>
        <IconWrapper bottom onPointerDown={removeUnit}>
          <CloseIcon color={Colors.darkBorder} size="14px" />
        </IconWrapper>
      </NameWrapper>
      {!collapsed && <Content>{children}</Content>}
    </Wrapper>
  );
}

const IconWrapper = styled.div<{ bottom?: boolean }>`
  position: absolute;
  ${({ bottom }) => (bottom ? "bottom: 0;" : "top: 0;")}
  opacity: 0.3;
  cursor: pointer;
  height: 27px;
  width: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;

  &:hover {
    svg {
      fill: white;
    }
  }
`;

const Content = styled.div`
  display: flex;
  gap: 12px;
  box-shadow: inset 0px 2px 11px -3px rgba(0, 0, 0, 0.2);
  padding: 15px;
`;

const Wrapper = styled.div<{
  color: string;
}>`
  height: ${UNIT_HEIGHT};
  box-shadow: inset 0px 2px 11px -3px rgba(0, 0, 0, 0.2);
  background-color: ${({ color }) => color};
  display: flex;
  position: relative;
`;

const NameWrapper = styled.div`
  width: 25px;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0px 2px 11px -3px rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.15);
`;

const Name = styled.span<{
  rotate: string;
}>`
  transform: rotate(${({ rotate }) => rotate});
  color: rgba(255, 255, 255, 0.4);
  font-weight: 300;
  border-radius: 20%;
  padding-left: 15px;
  white-space: nowrap;
  position: relative;
  line-height: 0;
  font-size: 12px;
  letter-spacing: 20px;
`;
