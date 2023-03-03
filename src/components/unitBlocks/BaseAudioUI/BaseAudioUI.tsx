import styled from "styled-components";

export const UNIT_HEIGHT = "300px";

interface Props {
  children: React.ReactNode;
  color: string;
}

export function BaseAudioUI({ children, color }: Props) {
  return <Wrapper color={color}>{children}</Wrapper>;
}

const Wrapper = styled.div<{
  color: string;
}>`
  height: ${UNIT_HEIGHT};
  border-bottom: 1px solid transparent;
  background-color: ${({ color }) => color};
  border-radius: 2px;
  padding: 20px 20px 0 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
  display: flex;
  gap: 30px;
`;
