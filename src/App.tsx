import styled from "styled-components";
import "./App.css";
import { ZERO } from "./audioUnits/BaseUnit";
import { Connection } from "./audioUnits/Connection";
import { Rack } from "./components/Rack/Rack";
import { AudioUnitContextProvider } from "./contexts/AudioUnitContext";
import {
  ConnectionContextProvider,
  ConnectionTypes,
} from "./contexts/ConnectionContext";
import { MrTContextProvider } from "./contexts/MrTContext";
import { PlayAndStopContextProvider } from "./contexts/PlayAndStopContext/PlayAndStopContext";
import { SequencerContextProvider } from "./contexts/SequencerContext";

export const CONTEXT = new AudioContext();

export const MAIN_OUT = new Connection("MAIN OUT", ConnectionTypes.INPUT);
MAIN_OUT.node.gain.value = ZERO;
const COMPRESSOR = CONTEXT.createDynamicsCompressor();
MAIN_OUT.node.connect(COMPRESSOR);
COMPRESSOR.connect(CONTEXT.destination);

export const SEQ_ONE_CV_OUT = new Connection(
  "SEQ ONE CV OUT",
  ConnectionTypes.CV_OUT
);
export const SEQ_TWO_CV_OUT = new Connection(
  "SEQ TWO CV OUT",
  ConnectionTypes.CV_OUT
);
export const SEQ_THREE_CV_OUT = new Connection(
  "SEQ THREE CV OUT",
  ConnectionTypes.CV_OUT
);

const pulseCurve = new Float32Array(256);
for (let i = 0; i < 128; i++) {
  pulseCurve[i] = -1;
  pulseCurve[i + 128] = 1;
}

const constantOneCurve = new Float32Array(2);
constantOneCurve[0] = 1;
constantOneCurve[1] = 1;

export interface PulseNode extends OscillatorNode {
  width?: AudioParam;
}
// @ts-ignore
CONTEXT.createPulseOscillator = function (): PulseNode {
  const node: PulseNode = this.createOscillator();
  node.type = "sawtooth";
  let pulseShaper = CONTEXT.createWaveShaper();
  pulseShaper.curve = pulseCurve;
  node.connect(pulseShaper);
  let widthGain = CONTEXT.createGain();
  widthGain.gain.value = 0;
  node.width = widthGain.gain;
  widthGain.connect(pulseShaper);
  let constantOneShaper = this.createWaveShaper();
  constantOneShaper.curve = constantOneCurve;
  node.connect(constantOneShaper);
  constantOneShaper.connect(widthGain);

  node.connect = function () {
    pulseShaper.connect.apply(pulseShaper, arguments as any);
    return node;
  };

  node.disconnect = function () {
    pulseShaper.disconnect.apply(pulseShaper, arguments as any);
    node.stop();
    widthGain.disconnect();
    constantOneShaper.disconnect();
  };

  node.stop = function () {
    pulseShaper.disconnect();
    widthGain.disconnect();
    constantOneShaper.disconnect();
  };

  return node;
};

function App() {
  return (
    <Wrapper>
      <MrTContextProvider>
        <AudioUnitContextProvider>
          <SequencerContextProvider>
            <ConnectionContextProvider>
              <PlayAndStopContextProvider>
                <Rack />
              </PlayAndStopContextProvider>
            </ConnectionContextProvider>
          </SequencerContextProvider>
        </AudioUnitContextProvider>
      </MrTContextProvider>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  min-width: 520px;
  user-select: none;
`;

export default App;
