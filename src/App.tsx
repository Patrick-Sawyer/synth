import styled from "styled-components";
import "./App.css";
import { Connection } from "./audioUnits/Connection";
import { Rack } from "./components/Rack/Rack";
import { ConnectionTypes } from "./ConnectionContext";

export const CONTEXT = new AudioContext();

export const MAIN_OUT = new Connection("MAIN OUT", ConnectionTypes.INPUT);
MAIN_OUT.node.gain.value = 1;
const COMPRESSOR = CONTEXT.createDynamicsCompressor();
MAIN_OUT.node.connect(COMPRESSOR);
COMPRESSOR.connect(CONTEXT.destination);

function App() {
  return (
    <Wrapper>
      <Rack />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  user-select: none;
`;

export default App;
