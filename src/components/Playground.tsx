import React, { useState } from "react";
import "./Playground.css";
import Box from "./playgroundUI/Box";
import TopBar from "./playgroundUI/TopBar";
import Xarrow from "./playgroundUI/Xarrow";
import { Xwrapper } from "react-xarrows";
import MenuWindow from "./playgroundUI/MenuWindow";

const shapes = ["state"];

const PlayGround = () => {
  const [boxes, setBoxes] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);

  type selectedType = {
    id: string;
    type: "arrow" | "box";
  };
  const [selected, setSelected] = useState<selectedType | null>(null);
  const [actionState, setActionState] = useState("Normal");

  const handleSelect = (e: any) => {
    if (e === null) {
      setSelected(null);
      setActionState("Normal");
    } else setSelected({ id: e.target.id, type: "box" });
  };

  const checkExsitence = (id: any) => {
    return [...boxes].map((b) => b.id).includes(id);
  };

  const handleDropDynamic = (e: any) => {
    let shape = e.dataTransfer.getData("shape");
    if (shapes.includes(shape)) {
      let l = boxes.length;
      while (checkExsitence("q" + l)) l++;
      let { x, y } = e.target.getBoundingClientRect();
      var newName = prompt("Enter state name: ", "q" + l);
      if (newName) {
        let newBox = { id: newName, x: e.clientX - x, y: e.clientY - y, shape };
        setBoxes([...boxes, newBox]);
      }
    }
  };

  const props = {
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
              {shapes.map((shapeName) => (
                <div
                  key={shapeName}
                  className={shapeName}
                  onDragStart={(e) =>
                    e.dataTransfer.setData("shape", shapeName)
                  }
                  draggable
                >
                  {shapeName}
                  {/* <div style={{ textAlign: "center" }}> {shapeName}</div>
                  <img src={shapeName2Icon[shapeName]} alt="SwitchIcon" className={"switchIcon"} /> */}
                </div>
              ))}
            </div>
          </div>
          <div
            id="boxesContainer"
            className="boxesContainer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropDynamic}
          >
            <TopBar {...props} />

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
