import styled from "styled-components";

export const UNIT_HEIGHT = "300px";

interface Props {
  children: React.ReactNode;
  color: string;
  title: string;
}

export function BaseAudioUI({ children, color, title }: Props) {
  return (
    <Wrapper color={color}>
      <NameWrapper>
        <Name rotate={"270deg"}>{title}</Name>
      </NameWrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
}

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
