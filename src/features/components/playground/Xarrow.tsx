import { useState } from "react";
import Xarrow from "react-xarrows";

export default ({ setSelected, selected, transition: { props } }: any) => {
  console.log("re rendering Xarrow: props", props);
  const [state, setState] = useState({ color: "coral" });
  const defProps = {
    passProps: {
      className: "xarrow",
      onMouseEnter: () => setState({ color: "IndianRed" }),
      onMouseLeave: () => setState({ color: "coral" }),
      onClick: (e: any) => {
        e.stopPropagation(); //so only the click event on the state will fire on not on the container itself
        console.log("Xarrow onClick props", props);
        setSelected({
          id: {
            start: props.start,
            end: props.end,
            value: props.value,
          },
          type: "transition",
        });
      },
      cursor: "pointer",
    },
  };
  let color = props?.color ?? state.color;
  if (
    selected &&
    selected.type === "transition" &&
    selected?.id.start === props.start &&
    selected?.id.end === props.end
  )
    color = "black";
  return (
    console.log(
      "custom Xarrow defProps, props, state, color",
      defProps,
      props,
      state,
      color
    ),
    (<Xarrow {...{ ...defProps, ...props, ...state, color }} />)
  );
};
