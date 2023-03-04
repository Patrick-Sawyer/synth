import { ComponentProps, RefObject, useRef, useState } from "react";
import styled from "styled-components";
import { Envelope } from "../../audioUnits/Envelope";
import { Oscillator } from "../../audioUnits/Oscillator";
import { AudioUnit, AudioUnitTypes } from "../../audioUnits/types";
import { ConnectionContextProvider } from "../../ConnectionContext";
import { EnvelopeComponent } from "../Envelope/EnvelopeComponent";
import { FilterComponent } from "../Filter/FilterComponent";
import { LFOComponent } from "../LFO/LFOComponent";
import { OscillatorComponent } from "../Oscillator/OscillatorComponent";
import { ReverbComponent } from "../Reverb/ReverbComponent";
import { Sequencer } from "../Sequencer/Sequencer";
import { Settings } from "../Settings/Settings";
import { Wires } from "../Wires/Wires";
import { RackRow } from "./RackRow";

export function Rack() {
  const ref = useRef<HTMLDivElement>(null);
  const [audioUnits, setAudioUnits] = useState<Array<AudioUnit>>([]);

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

      default:
        return null;
    }
  };

  const playNote = (freq?: number) => {
    audioUnits.forEach((unit) => {
      if (unit.type === AudioUnitTypes.OSCILLATOR) {
        const blah = unit as Oscillator;
        blah.play(freq);
      } else if (unit.type === AudioUnitTypes.ENVELOPE) {
        const blah = unit as Envelope;
        blah.trigger(freq);
      }
    });
  };

  return (
    <ConnectionContextProvider>
      <Wrapper ref={ref}>
        <Settings audioUnits={audioUnits} setAudioUnits={setAudioUnits} />
        <Sequencer onClick={playNote} wrapperRef={ref} />

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
    </ConnectionContextProvider>
  );
}

const RackWrapper = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
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
