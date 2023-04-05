import { createContext, useContext, useState } from "react";
import styled from "styled-components";
import { Button } from "../components/Rack/Rack";

interface MrTMessageState {
  text: string;
  callback?: () => void;
  onCancel?: () => void;
}

interface MrTContextType {
  fireMrT: (args: MrTMessageState) => void;
  mrTActive: boolean;
}

const MrTContext = createContext<MrTContextType>({
  fireMrT: () => null,
  mrTActive: false,
});

export const MrTContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mrTMessageState, setMrTMessageState] =
    useState<MrTMessageState | null>(null);

  const fireMrT = (message: MrTMessageState) => {
    if (!mrTMessageState) {
      setMrTMessageState(message);
    }
  };

  const handleOK = () => {
    if (mrTMessageState?.callback) {
      mrTMessageState?.callback();
    }

    setMrTMessageState(null);
  };

  const handleCancel = () => {
    mrTMessageState?.onCancel && mrTMessageState.onCancel();
    setMrTMessageState(null);
  };

  return (
    <MrTContext.Provider value={{ fireMrT, mrTActive: !!mrTMessageState }}>
      {children}
      {mrTMessageState && (
        <Overlay>
          <Card>
            <Title>{"TURNTABLISM MODULAR"}</Title>
            <Image src={"images/mrt.png"} alt="mr-t" />
            <Text>{mrTMessageState.text}</Text>
            <ButtonWrapper>
              <Button onClick={handleOK}>{"OK"}</Button>
              {mrTMessageState.callback && (
                <Button onClick={handleCancel}>{"CANCEL"}</Button>
              )}
            </ButtonWrapper>
          </Card>
        </Overlay>
      )}
    </MrTContext.Provider>
  );
};

const Title = styled.span`
  font-family: Graf;
  font-size: 34px;
  font-weight: bold;
  color: black;
  text-shadow: 2px 2px 2px #656565;
`;

const Image = styled.img`
  height: 220px;
  width: 300px;
  border-radius: 3px;
  -webkit-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 1);
  box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 1);
`;

const Overlay = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  padding: 40px 50px;
  background: #ebebeb;
  border-radius: 3px;
  -webkit-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 1);
  box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-direction: column;
`;

const Text = styled.span`
  font-size: 20px;
  color: black;
  font-family: "Courier New", Courier, monospace;
  text-align: center;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  top: 3px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 50px;
`;

export const useMrTContext = () => useContext(MrTContext);
