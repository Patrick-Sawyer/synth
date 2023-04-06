import { ComponentProps, RefObject, useRef } from "react";
import styled from "styled-components";
import {
  MAIN_OUT,
  SEQ_ONE_CV_OUT,
  SEQ_THREE_CV_OUT,
  SEQ_TWO_CV_OUT,
} from "../../App";
import { AudioUnit, AudioUnitTypes } from "../../audioUnits/types";
import {
  useAudioUnitContext,
  useUpdateAudioUnitContext,
} from "../../contexts/AudioUnitContext";
import {
  useConnectionContext,
  useConnectionUpdateContext,
} from "../../contexts/ConnectionContext";
import { useMrTContext } from "../../contexts/MrTContext";
import { usePlayAndStopContext } from "../../contexts/PlayAndStopContext/PlayAndStopContext";
import {
  useSequencerContext,
  useUpdateSequencerContext,
} from "../../contexts/SequencerContext";
import { Colors } from "../../utils/theme";
import { DelayComponent } from "../Delay/DelayComponent";
import { DrumMachineComponent } from "../DrumMachine/DrumMachineComponent";
import { EnvelopeComponent } from "../Envelope/EnvelopeComponent";
import { FilterComponent } from "../Filter/FilterComponent";
import { LFOComponent } from "../LFO/LFOComponent";
import { OscillatorComponent } from "../Oscillator/OscillatorComponent";
import { ReverbComponent } from "../Reverb/ReverbComponent";
import { Sequencer } from "../Sequencer/Sequencer";
import { Settings } from "../Settings/Settings";
import { Slider } from "../Slider";
import { AudioConnection } from "../unitBlocks/AudioConnection";
import { Wires } from "../Wires/Wires";
import { RackRow } from "./RackRow";

export function Rack() {
  const ref = useRef<HTMLDivElement>(null);
  const audioUnits = useAudioUnitContext();
  const setAudioUnits = useUpdateAudioUnitContext();
  const { clearConnections } = useConnectionUpdateContext();
  const { tempo } = useSequencerContext();
  const { setTempo, clearSequencer } = useUpdateSequencerContext();
  const { startModular, stopModular } = usePlayAndStopContext();
  const { fireMrT } = useMrTContext();
  const { connections } = useConnectionContext();

  const { seqOneGridNotes, seqTwoGridNotes, seqThreeGridNotes } =
    useSequencerContext();

  const clearEverything = () => {
    if (
      !audioUnits.length &&
      !connections.length &&
      !seqOneGridNotes.length &&
      !seqTwoGridNotes.length &&
      !seqThreeGridNotes.length
    ) {
      fireMrT({
        text: "THERE'S NOTHING THERE FOOL!",
      });
    } else {
      fireMrT({
        text: "DELETE EVERYTHING FOOL?",
        callback: async () => {
          stopModular(() => {
            audioUnits.forEach((unit) => {
              unit.shutdown();
            });
            clearSequencer();
            setAudioUnits([]);
            clearConnections();
          });
        },
      });
    }
  };

  const handleStop = () => {
    stopModular();
  };

  const handlePlay = () => {
    const mainNotConnected = !connections.filter(
      (conn) => conn.to.unitKey === "MAIN_OUT"
    ).length;

    const sequencersNotConnected = !connections.filter((conn) => {
      return (
        conn.from.unitKey === "SEQ_ONE" ||
        conn.from.unitKey === "SEQ_TWO" ||
        conn.from.unitKey === "SEQ_THREE"
      );
    }).length;

    const noNotesScheduled =
      !seqOneGridNotes.length &&
      !seqTwoGridNotes.length &&
      !seqThreeGridNotes.length;

    if (!audioUnits.length) {
      fireMrT({ text: "ADD SOME DAMN MODULES FOOL!" });
    } else if (mainNotConnected) {
      fireMrT({ text: "CONNECT SOME MODULES FOOL!" });
    } else if (sequencersNotConnected) {
      fireMrT({ text: "CONNECT A SEQUENCER FOOL!" });
    } else if (noNotesScheduled) {
      fireMrT({ text: "ADD SOME DAMN NOTES FOOL!" });
    } else {
      startModular();
    }
  };

  return (
    <Wrapper ref={ref}>
      <Title>
        <TitleText>{"TURNTABLISM MODULAR"}</TitleText>
        <Slider inputValue={tempo} onChange={setTempo} />
        <Buttons>
          <Button onClick={handlePlay}>PLAY</Button>
          <Button onClick={handleStop}>STOP</Button>
          <Button onClick={clearEverything}>CLEAR</Button>
        </Buttons>
      </Title>
      <Settings />
      <Sequencer />
      <MainOut>
        <AudioConnection
          darkText
          wrapperRef={ref}
          connection={MAIN_OUT}
          unitKey="MAIN_OUT"
          connectionKey="MAIN_OUT"
          horizontal
        />
        <AudioConnection
          darkText
          wrapperRef={ref}
          connection={SEQ_ONE_CV_OUT}
          unitKey="SEQ_ONE"
          connectionKey="SEQ_ONE"
          horizontal
        />
        <AudioConnection
          darkText
          wrapperRef={ref}
          connection={SEQ_TWO_CV_OUT}
          unitKey="SEQ_TWO"
          connectionKey="SEQ_TWO"
          horizontal
        />
        <AudioConnection
          darkText
          wrapperRef={ref}
          connection={SEQ_THREE_CV_OUT}
          unitKey="SEQ_THREE"
          connectionKey="SEQ_THREE"
          horizontal
        />
      </MainOut>
      <RackWrapper>
        <RackRow key={1} />
        <RackRow key={2} />
        <RackRow key={3} />
        <RackRow key={4} />
        <RackRow key={5} />
        <RackRow key={6} />
        <RackRow key={7} />
        <RackRow key={8} />
        <RackRow key={9} />
        <RackRow key={10} />
        <AudioUnits>
          {audioUnits.map((audioUnit) =>
            getUnit({ ...audioUnit, wrapperRef: ref })
          )}
        </AudioUnits>
      </RackWrapper>
      <Wires wrapperRef={ref} />
    </Wrapper>
  );
}

