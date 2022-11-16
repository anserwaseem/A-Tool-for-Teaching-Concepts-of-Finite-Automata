import "../../css/Playground.css";
import { Xwrapper } from "react-xarrows";
import Xarrow from "../playground/Xarrow";
import { NfaToDfaPlaygroundProps } from "./props/PlaygroundProps";

export const NfaToDfaPlayground = (props: NfaToDfaPlaygroundProps) => {
  console.log("re rendering NfaToDfaPlayground: props", props);

  //   const stateProps: StateProps = {
  //     states: props.states,
  //     setStates: props.setStates,
  //     transitions: props.transitions,
  //     setTransitions: props.setTransitions,
  //     rows: props.rows,
  //     setRows: props.setRows,
  //   };

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
                {state.id}
              </div>
              // <State
              //   // {...stateProps}
              //   key={state.id}
              //   state={state}
              //   position="absolute"
              //   sidePos="middle"
              // />
            ))}
          </div>
          {/* xarrow connections*/}
          {props.transitions.map((transition, i) => (
            <Xarrow
              key={transition.props.start + "-" + transition.props.end + i}
              transition={transition}
            />
          ))}
        </div>
      </Xwrapper>
    </div>
  );
};
