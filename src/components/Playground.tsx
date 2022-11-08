import "./css/Playground.css";
import Box from "./playgroundUI/Box";
import TopBar from "./playgroundUI/TopBar";
import Xarrow from "./playgroundUI/Xarrow";
import { Xwrapper } from "react-xarrows";
import MenuWindow from "./playgroundUI/MenuWindow";
import { PlaygroundProps } from "./props/PlaygroundProps";
import { TopBarProps } from "./playgroundUI/props/TopBarProps";
import { BoxProps } from "./playgroundUI/props/BoxProps";

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
  };

  const boxProps: BoxProps = {
    boxes: props.boxes,
    setBoxes: props.setBoxes,
    lines: props.lines,
    setLines: props.setLines,
    selected: props.selected,
    handleSelect: props.handleSelect,
    actionState: props.actionState,
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
              key={line.props.root + "-" + line.props.end + i}
              line={line}
              selected={props.selected}
              setSelected={props.setSelected}
            />
          ))}
          {/* props.boxes menu that may be opened */}
          {props.lines.map((line, i) =>
            line.menuWindowOpened ? (
              <MenuWindow
                key={line.props.root + "-" + line.props.end + i}
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
