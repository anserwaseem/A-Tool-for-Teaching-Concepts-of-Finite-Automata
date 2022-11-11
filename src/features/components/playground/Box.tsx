import React, { useEffect, useState } from "react";
import "./css/Box.css";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import { RowModel, TransitionModel } from "../../../models";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";

let localOldTransVal = "";
let oldTransitionValues: string[] = [];
// let testval = "b";

export const Box = (props: any) => {
  console.log("re rendering box: props", props);
  const [sourceState, setSourceState] = useState("");
  const [targetState, setTargetState] = useState("");

  // useEffect(() => {
  //   console.log("useEffect", props, props.transitionValue);
  //   // props.setLines &&
  //   //   props.setLines((lines: TransitionModel[]) => {
  //   //     (lines as TransitionModel[])?.map((line) => {
  //   //       if (
  //   //         props.selected &&
  //   //         line.props.start === props.selected.id &&
  //   //         line.props.end === props.box.id
  //   //       ) {
  //   //         line.props.value = props.transitionValue;
  //   //       }
  //   //       return line;
  //   //     });
  //   //   });
  //   // console.log(
  //   //   "setLines again",
  //   //   (props.lines as TransitionModel[])?.map((line) => {
  //   //     if (
  //   //       props.selected &&
  //   //       line.props.start === props.selected.id &&
  //   //       line.props.end === props.box.id
  //   //     ) {
  //   //       line.props.value = props.transitionValue;
  //   //     }
  //   //     return line;
  //   //   })
  //   // );
  //   props.setGridData((rows: RowModel[]) => {
  //     if (sourceState !== "" && targetState !== "") {
  //       const row = rows.find((row) => row.node === sourceState); //source row
  //       console.log("useEffect setGridData found source row", row);

  //       console.log(
  //         "props.transitionValue",
  //         props.transitionValue,
  //         "row[props.transitionValue]",
  //         row![props.transitionValue],
  //         "sourceState",
  //         sourceState,
  //         "targetState",
  //         targetState,
  //         "props.oldTransitionValue",
  //         props.oldTransitionValue,
  //         "localOldTransVal",
  //         localOldTransVal
  //       );
  //       if (row) {
  //         const transitionValues: string[] = props.transitionValue.split("");
  //         console.log(
  //           "transitionValues",
  //           transitionValues,
  //           transitionValues.every((r: string) =>
  //             PossibleTransitionValues.includes(r)
  //           )
  //         );

  //         if (
  //           transitionValues.every((r: string) =>
  //             PossibleTransitionValues.includes(r)
  //           )
  //         ) {
  //           // //clear all transition values of source row
  //           // PossibleTransitionValues.forEach(
  //           //   (val) => (row[val === "^" ? "nul" : val] = "")
  //           // );

  //           // if there already exists a transition value
  //           if (oldTransitionValues.length > 0)
  //             oldTransitionValues.filter(
  //               (val) => val !== props.transitionValue
  //             );
  //           // if transitionValue is empty, then clear old transition value
  //           if (props.transitionValue === "") {
  //             row[localOldTransVal === "^" ? "nul" : localOldTransVal] = "";
  //           }
  //           // else, fill provided transition value(s) of source row
  //           else
  //             transitionValues.forEach(
  //               (val: string) => (row[val === "^" ? "nul" : val] = targetState)
  //             );
  //           // let indexableTransitionValue = props.transitionValue;
  //           // if (props.transitionValue === "^") indexableTransitionValue = "nul";

  //           // clear all overwritten transition values of source row
  //           // row.a = "";
  //           // row.b = "";
  //           // row.nul = "";

  //           // row[indexableTransitionValue] = targetState;
  //         }
  //       }
  //       console.log("row", row);
  //       return rows;
  //     } else return rows;
  //   });
  // }, [props.transitionValue]);

  const updateXarrow = useXarrow();
  const handleClick = (e: any) => {
    console.log("Box handleClick", props);
    e.stopPropagation(); //so only the click event on the box will fire on not on the container itself

    if (props.actionState === "Normal") {
      console.log("Box handleClick Normal", props);
      props.handleSelect(e);
    } else if (
      props.actionState === "Add Transition" &&
      props.selected.id !== props.box.id
    ) {
      console.log("Box handleClick Add Transition", props);
      props.setLines((lines: TransitionModel[]) => [
        ...lines,
        {
          props: {
            labels: "",
            start: props.selected.id,
            end: props.box.id,
            value: props.transitionValue,
            // dashness: { animation: 10 },
            animateDrawing: true,
          },
          menuWindowOpened: false,
        },
      ]);

      props.setGridData((rows: RowModel[]) => {
        const row = rows.find(
          (row) => props.selected && row.node === props.selected.id
        );
        console.log("row", row);

        console.log(
          "props.transitionValue",
          props.transitionValue,
          "row[props.transitionValue]",
          row![props.transitionValue],
          "sourceState",
          sourceState,
          "targetState",
          targetState
        );
        if (row && props.transitionValue !== "" && sourceState !== "") {
          let indexableTransitionValue = props.transitionValue;
          if (props.transitionValue === "^") indexableTransitionValue = "nul";
          row[indexableTransitionValue] = props.box.id;
        }

        console.log("row", row);
        return rows;
      });
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
      //TODO: remove transition values from grid
    }
  };

  console.log("changing background color now", props.actionState);
  let background = null;
  if (props.selected && props.selected.id === props.box.id) {
    // background = "lightblue";
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
