import styled from "styled-components";

interface Props {
  onClick: () => void;
  number: number;
  selected: boolean;
  active: boolean;
}

export function DrumButton({ onClick, number, selected, active }: Props) {
  return (
    <Wrapper>
      <Text active={active}>{number}</Text>
      <Button selected={selected} onClick={onClick} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 28px;
  justify-content: space-between;
`;

const Button = styled.div<{ selected: boolean }>`
  height: 12px;
  width: 12px;
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? "#33f8ff" : "white")};
`;

const Text = styled.div<{ active: boolean }>`
  color: ${({ active }) => (active ? "#33f8ff" : "white")};
  font-size: 10px;
  opacity: ${({ active }) => (active ? 1 : 0.5)};

  ${({ active }) =>
    active &&
    `
      text-shadow: 0 0 5px 0 #33f8ff;
  `}
`;
