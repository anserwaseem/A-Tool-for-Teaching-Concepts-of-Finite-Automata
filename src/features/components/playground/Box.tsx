import React, { useEffect, useState } from "react";
import "./css/Box.css";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import { RowModel, TransitionModel } from "../../../models";

export const Box = (props: any) => {
  console.log("re rendering Box: props", props);

  const updateXarrow = useXarrow();
  const handleClick = (e: any) => {
    console.log("Box handleClick", props);
    e.stopPropagation(); //so only the click event on the box will fire on not on the container itself

    if (props.actionState === "Normal") {
      console.log("Box handleClick Normal", props);
      props.handleSelect(e);
    } else if (props.actionState === "Add Transition") {
      console.log("Box handleClick Add Transition", props);

      // restrict adding of new transition between states where a transition already exists
      if (
        !props.lines.find(
          (line: TransitionModel) =>
            line.props.start === props.selected?.id &&
            line.props.end === props.box.id
        )
      ) {
        console.log("Box handleClick Add Transition setLines", props);
        const isSelfTransition = props.selected?.id === props.box.id;
        props.setLines((lines: TransitionModel[]) => [
          ...lines,
          {
            props: {
              labels: "",
              value: "",
              start: props.selected?.id,
              end: props.box.id,
              // dashness: { animation: 10 },
              animateDrawing: true,
              _extendSVGcanvas: isSelfTransition ? 25 : 0,
              _cpx1Offset: isSelfTransition ? -50 : 0,
              _cpy1Offset: isSelfTransition ? -50 : 0,
              _cpx2Offset: isSelfTransition ? 50 : 0,
              _cpy2Offset: isSelfTransition ? -50 : 0,
            },
            menuWindowOpened: false,
          },
        ]);
      }
    } else if (props.actionState === "Remove Transitions") {
      console.log("Box handleClick Remove Transitions", props);
      props.setLines((lines: TransitionModel[]) =>
        lines.filter(
          (line) =>
            !(
              line.props.start === props.selected?.id &&
              line.props.end === props.box.id
            )
        )
      );
    }
  };

  console.log("changing background color now", props.actionState);
  let background = null;
  if (props.selected && props.selected?.id === props.box.id) {
    // background = "lightblue";
    background = "rgb(200, 200, 200)";
  } else if (
    (props.actionState === "Add Transition" &&
      // props.sidePos !== "right" &&
      props.lines.filter(
        (line: TransitionModel) =>
          line.props.start === props.selected?.id &&
          line.props.end === props.box.id
      ).length === 0) ||
    (props.actionState === "Remove Transitions" &&
      props.lines.filter(
        (line: TransitionModel) =>
          line.props.start === props.selected?.id &&
          line.props.end === props.box.id
      ).length > 0)
  ) {
    background = "LemonChiffon";
  }
  // link for these color names and codes: https://mui.com/material-ui/customization/palette/
  else if (
    props.gridData.find(
      (row: RowModel) =>
        row.node === props.box.id && row.isInitial && row.isFinal
    )
  ) {
    background = "#4fc3f7"; // mui theme.palette.info.light
  } else if (
    props.gridData.find(
      (row: RowModel) => row.node === props.box.id && row.isInitial
    )
  ) {
    background = "#ffb74d"; // mui theme.palette.warning.light
  } else if (
    props.gridData.find(
      (row: RowModel) => row.node === props.box.id && row.isFinal
    )
  ) {
    background = "#81c784"; // mui theme.palette.success.light;
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
