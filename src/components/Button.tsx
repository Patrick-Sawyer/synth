import styled from "styled-components";

interface Props {
  onPress: () => void;
}

export function Button({ onPress }: Props) {
  return <ButtonTag onPointerDown={onPress} />;
}

const ButtonTag = styled.button`
  min-width: 100px;
  height: 20px;
`;
