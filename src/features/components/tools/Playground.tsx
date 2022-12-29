import "../../css/Playground.css";
import { useXarrow, Xwrapper } from "react-xarrows";
import Xarrow from "../playground/Xarrow";
import { ToolsPlaygroundProps } from "./props/PlaygroundProps";
import Draggable from "react-draggable";
import { startingStateColor, stateHoverColor } from "../../../consts/Colors";
import { XarrowCoreProps } from "../playground/props/XarrowProps";
import { Box } from "@mui/material";
import { useEffect } from "react";

export const ToolsPlayground = (props: ToolsPlaygroundProps) => {
  console.log("re rendering ToolsPlayground: props", props);

  const updateXarrow = useXarrow();

  useEffect(() => {
    props.setTransitions((transitions) =>
      transitions.map((t) => {
        return {
          ...t,
          strokeWidth: props?.stateSize / 10,
        };
      })
    );
  }, [props?.stateSize]);

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

  const xarrowProps: XarrowCoreProps = {
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
              <Draggable bounds="parent" onDrag={updateXarrow}>
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
              core={xarrowProps}
              key={transition.start + "-" + transition.end + i + uniqueWord}
              transition={transition}
            />
          ))}
        </div>
      </Xwrapper>
    </div>
  );
};
