import "../../css/Playground.css";
import { Xwrapper } from "react-xarrows";
import Xarrow from "../playground/Xarrow";
import { NfaToDfaPlaygroundProps } from "./props/PlaygroundProps";

export const NfaToDfaPlayground = (props: NfaToDfaPlaygroundProps) => {
  console.log("re rendering NfaToDfaPlayground: props", props);

  return (
    <div>
      <Xwrapper>
        <div className="canvasStyle" id="canvas">
          <div id="statesContainer" className="statesContainer">
            {props.states.map((state) => (
              <div
                // ref={props.state.reference}
                className={`state absolute hoverMarker`}
                style={{
                  left: state.x,
                  top: state.y,
                }}
                id={state.id}
              >
                {state.id.replace("nc", "")}
              </div>
            ))}
          </div>
          {/* xarrow connections*/}
          {props.transitions.map((transition, i) => (
            <Xarrow
              key={
                transition.props.start + "-" + transition.props.end + i + "nc"
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
