import { useState } from "react";
import Xarrow from "react-xarrows";
import {
  transitionColor,
  transitionHoverColor,
  transitionSelectedColor,
} from "../../../consts/Colors";
import { SelectedElementTypeId } from "../../props/SelectedElementType";
import { XarrowAllProps } from "./props/XarrowProps";

export default (props: XarrowAllProps) => {
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
        props.xarrowProps.setSelected({
          id: {
            start: props.transition.props.start,
            end: props.transition.props.end,
            value: props.transition.props.value,
          },
          type: "transition",
        });
      },
      cursor: "pointer",
    },
  };
  let color = props.transition.props?.color ?? state.color;
  if (
    props.xarrowProps.selected &&
    props.xarrowProps.selected.type === "transition" &&
    (props.xarrowProps.selected?.id as SelectedElementTypeId).start ===
      props.transition.props.start &&
    (props.xarrowProps.selected?.id as SelectedElementTypeId).end ===
      props.transition.props.end
  )
    color = transitionSelectedColor;
  return (
    console.log(
      "custom Xarrow defProps, props, state, color",
      defProps,
      props,
      state,
      color
    ),
    (
      <Xarrow
        {...{
          ...defProps,
          ...props.transition.props,
          ...props.xarrowProps,
          ...state,
          color,
        }}
      />
    )
  );
};
