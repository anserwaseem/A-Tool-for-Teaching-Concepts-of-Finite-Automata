import { MutableRefObject, useLayoutEffect, useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";
import { PlaygroundSize } from "../../components/interfaces/playgroundSize";

export default function useElementSize<
  T extends HTMLElement = HTMLDivElement
>(): [MutableRefObject<T | null>, PlaygroundSize] {
  const target = useRef<T | null>(null);
  const [size, setSize] = useState<PlaygroundSize>({
    width: 0,
    height: 0,
  });

  const setRoundedSize = ({ width, height }: PlaygroundSize) => {
    setSize({ width: Math.round(width) - 51, height: Math.round(height) - 51 }); // -51 because state is 50px in size so we need to remove that from the width and height plus 1 for the border
  };

  useLayoutEffect(() => {
    target.current && setRoundedSize(target.current.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry) => {
    const { inlineSize: width, blockSize: height } = entry.contentBoxSize[0];
    setRoundedSize({ width, height });
  });

  return [target, size];
}
