import { createContext, useState } from "react";
import styled from "styled-components";
import { Button } from "../components/Rack/Rack";

import { Colors } from "../utils/theme";

interface MessageState {
  text: string;
  callback?: () => void;
}

type MessageContextType = (args: MessageState) => void;

const MessageContext = createContext<MessageContextType>(() => null);

export const MessageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messageState, setMessageState] = useState<MessageState | null>(null);

  const onMessage = () => {
    if (!messageState) {
      setMessageState(messageState);
    }
  };

  const handleOK = () => {
    if (messageState?.callback) {
      messageState?.callback();
    }

    setMessageState(null);
  };

  const handleCancel = () => {
    setMessageState(null);
  };

  return (
    <MessageContext.Provider value={onMessage}>
      {children}
      {messageState && (
        <Overlay>
          <Card>
            <Text>{messageState.text}</Text>
            <ButtonWrapper>
              <Button onClick={handleOK}>{"OK"}</Button>
              {messageState.callback && (
                <Button onClick={handleCancel}>{"Cancel"}</Button>
              )}
            </ButtonWrapper>
          </Card>
        </Overlay>
      )}
    </MessageContext.Provider>
  );
};

const Overlay = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 350px;
  padding: 32px 45px;
  background: ${Colors.screwBackground};
  border-radius: 3px;
  -webkit-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 1);
  box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  flex-direction: column;
`;

const Text = styled.span`
  font-size: 18px;
  color: black;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 25px;
`;
