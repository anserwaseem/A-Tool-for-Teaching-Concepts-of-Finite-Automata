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
import { DataContext } from "../components/Editor";
import { useContext } from "react";
import { Box } from "@mui/material";

const Playground = (props: PlaygroundProps) => {
  console.log("re rendering Playground: props", props);

  const dataContext = useContext(DataContext);

  const [boxRef, { width, height }] = useElementSize();
  const { setPlaygroundSize } = props;

  useEffect(() => {
    console.log("useEffect of playground due to width & height", width, height);
    setPlaygroundSize({ width, height });
  }, [width, height, setPlaygroundSize]);

  const topBarprops: TopBarProps = {
    selected: props.selected,
    setSelected: props.setSelected,
    handleSelect: props.handleSelect,
    actionState: props.actionState,
    setActionState: props.setActionState,
    handleDeleteRow: props.handleDeleteRow,
    toggleInitialState: props.toggleInitialState,
    toggleFinalState: props.toggleFinalState,
  };

  const stateProps: StateProps = {
    selected: props.selected,
    handleSelect: props.handleSelect,
    actionState: props.actionState,
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
            <Box>Drag & drop me!</Box>
            {/* <div className="toolboxTitle">Drag & drop me!</div> */}
            <hr />
            <div className="toolboxContainer">
              <div
                className="state"
                draggable
                style={{
                  width: `${dataContext?.stateSize}px`,
                  height: `${dataContext?.stateSize}px`,
                  borderRadius: `${dataContext?.stateSize}px`,
                }}
              >
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
              <State stateProps={stateProps} key={state.id} state={state} />
            ))}
          </div>
          {/* xarrow connections*/}
          {props.transitions.map((transition, i) => (
            <Xarrow
              xarrowProps={xarrowProps}
              key={transition.start + "-" + transition.end + i}
              transition={transition}
            />
          ))}
        </div>
      </Xwrapper>
    </div>
  );
};
export default Playground;
