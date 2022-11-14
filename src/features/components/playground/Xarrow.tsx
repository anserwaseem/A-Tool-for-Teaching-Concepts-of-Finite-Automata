import React, { useState } from "react";
import Xarrow from "react-xarrows";
import { TransitionModel } from "../../../models";

//{props: {line, setSelected, selected}}
export default ({ setSelected, selected, line: { props } }: any) => {
  console.log("re rendering Xarrow: props", props);
  const [state, setState] = useState({ color: "coral" });
  const defProps = {
    passProps: {
      className: "xarrow",
      onMouseEnter: () => setState({ color: "IndianRed" }),
      onMouseLeave: () => setState({ color: "coral" }),
      onClick: (e: any) => {
        e.stopPropagation(); //so only the click event on the box will fire on not on the container itself
        console.log("Xarrow onClick props", props);
        setSelected({
          id: {
            start: props.start,
            end: props.end,
            value: props.value,
          },
          type: "arrow",
        });
      },
      cursor: "pointer",
    },
  };
  let color = state.color;
  if (
    selected &&
    selected.type === "arrow" &&
    selected?.id.start === props.start &&
    selected?.id.end === props.end
  )
    color = "black";
  return (
    // console.log("custom Xarrow props", props),
    <Xarrow {...{ ...defProps, ...props, ...state, color }} />
  );
};
