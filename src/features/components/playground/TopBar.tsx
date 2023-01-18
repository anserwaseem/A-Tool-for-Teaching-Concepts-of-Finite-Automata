import "./css/TopBar.css";
import { TopBarProps } from "./props/TopBarProps";
import { RowModel } from "../../../models";
import {
  SelectedElementType,
  SelectedElementTypeId,
} from "../../props/SelectedElementType";
import { TopBarActions } from "../../../consts/TopBarActions";
import { TransitionValuesSeparator } from "../../../consts/TransitionValuesSeparator";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import { StyledTransitionLabel } from "./StyledTransitionLabel";
import { DataContext } from "../../../pages/Editor";
import { useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { StateNameMaxLength } from "../../../consts/StateNameMaxLength";

export const TopBar = (props: TopBarProps) => {
  console.log("re rendering TopBar: props", props);

  const dataContext = useContext(DataContext);

  const [isTopbarDialogOpen, setIsTopbarDialogOpen] = useState(false);
  const [topbarDialogValue, setTopbarDialogValue] = useState("");
  const [topbarDialogError, setTopbarDialogError] = useState("");
  // 0 means operate Edit State Name dialog
  // 1 means operate Edit label (Transition Value) dialog
  // 2 means operate Remove Transitions dialog
  // 3 means operate Delete State dialog
  const [dialogType, setDialogType] = useState(0);
  // to keep note that which state was originally selected when dialog was opened
  const [stateSelected, setStateSelected] =
    useState<SelectedElementType | null>(null);

  const handleEditAction = (action: string) => {
    switch (action) {
      case "Edit Name":
        setTopbarDialogValue(props.selected?.id as string);
        setDialogType(0);
        setIsTopbarDialogOpen(true);
        break;

      case "Add Transition":
        props.setActionState(action);
        break;

      case "Remove Transitions":
        if (props.selected) {
          setDialogType(2);
          setIsTopbarDialogOpen(true);
        }
        break;

      case "Delete":
        if (props.selected) {
          setDialogType(3);
          setIsTopbarDialogOpen(true);
        }
        break;

      case "Toggle Initial State":
        const initialStateRow = [...dataContext?.rows].find(
          (row) =>
            props.selected && row.state === (props.selected?.id as string)
        );
        if (initialStateRow) {
          props.toggleInitialState(initialStateRow);
        }

        props.handleSelect(null);
        break;

      case "Toggle Final State":
        const finalStateRow = dataContext?.rows.find(
          (row) =>
            props.selected && row.state === (props.selected?.id as string)
        );
        if (finalStateRow) {
          props.toggleFinalState(finalStateRow);
        }

        props.handleSelect(null);
        break;

      // transition actions
      case "Remove Transition":
        dataContext?.setTransitions((transitions) => {
          return transitions.filter(
            (transition) =>
              !(
                props.selected &&
                transition.start ===
                  (props.selected?.id as SelectedElementTypeId).start &&
                transition.end ===
                  (props.selected?.id as SelectedElementTypeId).end
              )
          );
        });

        dataContext?.setRows((rows) =>
          rows.map((row) =>
            props.selected &&
            row.state === (props.selected?.id as SelectedElementTypeId).start
              ? // if row found, remove selected transition value
                {
                  ...row,
                  ...Object.fromEntries(
                    PossibleTransitionValues.map((key) => [
                      key === "^" ? "nul" : key,
                      row[key === "^" ? "nul" : key]
                        .toString()
                        .replace(
                          (props.selected?.id as SelectedElementTypeId).end,
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

      case "Edit label":
        setTopbarDialogValue(
          (props.selected?.id as SelectedElementTypeId).value
        );
        setDialogType(1);
        setIsTopbarDialogOpen(true);
        break;
      default:
    }
  };

  const handleEditStateName = () => {
    if (!topbarDialogValue)
      setTopbarDialogError("Name cannot be empty, choose another one.");
    else if (
      topbarDialogValue &&
      [...dataContext.states].map((s) => s.id).includes(topbarDialogValue)
    )
      setTopbarDialogError("Name already taken, choose another one.");
    else if (topbarDialogValue.length > StateNameMaxLength)
      setTopbarDialogError(
        `State name cannot be more than ${StateNameMaxLength} characters.`
      );
    else if (PossibleTransitionValues.includes(topbarDialogValue))
      setTopbarDialogError(
        `State name cannot be one of the following: ${PossibleTransitionValues.join(
          ", "
        )}`
      );
    else {
      setTopbarDialogError("");
      setIsTopbarDialogOpen(false);
      setTopbarDialogValue("");

      const selected = props.selected ?? stateSelected;

      dataContext?.setRows((rows) =>
        rows.map((row) =>
          selected
            ? {
                ...row,
                state:
                  row.state === selected?.id ? topbarDialogValue : row.state,
                ...Object.fromEntries(
                  PossibleTransitionValues.map((key) => [
                    key === "^" ? "nul" : key,
                    row[key === "^" ? "nul" : key]
                      .toString()
                      .includes(selected?.id as string)
                      ? row[key === "^" ? "nul" : key]
                          .toString()
                          .replace(selected?.id as string, topbarDialogValue)
                      : row[key === "^" ? "nul" : key],
                  ])
                ),
              }
            : row
        )
      );

      dataContext?.setTransitions((transitions) =>
        transitions.map((transition) => {
          if (
            selected &&
            transition.start === selected?.id &&
            transition.end === selected?.id
          )
            return {
              ...transition,
              start: topbarDialogValue,
              end: topbarDialogValue,
            };
          else if (selected && transition.start === selected?.id)
            return {
              ...transition,
              start: topbarDialogValue,
            };
          else if (selected && transition.end === selected?.id)
            return {
              ...transition,
              end: topbarDialogValue,
            };
          return transition;
        })
      );

      dataContext?.setStates((states) =>
        states.map((state) =>
          selected && state.id === selected?.id
            ? { ...state, id: topbarDialogValue }
            : state
        )
      );

      props.handleSelect(null);
    }
    setStateSelected(props.selected);
  };

  const handleEditTransitionLabel = () => {
    if (
      !topbarDialogValue
        .split(TransitionValuesSeparator)
        .every((r: string) => PossibleTransitionValues.includes(r))
    )
      setTopbarDialogError(
        `Please enter a valid transition label ${PossibleTransitionValues.join(
          ", "
        )}`
      );
    else if (topbarDialogValue.length > PossibleTransitionValues.length)
      setTopbarDialogError(
        `Label cannot be longer than ${PossibleTransitionValues.length} characters.`
      );
    else {
      setTopbarDialogError("");
      setIsTopbarDialogOpen(false);
      setTopbarDialogValue("");

      const selected = props.selected ?? stateSelected;

      dataContext?.setTransitions((transitions) =>
        transitions.map((transition) =>
          selected &&
          transition.start === (selected?.id as SelectedElementTypeId).start &&
          transition.end === (selected?.id as SelectedElementTypeId).end
            ? {
                ...transition,
                labels:
                  topbarDialogValue === "" ? (
                    ""
                  ) : (
                    <StyledTransitionLabel label={topbarDialogValue} />
                  ),
                value: topbarDialogValue,
              }
            : transition
        )
      );

      const transitionValues: string[] = topbarDialogValue.split(
        TransitionValuesSeparator
      );

      dataContext?.setRows((rows) => {
        let newRows = [...rows];

        newRows.map((row) => {
          if (
            selected &&
            row.state === (selected?.id as SelectedElementTypeId).start
          ) {
            //if same target state's values are already in the row, remove them.
            PossibleTransitionValues.forEach((val) => {
              if (
                row[val === "^" ? "nul" : val]
                  .toString()
                  .includes((selected?.id as SelectedElementTypeId).end)
              )
                row[val === "^" ? "nul" : val] = row[val === "^" ? "nul" : val]
                  .toString()
                  .replace((selected?.id as SelectedElementTypeId).end, "");
            });

            //if there are new transition values to add, add them.
            if (transitionValues.length > 0) {
              transitionValues.forEach((val: string) => {
                const updatedValue = row[val === "^" ? "nul" : val]
                  .toString()
                  //add space if there is already a value in the cell
                  .concat(
                    row[val === "^" ? "nul" : val].toString() === "" ? "" : " "
                  )
                  //append new value
                  .concat((selected?.id as SelectedElementTypeId).end);

                row[val === "^" ? "nul" : val] = updatedValue;
              });

              PossibleTransitionValues.forEach((val) => {
                row[val === "^" ? "nul" : val] = Array.from(
                  new Set(row[val === "^" ? "nul" : val].toString().split(" "))
                ).join(" ");
              });
            }
          }
          return row;
        });

        return newRows;
      });

      props.setSelected({
        id: {
          start: (selected?.id as SelectedElementTypeId).start,
          end: (selected?.id as SelectedElementTypeId).end,
          value: topbarDialogValue,
        } as SelectedElementTypeId,
        type: "transition",
      });
    }
    setStateSelected(props.selected);
  };

  const handleRemoveTransitions = () => {
    setIsTopbarDialogOpen(false);
    dataContext?.setTransitions((transitions) =>
      transitions.filter(
        (transition) =>
          !(
            props.selected &&
            (transition.start === props.selected?.id ||
              transition.end === props.selected?.id)
          )
      )
    );

    dataContext?.setRows((rows) =>
      rows.map((row) =>
        props.selected && row.state === props.selected?.id
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
                    .includes(props.selected?.id as string) // check if transition value is included in the selected state's transition values
                    ? row[key === "^" ? "nul" : key] // if yes, remove it
                        .toString()
                        .replace(props.selected?.id as string, "")
                    : row[key === "^" ? "nul" : key], // if no, keep original value
                ])
              ),
            }
      )
    );

    props.handleSelect(null);
  };

  const handleDeleteState = () => {
    setIsTopbarDialogOpen(false);

    dataContext?.setTransitions((transitions) =>
      transitions.filter(
        (transition) =>
          !(
            props.selected &&
            (transition.start === props.selected?.id ||
              transition.end === props.selected?.id)
          )
      )
    );

    // then remove that state.
    if (
      props.selected &&
      dataContext?.states
        .map((state) => state.id)
        .includes(props.selected?.id as string)
    ) {
      dataContext?.setStates((states) =>
        states.filter(
          (state) => props.selected && !(state.id === props.selected?.id)
        )
      );
    }

    // then remove that state from the transition table.
    if (props.selected) {
      props.handleDeleteRow(
        dataContext?.rows.find(
          (row) => row.state === (props.selected?.id as string)
        ) as RowModel
      );
    }

    props.handleSelect(null);
  };

  var returnTopBarAppearance = () => {
    let allowedActions: string[] = [];

    if (props.selected)
      allowedActions =
        TopBarActions[props.selected.type as keyof typeof TopBarActions];

    switch (props.actionState) {
      case "Normal":
        return (
          <div className="actionBubbles">
            {allowedActions.map((action, i) => (
              <div
                className="actionBubble"
                key={i}
                onClick={() => handleEditAction(action)}
              >
                {action}
              </div>
            ))}
          </div>
        );
      case "Add Transition":
        return (
          <div className="actionBubbles">
            <p>Select destination state</p>
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
    <>
      <Dialog
        id="topbarDialog"
        open={isTopbarDialogOpen}
        onClose={() => setIsTopbarDialogOpen(false)}
      >
        <DialogTitle id="topbarDialogTitle">
          {dialogType === 0
            ? "Enter New State Name"
            : dialogType === 1
            ? "Enter new Transition label(s)"
            : dialogType === 2
            ? `Are you sure you want to remove all transitions of state ${props.selected?.id}?`
            : `Are you sure you want to delete state ${props.selected?.id}?`}
        </DialogTitle>
        {(dialogType === 0 || dialogType === 1) && (
          <DialogContent id="topbarDialogContent">
            <DialogContentText id="topbarDialogContentText">
              {topbarDialogError}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="topbarDialogValue"
              label={dialogType === 1 ? "Transition Label" : "State Name"}
              type="text"
              fullWidth
              variant="standard"
              autoComplete="off"
              value={topbarDialogValue}
              onChange={(e) =>
                setTopbarDialogValue(
                  dialogType === 1
                    ? Array.from(
                        new Set(e.target.value.split(TransitionValuesSeparator))
                      ).join("")
                    : e.target.value
                )
              }
            />
          </DialogContent>
        )}
        <DialogActions id="topbarDialogActions">
          <Button onClick={() => setIsTopbarDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              dialogType === 0
                ? handleEditStateName()
                : dialogType === 1
                ? handleEditTransitionLabel()
                : dialogType === 2
                ? handleRemoveTransitions()
                : handleDeleteState();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        className="topBarStyle"
        style={{ height: props.selected === null ? "0" : "60px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="topBarLabel"
          onClick={() => props.handleSelect(null)}
        ></div>
        {returnTopBarAppearance()}
      </Box>
    </>
  );
};

export default TopBar;
