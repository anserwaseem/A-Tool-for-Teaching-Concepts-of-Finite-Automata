import "../../css/Playground.css";
import { useXarrow, Xwrapper } from "react-xarrows";
import Xarrow from "../playground/Xarrow";
import { ToolsPlaygroundProps } from "./props/PlaygroundProps";
import Draggable from "react-draggable";
import { startingStateColor } from "../../../consts/Colors";

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
            {props.states.map((state, stateIndex) => (
              <Draggable onDrag={updateXarrow}>
                <div
                  className={`state absolute hoverMarker`}
                  style={{
                    left: state.x,
                    top: state.y,
                    background: props?.currentStates?.includes(state.id)
                      ? startingStateColor
                      : undefined,
                  }}
                  id={state.id}
                >
                  {state.id.replaceAll(uniqueWord, "")}
                </div>
              </Draggable>
            ))}
          </div>
          {/* xarrow connections*/}
          {props.transitions.map((transition, i) => (
            <Xarrow
              key={
                transition.props.start +
                "-" +
                transition.props.end +
                i +
                uniqueWord
              }
              transition={transition}
              selected={null}
              setSelected={() => {}}
            />
          ))}
        </div>
      </Xwrapper>
    </div>
  );
};
