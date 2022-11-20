import "../../css/Playground.css";
import { Xwrapper } from "react-xarrows";
import Xarrow from "../playground/Xarrow";
import { ToolsPlaygroundProps } from "./props/PlaygroundProps";

export const ToolsPlayground = (props: ToolsPlaygroundProps) => {
  console.log("re rendering ToolsPlayground: props", props);

  const stateToInquire = props.states?.at(0)?.id;
  const uniqueWord = // to ensure that the xarrow is unique
    stateToInquire?.includes("nc")
      ? "nc"
      : stateToInquire?.includes("ntd")
      ? "ntd"
      : stateToInquire?.includes("mt")
      ? "mt"
      : stateToInquire?.includes("md")
      ? "md"
      : "";

  return (
    <div>
      <Xwrapper>
        <div className="canvasStyle" id="canvas">
          <div id="statesContainer" className="statesContainer">
            {props.states.map((state) => (
              <div
                className={`state absolute hoverMarker`}
                style={{
                  left: state.x,
                  top: state.y,
                }}
                id={state.id}
              >
                {state.id.replaceAll(uniqueWord, "")}
              </div>
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
