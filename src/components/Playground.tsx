import React, { BaseSyntheticEvent, useState } from "react";
import "./Playground.css";
import Box from "./playgroundUI/Box";
import TopBar from "./playgroundUI/TopBar";
import Xarrow from "./playgroundUI/Xarrow";
import { Xwrapper } from "react-xarrows";
import MenuWindow from "./playgroundUI/MenuWindow";
import DraggableStateModel from "../models/DraggableStateModel";

// const shapes = ["state"];

const PlayGround = () => {
  const [boxes, setBoxes] = useState<DraggableStateModel[]>([]);
  const [lines, setLines] = useState<any[]>([]);

  type selectedType = {
    id: string;
    type: "arrow" | "box";
  };
  const [selected, setSelected] = useState<selectedType | null>(null);
  const [actionState, setActionState] = useState("Normal");

  const handleSelect = (e: any) => {
    console.log("PlayGround handleSelect", e);
    if (e === null) {
      setSelected(null);
      setActionState("Normal");
    } else setSelected({ id: e.target.id, type: "box" });
  };

  const checkExsitence = (id: string) => {
    return [...boxes].map((b) => b.id).includes(id);
  };

  const handleDropDynamic = (e: any) => {
    console.log("handleDropDynamic", e);
    // let shape = e.dataTransfer.getData("shape");
    // if (shapes.includes(shape)) {
    let l = boxes.length;
    while (checkExsitence("q" + l)) l++;
    let { x, y } = e.target.getBoundingClientRect();
    const stateName = prompt("Enter state name: ", "q" + l);
    if (stateName) {
      let newState = new DraggableStateModel(
        stateName,
        e.clientX - x,
        e.clientY - y
      );
      let newBox = {
        id: stateName,
        x: e.clientX - x,
        y: e.clientY - y,
        shape: "state",
      };
      setBoxes([...boxes, newBox]);
    }
    console.log("boxes", boxes);
    // }
  };

  const topBarprops = {
    boxes,
    setBoxes,
    selected,
    handleSelect,
    actionState,
    setActionState,
    lines,
    setLines,
  };

  const boxProps = {
    boxes,
    setBoxes,
    selected,
    handleSelect,
    actionState,
    setLines,
    lines,
  };

  return (
    <div>
      <Xwrapper>
        <div
          className="canvasStyle"
          id="canvas"
          onClick={() => handleSelect(null)}
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
            onDrop={handleDropDynamic}
          >
            <TopBar {...topBarprops} />

            {boxes.map((box) => (
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
          {lines.map((line, i) => (
            <Xarrow
              key={line.props.root + "-" + line.props.end + i}
              line={line}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
          {/* boxes menu that may be opened */}
          {lines.map((line, i) =>
            line.menuWindowOpened ? (
              <MenuWindow
                key={line.props.root + "-" + line.props.end + i}
                setLines={setLines}
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
