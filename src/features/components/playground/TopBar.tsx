import "./css/TopBar.css";
import { TopBarProps } from "./props/TopBarProps";
import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../models";
import { SelectedElementTypeId } from "../../props/SelectedElementType";
import { promptNewStateName } from "../../../utils/PromptNewStateName";
import { promptNewTransitionValue } from "../../../utils/PromptNewTransitionValue";
import { TopBarActions } from "../../../consts/TopBarActions";
import { TransitionValuesSeparator } from "../../../consts/TransitionValuesSeparator";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import { StyledTransitionLabel } from "./StyledTransitionLabel";
// import MaterialIcon from "material-icons-react";

export const TopBar = (props: TopBarProps) => {
  console.log("re rendering TopBar: props", props);

  const handleEditAction = (e, action: any) => {
    console.log("handleEditAction", action, props);
    switch (action) {
      // state actions
      case "Edit Name":
        const newName = promptNewStateName(props.boxes, "");

        props.setGridData((rows) =>
          rows.map((row) =>
            props.selected && row.node === props.selected.id
              ? { ...row, node: newName }
              : row
          )
        );

        props.setLines((lines: TransitionModel[]) =>
          lines.map((line) => {
            if (props.selected && line.props.start === props.selected.id)
              return { ...line, props: { ...line.props, start: newName } };
            if (props.selected && line.props.end === props.selected.id)
              return { ...line, props: { ...line.props, end: newName } };
            return line;
          })
        );

        props.setBoxes((boxes: DraggableStateModel[]) =>
          boxes.map((box) =>
            props.selected && box.id === props.selected.id
              ? { ...box, id: newName }
              : box
          )
        );

        props.handleSelect(null);
        break;

      case "Add Transition":
        console.log("TopBar Add Transition", props);
        props.setActionState(action);
        break;

      case "Remove Transitions":
        console.log("remove transitions triggered", props);
        if (
          props.selected &&
          window.confirm(
            `Are you sure you want to remove all transitions of ${props.selected.id}?`
          )
        ) {
          props.setLines((lines: TransitionModel[]) =>
            lines.filter(
              (line: TransitionModel) =>
                !(
                  props.selected &&
                  (line.props.start === props.selected.id ||
                    line.props.end === props.selected.id)
                )
            )
          );

          props.setGridData((rows) =>
            rows.map((row) =>
              props.selected && row.node === props.selected.id
                ? // if row found, remove all its transition values
                  {
                    ...row,
                    ...Object.fromEntries(
                      PossibleTransitionValues.map((key) => [
                        key === "^" ? "nul" : key,
                        "",
                      ])
                    ),
                  }
                : // else, check if any of its transition values are pointing to other states and remove them
                  {
                    ...row,
                    ...Object.fromEntries(
                      PossibleTransitionValues.map((key) => [
                        key === "^" ? "nul" : key,
                        Array.from(
                          // convert to array to use filter
                          new Set( // remove duplicates
                            row[key === "^" ? "nul" : key].toString().split(" ") // split values on space
                          )
                        )
                          .filter((val) => val !== "") // remove empty values
                          .includes(props.selected.id as string) // check if transition value is included in the selected state's transition values
                          ? row[key === "^" ? "nul" : key] // if yes, remove it
                              .toString()
                              .replace(props.selected.id as string, "")
                          : row[key === "^" ? "nul" : key], // if no, keep original value
                      ])
                    ),
                  }
            )
          );
        }

        props.handleSelect(null);
        break;

      case "Delete":
        if (
          props.selected &&
          window.confirm(
            `are you sure you want to delete ${props.selected.id}?`
          )
        ) {
          // first remove any transitions connected to the state.
          props.setLines((lines: TransitionModel[]) =>
            lines.filter(
              (line) =>
                !(
                  props.selected &&
                  (line.props.start === props.selected.id ||
                    line.props.end === props.selected.id)
                )
            )
          );

          // then remove that state.
          if (
            props.selected &&
            props.boxes
              .map((box) => box.id)
              .includes(props.selected.id as string)
          ) {
            props.setBoxes((boxes: DraggableStateModel[]) =>
              boxes.filter(
                (box) => props.selected && !(box.id === props.selected.id)
              )
            );
          }

          // then remove that state from the transition table.
          if (props.selected) {
            console.log("selected id", props.selected.id);
            props.handleDeleteRow(props.selected.id.toString());
          }
          props.handleSelect(null);
        }
        break;

      case "Toggle Initial State":
        const initialStateRow = props.gridData.find(
          (row) => props.selected && row.node === (props.selected.id as string)
        );
        if (initialStateRow) {
          props.toggleInitialState(initialStateRow);
        }

        props.handleSelect(null);
        break;

      case "Toggle Final State":
        const finalStateRow = props.gridData.find(
          (row) => props.selected && row.node === (props.selected.id as string)
        );
        if (finalStateRow) {
          props.toggleFinalState(finalStateRow);
        }

        props.handleSelect(null);
        break;

      // transition actions
      case "Remove Transition":
        console.log("remove transition triggered", props);
        props.setLines((lines: TransitionModel[]) => {
          return lines.filter(
            (line) =>
              !(
                props.selected &&
                line.props.start ===
                  (props.selected.id as SelectedElementTypeId).start &&
                line.props.end ===
                  (props.selected.id as SelectedElementTypeId).end
              )
          );
        });
        console.log(
          "lines after",
          props.lines.filter(
            (line) =>
              !(
                props.selected &&
                line.props.start ===
                  (props.selected.id as SelectedElementTypeId).start &&
                line.props.end ===
                  (props.selected.id as SelectedElementTypeId).end
              )
          )
        );

        props.setGridData((rows) =>
          rows.map((row) =>
            props.selected &&
            row.node === (props.selected.id as SelectedElementTypeId).start
              ? // if row found, remove selected transition value
                {
                  ...row,
                  ...Object.fromEntries(
                    PossibleTransitionValues.map((key) => [
                      key === "^" ? "nul" : key,
                      row[key === "^" ? "nul" : key]
                        .toString()
                        .replace(
                          (props.selected.id as SelectedElementTypeId).end,
                          ""
                        ),
                    ])
                  ),
                }
              : row
          )
        );

        props.handleSelect(null);
        break;

      case "Edit Properties":
        props.setLines((lines: TransitionModel[]) =>
          lines.map((line) =>
            props.selected &&
            line.props.start === props.selected.id &&
            line.props.end === props.selected.id
              ? {
                  ...line,
                  menuWindowOpened: true,
                }
              : line
          )
        );
        break;

      case "Edit Value":
        const newValue = promptNewTransitionValue(
          props.lines,
          (props.selected.id as SelectedElementTypeId).value
        ); //send original value
        console.log("new value", newValue);

        props.setLines((lines: TransitionModel[]) =>
          lines.map((line) =>
            props.selected &&
            line.props.start ===
              (props.selected.id as SelectedElementTypeId).start &&
            line.props.end === (props.selected.id as SelectedElementTypeId).end
              ? {
                  ...line,
                  props: {
                    ...line.props,
                    labels:
                      newValue === "" ? (
                        ""
                      ) : (
                        <StyledTransitionLabel label={newValue} />
                      ),
                  },
                }
              : line
          )
        );
        console.log(
          "lines after Edit Value",
          props.lines.map((line) =>
            props.selected &&
            props.selected.id &&
            line.props.start ===
              (props.selected.id as SelectedElementTypeId).start &&
            line.props.end === (props.selected.id as SelectedElementTypeId).end
              ? {
                  ...line,
                  props: {
                    ...line.props,
                    labels: newValue,
                  },
                }
              : line
          )
        );

        const transitionValues: string[] = newValue.split(
          TransitionValuesSeparator
        );
        console.log("transitionValues", transitionValues);

        // console.log("setGridData edit value")
        props.setGridData((rows) => {
          console.log("starting setGridData");
          let newRows = [...rows];
          newRows.map((row) => {
            if (
              props.selected &&
              row.node === (props.selected.id as SelectedElementTypeId).start
            ) {
              //if same target state's values are already in the row, remove them.
              PossibleTransitionValues.forEach((val) => {
                console.log(
                  `original val '${row[val === "^" ? "nul" : val].toString()}'`,
                  `target value to check '${
                    (props.selected.id as SelectedElementTypeId).end
                  }'`
                );
                if (
                  row[val === "^" ? "nul" : val]
                    .toString()
                    .includes((props.selected.id as SelectedElementTypeId).end)
                ) {
                  console.log("removing ", row[val === "^" ? "nul" : val]);
                  row[val === "^" ? "nul" : val] = row[
                    val === "^" ? "nul" : val
                  ]
                    .toString()
                    .replace(
                      (props.selected.id as SelectedElementTypeId).end,
                      ""
                    );
                }
              });

              //if there are new transition values to add, add them.
              if (transitionValues.length > 0) {
                transitionValues.forEach((val: string) => {
                  const updatedValue = row[val === "^" ? "nul" : val]
                    .toString()
                    //add space if there is already a value in the cell
                    .concat(
                      row[val === "^" ? "nul" : val].toString() === ""
                        ? ""
                        : " "
                    )
                    //append new value
                    .concat((props.selected.id as SelectedElementTypeId).end);
                  console.log(
                    "val",
                    val,
                    "prev value",
                    row[val === "^" ? "nul" : val],
                    "paste",
                    updatedValue
                  );
                  row[val === "^" ? "nul" : val] = updatedValue;
                });

                PossibleTransitionValues.forEach((val) => {
                  row[val === "^" ? "nul" : val] = Array.from(
                    new Set(
                      row[val === "^" ? "nul" : val].toString().split(" ")
                    )
                  ).join(" ");
                });
              }

              console.log("row after", row);
            }
            return row;
          });

          console.log("ending setGridData");
          return newRows;
        });

        props.setSelected({
          id: {
            start: (props.selected.id as SelectedElementTypeId).start,
            end: (props.selected.id as SelectedElementTypeId).end,
            value: newValue,
          } as SelectedElementTypeId,
          type: "arrow",
        });

        break;
      default:
    }
  };

  var returnTopBarApearnce = () => {
    let allowedActions: any[] = [];
    if (props.selected)
      allowedActions =
        TopBarActions[props.selected.type as keyof typeof TopBarActions];
    console.log("allowedActions", allowedActions);
    console.log("returnTopBarApearnce", props);
    switch (props.actionState) {
      case "Normal":
        return (
          <div className="actionBubbles">
            {allowedActions.map((action: any, i: number) => (
              <div
                className="actionBubble"
                key={i}
                onClick={(e) => handleEditAction(e, action)}
              >
                {action}
              </div>
            ))}
          </div>
        );
      case "Add Transition":
        return (
          <div className="actionBubbles">
            <p>To where connect new transition?</p>
            <div
              className="actionBubble"
              onClick={() => props.setActionState("Normal")}
            >
              finish
            </div>
          </div>
        );
      default:
    }
  };

  return (
    <div
      className="topBarStyle"
      style={{ height: props.selected === null ? "0" : "60px" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="topBarLabel" onClick={() => props.handleSelect(null)}>
        {/*<MaterialIcon*/}
        {/*  size={30}*/}
        {/*  icon="keyboard_arrow_up"*/}
        {/*  className="material-icons topBarToggleIcon"*/}
        {/*/>*/}
        {/* <p>Edit Menu</p> */}
      </div>
      {returnTopBarApearnce()}
    </div>
  );
};

export default TopBar;
