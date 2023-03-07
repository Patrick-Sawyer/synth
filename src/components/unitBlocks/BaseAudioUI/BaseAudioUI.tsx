import styled from "styled-components";

export const UNIT_HEIGHT = "300px";

interface Props {
  children: React.ReactNode;
  color: string;
  title: string;
  letterSpacing?: number;
}

export function BaseAudioUI({
  children,
  color,
  title,
  letterSpacing = 7,
}: Props) {
  return (
    <Wrapper color={color}>
      <NameWrapper>
        <Name letterSpacing={letterSpacing} rotate={"270deg"}>
          {title}
        </Name>
      </NameWrapper>
      <Content>{children}</Content>
    </Wrapper>
  );
}

const Content = styled.div`
  display: flex;
  gap: 12px;
`;

const Wrapper = styled.div<{
  color: string;
}>`
  height: ${UNIT_HEIGHT};
  border-bottom: 1px solid transparent;
  background-color: ${({ color }) => color};
  border-radius: 2px;
  padding: 15px 12px 15px 3px;
  gap: 4px;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
  display: flex;
`;

const NameWrapper = styled.div`
  width: 20px;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  bottom: 7px;
`;

const Name = styled.span<{
  rotate: string;
  letterSpacing: number;
}>`
  transform: rotate(${({ rotate }) => rotate}) scaleY(0.9);
  color: white;
  opacity: 0.3;
  white-space: nowrap;
  font-size: 14px;
  letter-spacing: ${({ letterSpacing }) => letterSpacing}px;
`;
