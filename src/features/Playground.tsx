import "./css/Playground.css";
import { Xwrapper } from "react-xarrows";
import MenuWindow from "./components/playground/MenuWindow";
import { BoxProps } from "./components/playground/props/BoxProps";
import { TopBarProps } from "./components/playground/props/TopBarProps";
import TopBar from "./components/playground/TopBar";
import { PlaygroundProps } from "./props/PlaygroundProps";
import Box from "./components/playground/Box";
import Xarrow from "./components/playground/Xarrow";
import useElementSize from "./hooks/useElementSize";
import { useEffect } from "react";

const Playground = (props: PlaygroundProps) => {
  console.log("re rendering Playground: props", props);

  const [boxRef, { width, height }] = useElementSize();
  useEffect(() => {
    console.log("useEffect of playground due to width & height", width, height);
    props.setSize({ width, height });
  }, [width, height]);

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
    gridData: props.gridData,
    setGridData: props.setGridData,
    handleDeleteRow: props.handleDeleteRow,
    toggleInitialState: props.toggleInitialState,
    toggleFinalState: props.toggleFinalState,
  };

  const boxProps: BoxProps = {
    states: props.states,
    setStates: props.setStates,
    transitions: props.transitions,
    setTransitions: props.setTransitions,
    selected: props.selected,
    handleSelect: props.handleSelect,
    actionState: props.actionState,
    gridData: props.gridData,
    setGridData: props.setGridData,
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
              {/* {shapes.map((shapeName) => ( */}
              <div
                className="state"
                // onDragStart={(e) => {
                //   console.log("drag start");
                //   e.dataTransfer.setData("shape", "state");
                // }}
                draggable
              >
                state
                {/* <div style={{ textAlign: "center" }}> state</div>
                  <img src={shapeName2Icon[shapeName]} alt="SwitchIcon" className={"switchIcon"} /> */}
              </div>
              {/* ))} */}
            </div>
          </div>
          <div
            id="boxesContainer"
            className="boxesContainer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={props.handleDropDynamic}
            ref={boxRef}
          >
            <TopBar {...topBarprops} />

            {props.states.map((box) => (
              <Box
                {...boxProps}
                key={box.id}
                box={box}
                position="absolute"
                sidePos="middle"
              />
            ))}
          </div>
          {/* xarrow connections*/}
          {props.transitions.map((line, i) => (
            <Xarrow
              key={line.props.start + "-" + line.props.end + i}
              line={line}
              selected={props.selected}
              setSelected={props.setSelected}
            />
          ))}
          {/* props.states menu that may be opened */}
          {props.transitions.map((line, i) =>
            line.menuWindowOpened ? (
              <MenuWindow
                key={line.props.start + "-" + line.props.end + i}
                setTransitions={props.setTransitions}
                line={line}
              />
            ) : null
          )}
        </div>
      </Xwrapper>
    </div>
  );
};
export default Playground;
