import React, { useEffect, useState } from "react";
import "./css/Box.css";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import { RowModel, TransitionModel } from "../../../models";
import { createIf } from "typescript";

const possibleTransitionValues = ["a", "b", "^"];
let localOldTransVal = "";
let oldTransitionValues: string[] = [];
// let testval = "b";

export const Box = (props: any) => {
  const [sourceState, setSourceState] = useState("");
  const [targetState, setTargetState] = useState("");

  useEffect(() => {
    console.log("useEffect", props, props.transitionValue);
    // props.setLines &&
    //   props.setLines((lines: TransitionModel[]) => {
    //     (lines as TransitionModel[])?.map((line) => {
    //       if (
    //         props.selected &&
    //         line.props.start === props.selected.id &&
    //         line.props.end === props.box.id
    //       ) {
    //         line.props.value = props.transitionValue;
    //       }
    //       return line;
    //     });
    //   });
    // console.log(
    //   "setLines again",
    //   (props.lines as TransitionModel[])?.map((line) => {
    //     if (
    //       props.selected &&
    //       line.props.start === props.selected.id &&
    //       line.props.end === props.box.id
    //     ) {
    //       line.props.value = props.transitionValue;
    //     }
    //     return line;
    //   })
    // );
    props.setGridData((rows: RowModel[]) => {
      if (sourceState !== "" && targetState !== "") {
        const row = rows.find((row) => row.node === sourceState); //source row
        console.log("useEffect setGridData found source row", row);

        console.log(
          "props.transitionValue",
          props.transitionValue,
          "row[props.transitionValue]",
          row![props.transitionValue],
          "sourceState",
          sourceState,
          "targetState",
          targetState,
          "props.oldTransitionValue",
          props.oldTransitionValue,
          "localOldTransVal",
          localOldTransVal
        );
        if (row) {
          const transitionValues: string[] = props.transitionValue.split("");
          console.log(
            "transitionValues",
            transitionValues,
            transitionValues.every((r: string) =>
              possibleTransitionValues.includes(r)
            )
          );

          if (
            transitionValues.every((r: string) =>
              possibleTransitionValues.includes(r)
            )
          ) {
            // //clear all transition values of source row
            // possibleTransitionValues.forEach(
            //   (val) => (row[val === "^" ? "nul" : val] = "")
            // );

            // if there already exists a transition value
            if (oldTransitionValues.length > 0)
              oldTransitionValues.filter(
                (val) => val !== props.transitionValue
              );
            // if transitionValue is empty, then clear old transition value
            if (props.transitionValue === "") {
              row[localOldTransVal === "^" ? "nul" : localOldTransVal] = "";
            }
            // else, fill provided transition value(s) of source row
            else
              transitionValues.forEach(
                (val: string) => (row[val === "^" ? "nul" : val] = targetState)
              );
            // let indexableTransitionValue = props.transitionValue;
            // if (props.transitionValue === "^") indexableTransitionValue = "nul";

            // clear all overwritten transition values of source row
            // row.a = "";
            // row.b = "";
            // row.nul = "";

            // row[indexableTransitionValue] = targetState;
          }
        }
        console.log("row", row);
        return rows;
      } else return rows;
    });
  }, [props.transitionValue]);

  const updateXarrow = useXarrow();
  const handleClick = (e: any) => {
    console.log("Box handleClick", props);
    e.stopPropagation(); //so only the click event on the box will fire on not on the container itself

    if (props.actionState === "Normal") {
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
            labels: (
              <div
                contentEditable
                suppressContentEditableWarning={true}
                onInput={(e) => {
                  // alert("testval");
                  // testval = "^";
                  // e.stopPropagation();
                  console.log("onInput", e.currentTarget.textContent);
                  if (
                    e.currentTarget.textContent
                      .split("")
                      .every((r: string) =>
                        possibleTransitionValues.includes(r)
                      )
                  ) {
                    console.log(
                      "onInput save",
                      e.currentTarget.textContent,
                      props
                    );
                    console.log(
                      "setting source: ",
                      props.selected.id,
                      "target: ",
                      props.box.id
                    );
                    setTargetState(props.box.id);
                    setSourceState(props.selected.id);

                    var sourceRow = (props.gridData as RowModel[]).find(
                      (row) => row.node === props.selected.id
                    );
                    console.log("sourceRow", sourceRow);

                    //find which transition values are already filled and save them in oldTransitionValues array
                    possibleTransitionValues.forEach((val) => {
                      if (sourceRow[val === "^" ? "nul" : val] === props.box.id)
                        oldTransitionValues.push(val);
                    });
                    console.log("oldTransitionValues", oldTransitionValues);

                    //filter out new transition value from oldTransitionValues array
                    var transitionValuesToReset = oldTransitionValues.filter(
                      (val) => val !== props.transitionValue
                    );
                    console.log(
                      "transitionValuesToReset",
                      transitionValuesToReset
                    );

                    //reset transition values that are not the new transition value
                    transitionValuesToReset.forEach((val) => {
                      sourceRow[val === "^" ? "nul" : val] = "";
                    });
                    //reset for next transitionValue trigger
                    oldTransitionValues = [];

                    props.setOldTransitionValue(props.transitionValue);
                    localOldTransVal = props.transitionValue;
                    props.setTransitionValue(e.currentTarget.textContent);
                  } else {
                    prompt(
                      `Please enter a valid transition value ${possibleTransitionValues.join(
                        ", "
                      )}`
                    );
                  }
                  e.preventDefault();
                  // props.setTransitionValue(
                  //   (val) => e.currentTarget.textContent ?? val
                  // );
                }}
                style={{
                  fontSize: "1.5em",
                  padding: "0.4em 0.4em 0",
                  color: "purple",
                  marginBottom: "1em",
                  borderRadius: "1.5em",
                }}
              >
                {props.transitionValue}
              </div>
            ),
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
