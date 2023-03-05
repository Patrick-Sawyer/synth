import { useState } from "react";
import styled from "styled-components";
import { Colors } from "../../utils/theme";
import Chevron from "../Chevron";

interface Props {
  children?: React.ReactNode;
  title?: string;
}

export function Collapsible({ children, title }: Props) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Outer>
      <Wrapper collapsed={collapsed}>
        <Top
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          <ChevronWrapper>
            <ChevronContainer collapsed={collapsed}>
              <Chevron height={"11px"} color={"white"} />
            </ChevronContainer>
          </ChevronWrapper>
          <Title>{title}</Title>
        </Top>
        <Content collapsed={collapsed}>{children}</Content>
      </Wrapper>
    </Outer>
  );
}

const Outer = styled.div`
  height: 40px;
  max-height: 40px;
  position: relative;
  z-index: 50000;
  flex: 1;
  width: 100%;
`;

const ChevronWrapper = styled.div`
  width: 20px;
  position: absolute;
  left: -4px;
  opacity: 0.5;
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
  font-size: 22px;
  position: relative;
  opacity: 0.8;
  color: white;
  display: flex;
  height: 40px;
  line-height: 0;
  align-items: center;
  justify-content: center;
  font-family: Graf;
  text-align: center;
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
  height: ${({ collapsed }) => (collapsed ? "40px" : "585px")};
  background-color: ${Colors.background};
  border-radius: 3px;
  display: flex;
  width: 100%;
  flex-direction: column;
  transition: 0.3s;
  position: relative;
  overflow: hidden;
  -webkit-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 2px 11px -5px rgba(0, 0, 0, 0.75);
`;

const Top = styled.div`
  height: 40px;

  justify-content: center;
  display: flex;

  cursor: pointer;
`;
