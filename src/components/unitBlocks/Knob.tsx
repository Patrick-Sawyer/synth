import {
  PointerEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { debounce } from "../../utils/debounce";
import { Label } from "./Label";

const limitValue = (value: number) => {
  if (value < -0) return 0;
  if (value > 100) return 100;
  return value;
};

interface State {
  mouseDownPosition?: number;
  valueAtMouseDown?: number;
}

interface Props {
  text?: string;
  min: number;
  max: number;
  resetValue: number;
  onChange: (value: number) => void;
  initValue: number;
  small?: boolean;
  exponentialAmount?: number;
}

const getAsPercentage = (
  value: number,
  min: number,
  max: number,
  exponentialAmount: number
): number => {
  const range = max - min;
  const trueValue = value - min;
  const valueAsFraction = trueValue / range;
  const exponential = Math.pow(valueAsFraction, 1 / exponentialAmount);

  return exponential * 100;
};

export function Knob({
  text,
  min = 0,
  max = 1,
  onChange,
  resetValue,
  initValue,
  small = false,
  exponentialAmount = 1,
}: Props) {
  const state = useRef<State>({});
  const [value, setValue] = useState(
    initValue !== undefined
      ? getAsPercentage(initValue, min, max, exponentialAmount)
      : 0
  );

  const onPointerDown: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      state.current.mouseDownPosition = e.screenY;
      state.current.valueAtMouseDown = value;
    },
    [value]
  );

  const onPointerUp = () => {
    state.current.mouseDownPosition = undefined;
    state.current.valueAtMouseDown = undefined;
  };

  const onPointerMove = debounce((e: PointerEvent) => {
    e.preventDefault();
    if (
      state.current.mouseDownPosition !== undefined &&
      state.current.valueAtMouseDown !== undefined
    ) {
      const changeThisTouch = state.current.mouseDownPosition - e.screenY;
      const newValue = state.current.valueAtMouseDown + changeThisTouch;
      const limited = limitValue(newValue);
      if (value !== limited) {
        setValue(limited);
      }
    }
  }, 25);

  const reset = () => {
    const newPercentage = getAsPercentage(
      resetValue,
      min,
      max,
      exponentialAmount
    );
    setValue(newPercentage);
  };

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [onPointerMove]);

  useEffect(() => {
    if (onChange) {
      const fraction = value / 100;
      const range = max - min;
      let newValue = fraction * range + min;
      const exponential =
        Math.pow(newValue, exponentialAmount) /
        Math.pow(max, exponentialAmount - 1);

      if (!Number.isNaN(exponential)) {
        onChange(exponential);
      }
    }
  }, [exponentialAmount, max, min, onChange, value]);

  return (
    <Wrapper>
      <Shadow small={small}>
        <InnerShadow small={small}>
          <Inner
            small={small}
            style={{
              transform: `rotate(${value / 120 + 0.58}turn)`,
            }}
            onPointerDown={onPointerDown}
            onDoubleClick={reset}
          >
            <Marker />
          </Inner>
        </InnerShadow>
      </Shadow>
      {!!text && <Label>{text}</Label>}
    </Wrapper>
  );
}

const Shadow = styled.div<{
  small?: boolean;
}>`
  height: ${({ small }) => (small ? "18px" : "30px")};
  width: ${({ small }) => (small ? "18px" : "30px")};
  border-radius: 50%;
  box-shadow: 1px 5px 11px -2px rgba(0, 0, 0, 0.5);
`;

const InnerShadow = styled.div<{
  small?: boolean;
}>`
  height: ${({ small }) => (small ? "18px" : "30px")};
  width: ${({ small }) => (small ? "18px" : "30px")};
  border-radius: 50%;
  box-shadow: inset 1px -5px 11px -2px rgba(0, 0, 0, 0.3);
`;

const Wrapper = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 12px;
`;

const Inner = styled.div<{
  small?: boolean;
}>`
  height: ${({ small }) => (small ? "18px" : "30px")};
  width: ${({ small }) => (small ? "18px" : "30px")};
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

const Marker = styled.div`
  top: 0;
  height: 3px;
  width: 3px;
  border-radius: 50%;
  background-color: white;
  margin-top: 5px;
`;
