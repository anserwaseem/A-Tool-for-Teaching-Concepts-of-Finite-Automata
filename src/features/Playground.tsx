import "./css/Playground.css";
import { Xwrapper } from "react-xarrows";
import { StateProps } from "./components/playground/props/StateProps";
import { TopBarProps } from "./components/playground/props/TopBarProps";
import TopBar from "./components/playground/TopBar";
import { PlaygroundProps } from "./props/PlaygroundProps";
import State from "./components/playground/State";
import Xarrow from "./components/playground/Xarrow";
import useElementSize from "./hooks/useElementSize";
import { useEffect } from "react";
import { XarrowProps } from "./components/playground/props/XarrowProps";

const Playground = (props: PlaygroundProps) => {
  console.log("re rendering Playground: props", props);

  const [boxRef, { width, height }] = useElementSize();
  const { setSize } = props;

  useEffect(() => {
    console.log("useEffect of playground due to width & height", width, height);
    setSize({ width, height });
  }, [width, height, setSize]);

  const topBarprops: TopBarProps = {
    states: props.states,
    setStates: props.setStates,
    transitions: props.transitions,
    setTransitions: props.setTransitions,
    selected: props.selected,
    setSelected: props.setSelected,
    handleSelect: props.handleSelect,
    actionState: props.actionState,
    setActionState: props.setActionState,
    rows: props.rows,
    setRows: props.setRows,
    handleDeleteRow: props.handleDeleteRow,
    toggleInitialState: props.toggleInitialState,
    toggleFinalState: props.toggleFinalState,
  };

  const stateProps: StateProps = {
    states: props.states,
    setStates: props.setStates,
    transitions: props.transitions,
    setTransitions: props.setTransitions,
    selected: props.selected,
    handleSelect: props.handleSelect,
    actionState: props.actionState,
    rows: props.rows,
    setRows: props.setRows,
  };

  const xarrowProps: XarrowProps = {
    selected: props.selected,
    setSelected: props.setSelected,
  };

  return (
    <div>
      <Xwrapper>
        <div
          className="canvasStyle"
          id="canvas"
          onClick={() => props.handleSelect(null)}
        >
          <div className="toolboxMenu">
            <div className="toolboxTitle">Drag & drop me!</div>
            <hr />
            <div className="toolboxContainer">
              <div className="state" draggable>
                state
              </div>
            </div>
          </div>
          <div
            id="statesContainer"
            className="statesContainer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={props.handleDropDynamic}
            ref={boxRef}
          >
            <TopBar {...topBarprops} />

            {props.states.map((state) => (
              <State
                {...stateProps}
                key={state.id}
                state={state}
                position="absolute"
                sidePos="middle"
              />
            ))}
          </div>
          {/* xarrow connections*/}
          {props.transitions.map((transition, i) => (
            <Xarrow
              {...xarrowProps}
              key={transition.props.start + "-" + transition.props.end + i}
              transition={transition}
            />
          ))}
        </div>
      </Xwrapper>
    </div>
  );
};
export default Playground;
