import { RefObject, useState } from "react";
import styled from "styled-components";
import { Connection } from "../../audioUnits/Connection";
import { ConnectionTypes } from "../../ConnectionContext";
import { Colors } from "../../utils/theme";
import Chevron from "../Chevron";
import { AudioConnection } from "../unitBlocks/AudioConnection";

interface Props {
  children?: React.ReactNode;
  title?: string;
  name: string;
  wrapperRef: RefObject<HTMLDivElement>;
}

export function Collapsible({ children, title, name, wrapperRef }: Props) {
  const [collapsed, setCollapsed] = useState(true);

  const connection = new Connection("CV OUT", ConnectionTypes.CV_OUT);

  return (
    <Wrapper collapsed={collapsed}>
      <Top
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <ChevronWrapper>
          <ChevronContainer collapsed={collapsed}>
            <Chevron height={"14px"} color={"white"} />
          </ChevronContainer>
        </ChevronWrapper>
        <Title>{title}</Title>
        <ConnWrapper>
          <AudioConnection
            connection={connection}
            unitKey={name}
            connectionKey={name}
            wrapperRef={wrapperRef}
            horizontal
          />
        </ConnWrapper>
      </Top>
      <Content collapsed={collapsed}>{children}</Content>
    </Wrapper>
  );
}

const ChevronWrapper = styled.div`
  width: 80px;
`;

const ConnWrapper = styled.div`
  margin-right: 15px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div<{
  collapsed: boolean;
}>`
  opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
  width: 100%;
  padding: 15px;
  transition: 0.3s;
  position: relative;
  overflow: scroll;
`;

const Title = styled.span`
  font-size: 20px;
  position: relative;
  opacity: 0.8;
  font-weight: bold;
  color: white;
  opacity: 0.7;
  flex: 1;
  display: flex;
  height: 40px;
  line-height: 0;
  align-items: center;
  justify-content: center;
`;

const ChevronContainer = styled.div<{
  collapsed: boolean;
}>`
  position: absolute;
  height: 40px;
  width: 40px;
  left: 4px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  transform: rotate(${({ collapsed }) => (collapsed ? "90deg" : "-90deg")});
`;

const Wrapper = styled.div<{
  collapsed: boolean;
}>`
  height: ${({ collapsed }) => (collapsed ? "40px" : "540px")};
  border: 1px solid ${Colors.darkBorder};
  background-color: ${Colors.background};
  border-radius: 3px;
  display: flex;
  width: 100%;
  flex-direction: column;
  transition-property: all;
  position: relative;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(1, 1, 1, 1);
  overflow: hidden;
`;

const Top = styled.div`
  height: 40px;
  width: 100%;
  display: flex;

  cursor: pointer;
`;