const Buttons = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  flex: 1;
`;

const TitleText = styled.div`
  width: 300px;
  max-width: 300px;
  min-width: 300px;
  padding-left: 10px;
  text-shadow: 2px 2px 2px #656565;

  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

export const Button = styled.div`
  padding: 5px 10px;
  flex: 1;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: bold;
  height: 25px;
  max-height: 25px;
  min-height: 25px;
  background-color: black;
  line-height: 0;
  color: white;
  border-radius: 3px;
  min-width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  -webkit-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);

  &:hover {
    background-color: ${Colors.hoverColor};
    -webkit-box-shadow: inset 0px 0px 33px -7px rgba(0, 115, 105, 0.75);
    -moz-box-shadow: inset 0px 0px 33px -7px rgba(0, 115, 105, 0.75);
    box-shadow: inset 0px 0px 33px -7px rgba(0, 115, 105, 0.75);
  }

  &:active {
    background-color: black;
  }
`;

const Title = styled.div`
  font-family: Graf;
  font-size: 34px;
  font-weight: bold;
  color: black;
  padding: 10px 10px 5px 10px;
  display: flex;
  width: calc(100% - 20px);
  display: flex;
  justify-content: space-between;
  gap: 25px;
  height: 50px;
  align-items: center;

  @media screen and (max-width: 700px) {
    flex-direction: column;
    height: 75px;
    gap: 10px;
  }
`;

const MainOut = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  display: flex;
  padding: 0 10px 10px 10px;
  gap: 10px;
  border-bottom: 1px solid ${Colors.darkBorder};
`;

const RackWrapper = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
`;

const AudioUnits = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  z-index: 1;
  position: absolute;
  justify-content: left;
  align-items: flex-start;
  overflow: hidden;
  top: 0;
`;

const getUnit = (
  unit: AudioUnit & { wrapperRef: RefObject<HTMLDivElement> }
): React.ReactElement | null => {
  switch (unit.type) {
    case AudioUnitTypes.OSCILLATOR:
      return (
        <OscillatorComponent
          {...(unit as unknown as ComponentProps<typeof OscillatorComponent>)}
        />
      );

    case AudioUnitTypes.ENVELOPE:
      return (
        <EnvelopeComponent
          {...(unit as unknown as ComponentProps<typeof EnvelopeComponent>)}
        />
      );

    case AudioUnitTypes.REVERB:
      return (
        <ReverbComponent
          {...(unit as unknown as ComponentProps<typeof ReverbComponent>)}
        />
      );

    case AudioUnitTypes.LFO:
      return (
        <LFOComponent
          {...(unit as unknown as ComponentProps<typeof LFOComponent>)}
        />
      );

    case AudioUnitTypes.FILTER:
      return (
        <FilterComponent
          {...(unit as unknown as ComponentProps<typeof FilterComponent>)}
        />
      );

    case AudioUnitTypes.DELAY:
      return (
        <DelayComponent
          {...(unit as unknown as ComponentProps<typeof DelayComponent>)}
        />
      );

    case AudioUnitTypes.DRUM_MACHINE:
      return (
        <DrumMachineComponent
          {...(unit as unknown as ComponentProps<typeof DrumMachineComponent>)}
        />
      );

    default:
      return null;
  }
};
