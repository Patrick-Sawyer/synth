import styled from "styled-components";

export const Label = styled.span<{ button?: boolean; darkText?: boolean }>`
  font-size: 10px;
  font-family: Futura;
  text-align: center;
  color: ${({ darkText }) => (darkText ? "black" : "white")};
  opacity: 0.7;

  ${({ button }) =>
    !!button &&
    `
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  `}
`;
