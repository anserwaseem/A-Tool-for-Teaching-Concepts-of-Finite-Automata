import { useState } from "react";
import Xarrow from "react-xarrows";
import {
  transitionColor,
  transitionHoverColor,
  transitionSelectedColor,
} from "../../../consts/Colors";
import { SelectedElementTypeId } from "../../props/SelectedElementType";
import { XarrowProps } from "./props/XarrowProps";

export default (props: XarrowProps) => {
  console.log("re rendering Xarrow: props", props);

  const [state, setState] = useState({ color: transitionColor });

  const defProps = {
    passProps: {
      className: "xarrow",
      onMouseEnter: () => setState({ color: transitionHoverColor }),
      onMouseLeave: () => setState({ color: transitionColor }),
      onClick: (e: any) => {
        e.stopPropagation(); //so only the click event on the state will fire on not on the container itself
        console.log("Xarrow onClick props", props);
        props?.core?.setSelected({
          id: {
            start: props.transition.start,
            end: props.transition.end,
            value: props.transition.value,
          },
          type: "transition",
        });
      },
      cursor: "pointer",
    },
  };

  let color = props.transition?.color ?? state.color;
  if (
    props?.core?.selected &&
    props?.core?.selected.type === "transition" &&
    (props?.core?.selected?.id as SelectedElementTypeId)?.start ===
      props.transition.start &&
    (props?.core?.selected?.id as SelectedElementTypeId)?.end ===
      props.transition.end
  )
    color = transitionSelectedColor;
    
  return (
    (
      <Xarrow
        {...{
          ...defProps,
          ...props.transition,
          ...props.core,
          ...state,
          color,
        }}
      />
    )
  );
};
