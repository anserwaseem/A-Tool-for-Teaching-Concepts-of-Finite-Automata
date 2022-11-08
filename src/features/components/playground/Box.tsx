import React from "react";
import "./css/Box.css";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import { TransitionModel } from "../../../models";

export const Box = (props: any) => {
  const updateXarrow = useXarrow();
  // const handleDrag = () => props.setBoxes([...props.boxes]);
  const handleClick = (e: any) => {
    console.log("Box handleClick", props);
    e.stopPropagation(); //so only the click event on the box will fire on not on the container itself

    if (props.actionState === "Normal") {
      props.handleSelect(e);
    } else if (
      props.actionState === "Add Transition" &&
      props.selected.id !== props.box.id
    ) {
      props.setLines((lines: TransitionModel[]) => [
        ...lines,
        {
          props: {
            start: props.selected.id,
            end: props.box.id,
            labels: (
              <div
                contentEditable
                suppressContentEditableWarning={true}
                style={{
                  fontSize: "1.5em",
                  padding: "0.4em 0.4em 0",
                  color: "purple",
                  marginBottom: "1em",
                  borderRadius: "1.5em",
                }}
              >
                ^
              </div>
            ),
            // dashness: { animation: 10 },
            animateDrawing: true,
          },
          menuWindowOpened: false,
        },
      ]);
    } else if (props.actionState === "Remove Transitions") {
      props.setLines((lines: TransitionModel[]) =>
        lines.filter(
          (line) =>
            !(
              line.props.start === props.selected.id &&
              line.props.end === props.box.id
            )
        )
      );
    }
  };

  let background = null;
  if (props.selected && props.selected.id === props.box.id) {
    background = "rgb(200, 200, 200)";
  } else if (
    (props.actionState === "Add Transition" &&
      // props.sidePos !== "right" &&
      props.lines.filter(
        (line: TransitionModel) =>
          line.props.start === props.selected.id &&
          line.props.end === props.box.id
      ).length === 0) ||
    (props.actionState === "Remove Transitions" &&
      props.lines.filter(
        (line: TransitionModel) =>
          line.props.start === props.selected.id &&
          line.props.end === props.box.id
      ).length > 0)
  ) {
    background = "LemonChiffon";
  }

  return (
    <React.Fragment>
      <Draggable
        onStart={props.position !== "static" ? () => {} : undefined}
        bounds="parent"
        onDrag={updateXarrow}
      >
        <div
          ref={props.box.reference}
          className={`${props.box.shape} ${props.position} hoverMarker`}
          style={{
            left: props.box.x,
            top: props.box.y,
            background: background ?? undefined,
            // border: "black solid 2px",
          }}
          onClick={handleClick}
          id={props.box.id}
        >
          {props.box.name ? props.box.name : props.box.id}
        </div>
      </Draggable>
      {/* {type === "middleBox" && menuWindowOpened ?
      <MenuWindow setBoxes={props.setBoxes} box={props.box}/> : null
      } */}
    </React.Fragment>
  );
};

export default Box;
