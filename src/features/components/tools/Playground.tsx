import "../../css/Playground.css";
import { useXarrow, Xwrapper } from "react-xarrows";
import Xarrow from "../playground/Xarrow";
import { ToolsPlaygroundProps } from "./props/PlaygroundProps";
import Draggable from "react-draggable";
import {
  startingStateColor,
  stateFinalColor,
  stateHoverColor,
  stateInitialColor,
  stateInitialFinalColor,
} from "../../../consts/Colors";
import { XarrowCoreProps } from "../playground/props/XarrowProps";
import { Box } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../components/Editor";
import { NullCLosureStateId, ResultantDfaStateId, EquivalentStatesStateId, MinimizedDfaStateId, TestStringStateId } from "../../../consts/StateIdsExtensions";

export const ToolsPlayground = (props: ToolsPlaygroundProps) => {
  console.log("re rendering ToolsPlayground: props", props);

  const dataContext = useContext(DataContext);

  const [initialState, setInitialState] = useState<string>(
    dataContext.rows.find((row) => row.isInitial).state
  );
  const [finalStates, setFinalStates] = useState<string[]>(
    dataContext.rows.filter((row) => row.isFinal).map((row) => row.state)
  );

  const updateXarrow = useXarrow();

  useEffect(() => {
    setInitialState(dataContext.rows.find((row) => row.isInitial).state);
    setFinalStates(
      dataContext.rows.filter((row) => row.isFinal).map((row) => row.state)
    );
  }, [dataContext]);

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
    stateToInquire?.includes(NullCLosureStateId)
      ? NullCLosureStateId
      : stateToInquire?.includes(ResultantDfaStateId)
      ? ResultantDfaStateId
      : stateToInquire?.includes(EquivalentStatesStateId)
      ? EquivalentStatesStateId
      : stateToInquire?.includes(MinimizedDfaStateId)
      ? MinimizedDfaStateId
      : stateToInquire?.includes(TestStringStateId)
      ? TestStringStateId
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
            {props.states.map((state, index) => (
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
                      : index === 0 &&
                        state.id
                          .replaceAll(uniqueWord, "")
                          .split(", ")
                          .includes(initialState) &&
                        state.id
                          .replaceAll(uniqueWord, "")
                          .split(", ")
                          .some((s) => finalStates.includes(s))
                      ? stateInitialFinalColor
                      : index === 0 &&
                        state.id
                          .replaceAll(uniqueWord, "")
                          .split(", ")
                          .includes(initialState)
                      ? stateInitialColor
                      : state.id
                          .replaceAll(uniqueWord, "")
                          .split(", ")
                          .some((s) => finalStates.includes(s))
                      ? stateFinalColor
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
