import { MutableRefObject, useLayoutEffect, useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";
import { PlaygroundSize } from "../../pages/types/PlaygroundSize";
import { DraggableStateModel } from "../../models";

export default function useElementSize<T extends HTMLElement = HTMLDivElement>(
  stateSize: number,
  setStates: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>
): [MutableRefObject<T | null>, PlaygroundSize] {
  const target = useRef<T | null>(null);
  const [size, setSize] = useState<PlaygroundSize>({
    width: 0,
    height: 0,
  });

  const setRoundedSize = ({ width, height }: PlaygroundSize) => {
    setSize({
      width: Math.round(width) - stateSize - 1,
      height: Math.round(height) - stateSize - 1,
    }); // -1 for the border
  };

  const adjustStates = (size: PlaygroundSize) => {
    setStates((states) => {
      return states.map((state) => {
        return {
          ...state,
          x:
            state.x + stateSize + 1 > size.width
              ? size.width - stateSize - 1
              : state.x,
          y:
            state.y + stateSize + 1 > size.height
              ? size.height - stateSize - 1
              : state.y,
        };
      });
    });
  };

  useLayoutEffect(() => {
    if (target.current) {
      setRoundedSize(target.current.getBoundingClientRect());
      adjustStates(target.current.getBoundingClientRect());
    }
  }, [target]);

  useResizeObserver(target, (entry) => {
    const { inlineSize: width, blockSize: height } = entry.contentBoxSize[0];
    setRoundedSize({ width, height });
    adjustStates({ width, height });
  });

  return [target, size];
}
