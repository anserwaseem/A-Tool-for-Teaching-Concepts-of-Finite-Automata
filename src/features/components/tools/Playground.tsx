import "../../css/Playground.css";
import { useXarrow, Xwrapper } from "react-xarrows";
import Xarrow from "../playground/Xarrow";
import { ToolsPlaygroundProps } from "./props/PlaygroundProps";
import Draggable from "react-draggable";
import { startingStateColor, stateHoverColor } from "../../../consts/Colors";
import { XarrowProps } from "../playground/props/XarrowProps";
import { Box } from "@mui/material";

export const ToolsPlayground = (props: ToolsPlaygroundProps) => {
  console.log("re rendering ToolsPlayground: props", props);

  const updateXarrow = useXarrow();

  const stateToInquire = props.states?.at(0)?.id;
  const uniqueWord = // to ensure that the xarrow is unique
    stateToInquire?.includes("nc")
      ? "nc"
      : stateToInquire?.includes("ntd")
      ? "ntd"
      : stateToInquire?.includes("est")
      ? "est"
      : stateToInquire?.includes("md")
      ? "md"
      : stateToInquire?.includes("ts")
      ? "ts"
      : "";

  const xarrowProps: XarrowProps = {
    selected: null,
    setSelected: () => {},
  };

  return (
    <div>
      <Xwrapper>
        <div
          className="canvasStyle"
          id="canvas"
          style={props?.canvasWidth ? { width: props?.canvasWidth } : {}}
        >
          <div
            id="statesContainer"
            className="statesContainer"
            onDragOver={(e) => e.preventDefault()}
          >
            {props.states.map((state) => (
              <Draggable onDrag={updateXarrow}>
                <Box
                  className="state"
                  sx={{
                    width: `${props?.stateSize}px`,
                    height: `${props?.stateSize}px`,
                    borderRadius: `${props?.stateSize}px`,
                    left: state.x,
                    top: state.y,
                    background: props?.currentStates?.includes(state.id)
                      ? startingStateColor
                      : undefined,
                    position: "absolute",
                    "&:hover": {
                      background: stateHoverColor,
                    },
                  }}
                  id={state.id}
                >
                  {state.id.replaceAll(uniqueWord, "")}
                </Box>
              </Draggable>
            ))}
          </div>
          {/* xarrow connections*/}
          {props.transitions.map((transition, i) => (
            <Xarrow
              xarrowProps={xarrowProps}
              key={transition.start + "-" + transition.end + i + uniqueWord}
              transition={transition}
            />
          ))}
        </div>
      </Xwrapper>
    </div>
  );
};
