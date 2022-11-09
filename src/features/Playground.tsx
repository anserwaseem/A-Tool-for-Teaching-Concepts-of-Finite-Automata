import "./css/Playground.css";
import { Xwrapper } from "react-xarrows";
import MenuWindow from "./components/playground/MenuWindow";
import { BoxProps } from "./components/playground/props/BoxProps";
import { TopBarProps } from "./components/playground/props/TopBarProps";
import TopBar from "./components/playground/TopBar";
import { PlaygroundProps } from "./props/PlaygroundProps";
import Box from "./components/playground/Box";
import Xarrow from "./components/playground/Xarrow";

const PlayGround = (props: PlaygroundProps) => {
  const topBarprops: TopBarProps = {
    boxes: props.boxes,
    setBoxes: props.setBoxes,
    lines: props.lines,
    setLines: props.setLines,
    selected: props.selected,
    handleSelect: props.handleSelect,
    actionState: props.actionState,
    setActionState: props.setActionState,
    setGridData: props.setGridData,
    handleDeleteRow: props.handleDeleteRow,
  };

  const boxProps: BoxProps = {
    boxes: props.boxes,
    setBoxes: props.setBoxes,
    lines: props.lines,
    setLines: props.setLines,
    selected: props.selected,
    handleSelect: props.handleSelect,
    actionState: props.actionState,
    gridData: props.gridData,
    setGridData: props.setGridData,
    transitionValue: props.transitionValue,
    setTransitionValue: props.setTransitionValue,
    oldTransitionValue: props.oldTransitionValue,
    setOldTransitionValue: props.setOldTransitionValue,
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
          >
            <TopBar {...topBarprops} />

            {props.boxes.map((box) => (
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
          {props.lines.map((line, i) => (
            <Xarrow
              key={line.props.start + "-" + line.props.end + i}
              line={line}
              selected={props.selected}
              setSelected={props.setSelected}
            />
          ))}
          {/* props.boxes menu that may be opened */}
          {props.lines.map((line, i) =>
            line.menuWindowOpened ? (
              <MenuWindow
                key={line.props.start + "-" + line.props.end + i}
                setLines={props.setLines}
                line={line}
              />
            ) : null
          )}
        </div>
      </Xwrapper>
    </div>
  );
};
export default PlayGround;
