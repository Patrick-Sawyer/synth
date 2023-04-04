import styled from "styled-components";
import { ChevronIcon } from "../../../assets/svg";
import {
  useConnectionContext,
  useConnectionUpdateContext,
} from "../../../ConnectionContext";
import { Colors } from "../../../utils/theme";

export const UNIT_HEIGHT = "300px";

interface Props {
  children: React.ReactNode;
  color: string;
  title: string;
  unitKey: string;
}

export function BaseAudioUI({ children, color, title, unitKey }: Props) {
  const { hiddenUnits } = useConnectionContext();
  const { setHiddenUnits } = useConnectionUpdateContext();
  const collapsed = unitKey && hiddenUnits.includes(unitKey);

  const handleClick = () => {
    let units = [...hiddenUnits];

    if (collapsed) {
      units = units.filter((key) => key !== unitKey);
    } else {
      units.push(unitKey);
    }

    setHiddenUnits && setHiddenUnits(units);
  };

  return (
    <Wrapper color={color}>
      <NameWrapper>
        <Name rotate={"270deg"}>{title}</Name>
        <IconWrapper
          onPointerDown={handleClick}
          style={{ transform: `rotate(${collapsed ? "90deg" : "0"})` }}
        >
          <ChevronIcon color={Colors.darkBorder} size="14px" />
        </IconWrapper>
      </NameWrapper>
      {!collapsed && <Content>{children}</Content>}
    </Wrapper>
  );
}

const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  opacity: 0.2;
  cursor: pointer;
  height: 27px;
  width: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;

  &:hover {
    opacity: 0.4;

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
