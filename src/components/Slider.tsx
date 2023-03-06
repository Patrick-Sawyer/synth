import styled from "styled-components";

export function Slider() {
  return <Input type="range" />;
}

const Input = styled.input`
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  background-color: transparent;

  :focus {
    outline: none;
  }
  ::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 1px 1px 4px #000000;
    background: #2b2b2b;
    border-radius: 11px;
    border: 1px solid #e5e5e5;
  }
  ::-webkit-slider-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 1px solid #e5e5e5;
    height: 50px;
    width: 18px;
    border-radius: 5px;
    background: #303030;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -23px;
  }
  :focus::-webkit-slider-runnable-track {
    background: #2b2b2b;
  }
  ::-moz-range-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 1px 1px 4px #000000;
    background: #2b2b2b;
    border-radius: 11px;
    border: 1px solid #e5e5e5;
  }
  ::-moz-range-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 1px solid #e5e5e5;
    height: 50px;
    width: 18px;
    border-radius: 5px;
    background: #303030;
    cursor: pointer;
  }
  ::-ms-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  ::-ms-fill-lower {
    background: #2b2b2b;
    border: 1px solid #e5e5e5;
    border-radius: 22px;
    box-shadow: 1px 1px 4px #000000;
  }
  ::-ms-fill-upper {
    background: #2b2b2b;
    border: 1px solid #e5e5e5;
    border-radius: 22px;
    box-shadow: 1px 1px 4px #000000;
  }
  ::-ms-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 1px solid #e5e5e5;
    height: 50px;
    width: 18px;
    border-radius: 5px;
    background: #303030;
    cursor: pointer;
  }
  :focus::-ms-fill-lower {
    background: #2b2b2b;
  }
  :focus::-ms-fill-upper {
    background: #2b2b2b;
  }
`;
