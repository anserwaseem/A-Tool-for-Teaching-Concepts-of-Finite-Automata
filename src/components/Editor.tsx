import { createContext, useRef, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  Grid,
  Slider,
  Snackbar,
} from "@mui/material";
import { GridColumns, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import SecurityIcon from "@mui/icons-material/Security";
import { RowModel, DraggableStateModel, TransitionModel } from "../models";
import Playground from "../features/Playground";
import { PlaygroundProps } from "../features/props/PlaygroundProps";
import { SelectedElementType } from "../features/props/SelectedElementType";
import { TransitionTableProps } from "../features/props/TransitionTableProps";
import TransitionTable from "../features/TransitionTable";
import { promptNewStateName } from "../utils/PromptNewStateName";
import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";
import { StateNameMaxLength } from "../consts/StateNameMaxLength";
import { PlaygroundSize } from "./types/PlaygroundSize";
import { StyledTransitionLabel } from "../features/components/playground/StyledTransitionLabel";
import { MaxNumberOfStates } from "../consts/MaxNumberOfStates";
import { AutomataData } from "./types/AutomataData";
import { Tools } from "./Tools";
import { ToolsProps } from "./props/ToolsProps";
import { NfaToDfa } from "../features/NfaToDfa";
import * as AvailableTools from "./types/AvailableTools";
import { MinimizeDfa } from "../features/MinimizeDfa";
import TestAString from "../features/TestAString";
import { TestAStringProps } from "../features/props/TestAStringProps";
import { IsDFA } from "../utils/IsDFA";
import { IsNFA } from "../utils/IsNFA";
import { transitionSelectedColor } from "../consts/Colors";
import {
  StateDefaultSize,
  StateMaxSize,
  StateMinSize,
} from "../consts/StateSizes";

export const DataContext = createContext<AutomataData>({} as AutomataData);

export const Editor = () => {
  console.log("re rendering Editor");

  const [rowId, setRowId] = useState(0);
  const [rows, setRows] = useState<RowModel[]>([]);
  const columns: GridColumns = [
    { field: "id", hide: true, hideable: false },
    {
      field: "state",
      headerName: "State",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
      width: 55,
    },
    {
      field: "a",
      headerName: "a",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "b",
      headerName: "b",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "nul",
      headerName: "null",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      sortable: false,
      width: 60,
      type: "actions",
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<SaveSharpIcon />}
            label="Save"
            onClick={() => {
              handleSaveRow(params.row);
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteRow(params.row)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<SecurityIcon />}
            label="Toggle initial State"
            onClick={() => toggleInitialState(params.row)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<SecurityIcon />}
            label="Toggle Final State"
            onClick={() => toggleFinalState(params.row)}
            showInMenu
          />,
        ];
      },
    },
  ];
  const [states, setStates] = useState<DraggableStateModel[]>([]);
  const [transitions, setTransitions] = useState<TransitionModel[]>([]);

  const [selected, setSelected] = useState<SelectedElementType | null>(null);
  const [actionState, setActionState] = useState("Normal");
  const [playgroundSize, setPlaygroundSize] = useState<PlaygroundSize>({
    width: 0,
    height: 0,
  });
  const [stateSize, setStateSize] = useState(StateDefaultSize);

  const [toolSelected, setToolSelected] = useState<
    | typeof AvailableTools.IS_DFA
    | typeof AvailableTools.IS_NFA
    | typeof AvailableTools.NFA_TO_DFA
    | typeof AvailableTools.MINIMIZE_DFA
    | typeof AvailableTools.TEST_A_STRING
    | typeof AvailableTools.HIGHLIGHT_NULL_TRANSITIONS
    | null
  >(null);
  const [isTestAStringDialogOpen, setIsTestAStringDialogOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const handleAddRow = (row: RowModel) => {
    if (states.length >= MaxNumberOfStates) {
      setAlertMessage(`Maximum ${MaxNumberOfStates} states allowed.`);
      return;
    }

    setRows((prev) => [...prev, row]);

    setRowId((prev) => prev + 1);

    const newState = new DraggableStateModel(
      row.state,
      Math.floor(Math.random() * playgroundSize.width),
      Math.floor(Math.random() * playgroundSize.height)
    );

    setStates((prev) => [...prev, newState]);
  };

  const handleDeleteRow = (row: RowModel) => {
    setRows((rows) =>
      rows
        .filter((r) => r.id !== row.id)
        .map((r) => {
          return {
            ...r,
            ...Object.fromEntries(
              PossibleTransitionValues.map((key) => [
                key === "^" ? "nul" : key,
                r[key === "^" ? "nul" : key].toString().includes(row.state)
                  ? r[key === "^" ? "nul" : key]
                      .toString()
                      .replace(row.state, "")
                  : r[key === "^" ? "nul" : key],
              ])
            ),
          };
        })
    );

    setTransitions((prev) =>
      prev.filter((t) => t.start !== row.state && t.end !== row.state)
    );

    setStates((prev) => prev.filter((s) => s.id !== row.state));
  };

  const isRowEmpty = (row: RowModel) => {
    return !row
      ? true
      : row.state === "" && row.a === "" && row.b === "" && row.nul === "";
  };

  const handleSaveRow = (row: RowModel) => {
    if (isRowEmpty(row)) {
      setAlertMessage("Cannot save empty row.");
      return;
    }

    if (PossibleTransitionValues.includes(row.state)) {
      setAlertMessage(
        `State name cannot be ${PossibleTransitionValues.join(", ")}`
      );
      return;
    }

    PossibleTransitionValues.forEach(
      (key) =>
        (row[key === "^" ? "nul" : key] = Array.from(
          new Set(
            row[key === "^" ? "nul" : key]
              .toString()
              .split(" ")
              .filter((s) => s !== "")
          )
        ).join(" "))
    );

    const oldRow = rows.find((r) => r.id === row.id);
    if (!oldRow) {
      setAlertMessage("Cannot save row.");
      return;
    }

    if (row.state.length > StateNameMaxLength) {
      setAlertMessage(
        `State name cannot be more than ${StateNameMaxLength} characters.`
      );

      // reset this row to old row
      setRows((prev) => prev.map((r) => (r.id === row.id ? oldRow : r)));

      return;
    }

    // if state name is changed AND transition values are added/updated/removed, not allowed
    if (
      oldRow.state !== row.state &&
      PossibleTransitionValues.some(
        (key) =>
          row[key === "^" ? "nul" : key] !== oldRow[key === "^" ? "nul" : key]
      )
    ) {
      setAlertMessage(
        `Cannot change state name when transition values are added/updated/removed.`
      );

      // reset this row to old row
      setRows((prev) => prev.map((r) => (r.id === row.id ? oldRow : r)));

      return;
    }

    const nulPossibleTransitionValues = PossibleTransitionValues.map((v) =>
      v === "^" ? "nul" : v
    );
    let updatedRows: RowModel[] = [];
    let errorWhileSavingRow = false;
    setRows((prev) => {
      let availableStateValues = prev
        .map((r) => r.state)
        .filter((v) => v !== "");

      if (!availableStateValues.includes(row.state))
        availableStateValues.push(row.state);

      const areTransitionValuesInvalid = nulPossibleTransitionValues.some(
        (key) => {
          const transitionValues = row[key]
            .toString()
            .split(" ")
            .filter((v) => v !== "");
          return transitionValues.some(
            (v) => !availableStateValues.includes(v)
          );
        }
      );

      if (areTransitionValuesInvalid) {
        setAlertMessage(
          `Transition values must be empty or from the following: ${availableStateValues.join(
            ", "
          )}`
        );
        errorWhileSavingRow = true;
        return prev.map((r) => (r.id === row.id ? oldRow : r));
      }

      const stateAlreadyExists = prev.find(
        (r) =>
          r.state === row.state &&
          r.a === row.a &&
          r.b === row.b &&
          r.nul === row.nul
      );

      if (stateAlreadyExists) {
        setAlertMessage(
          "This state value already exists. Kindly choose another value."
        );
        errorWhileSavingRow = true;
        return prev.map((r) => (r.id === row.id ? oldRow : r));
      }

      updatedRows = prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              ...row,
              ...Object.fromEntries(
                PossibleTransitionValues.map((key) => [
                  key === "^" ? "nul" : key,
                  row[key === "^" ? "nul" : key]
                    .toString()
                    .includes(oldRow.state)
                    ? row[key === "^" ? "nul" : key]
                        .toString()
                        .replace(oldRow.state, row.state)
                    : row[key === "^" ? "nul" : key],
                ])
              ),
            }
          : {
              ...r,
              ...Object.fromEntries(
                PossibleTransitionValues.map((key) => [
                  key === "^" ? "nul" : key,
                  r[key === "^" ? "nul" : key].toString().includes(oldRow.state)
                    ? r[key === "^" ? "nul" : key]
                        .toString()
                        .replace(oldRow.state, row.state)
                    : r[key === "^" ? "nul" : key],
                ])
              ),
            }
      );

      return updatedRows;
    });

    // add states and transitions
    if (!errorWhileSavingRow) {
      setStates((prev) =>
        prev.map((s) => (s.id === oldRow.state ? { ...s, id: row.state } : s))
      );

      // if only state name is changed, update existing transitions' start and end values to new state name
      if (
        oldRow.state !== row.state &&
        PossibleTransitionValues.every(
          (key) =>
            row[key === "^" ? "nul" : key] === oldRow[key === "^" ? "nul" : key]
        )
      ) {
        let updatedtransitions = transitions.map((t) =>
          t.start === oldRow.state && t.end === oldRow.state
            ? {
                ...t,
                start: row.state,
                end: row.state,
              }
            : t.start === oldRow.state
            ? {
                ...t,
                start: row.state,
              }
            : t.end === oldRow.state
            ? {
                ...t,
                end: row.state,
              }
            : t
        );

        setTransitions(updatedtransitions);
      } else {
        // if new transitions are added, remove those transitions which are going from old state
        let updatedtransitions = transitions.filter(
          (t) => t.start !== oldRow.state
        );

        // for each possible transition value, add new transitions which are going from this state
        PossibleTransitionValues.forEach((key) => {
          const transitionValues = row[key === "^" ? "nul" : key]
            .toString()
            .split(" ")
            .filter((v) => v !== "");

          transitionValues.forEach((v) => {
            const isSelfTransition = v === row.state;

            // if transition is not already added, add new transition
            if (
              !updatedtransitions.find(
                (t) => t.start === row.state && t.end === v
              )
            )
              updatedtransitions.push(
                new TransitionModel({
                  start: row.state,
                  end: v,
                  labels: <StyledTransitionLabel label={key} />,
                  value: key,
                  strokeWidth: stateSize / 10,
                  animateDrawing: true,
                  _extendSVGcanvas: isSelfTransition ? 25 : 0,
                  _cpx1Offset: isSelfTransition ? -50 : 0,
                  _cpy1Offset: isSelfTransition ? -50 : 0,
                  _cpx2Offset: isSelfTransition ? 50 : 0,
                  _cpy2Offset: isSelfTransition ? -50 : 0,
                })
              );
            // else, update its labels & value
            else
              updatedtransitions = updatedtransitions.map((t) =>
                t.start === row.state && t.end === v
                  ? {
                      ...t,
                      labels: <StyledTransitionLabel label={t.value + key} />,
                      value: t.value + key,
                    }
                  : t
              );
          });
        });

        setTransitions(updatedtransitions);
      }
    }
  };

  const toggleInitialState = (row: RowModel) => {
    setRows((prev) => {
      if (!prev || isRowEmpty(row)) {
        setAlertMessage("Cannot make empty row initial state.");
        return prev;
      }

      if (
        isRowEmpty(
          prev.filter((r) => r.state === row.state && r.id === row.id)[0]
        )
      ) {
        setAlertMessage("Kindly save the row before making it initial state.");
        return prev;
      }

      if (prev.filter((r) => r.isInitial).length > 0 && !row.isInitial) {
        setAlertMessage("Only one initial state is allowed.");
        return prev;
      }

      return prev.map((r) => {
        if (r.state === row.state) {
          return { ...r, isInitial: !r.isInitial };
        }
        return r;
      });
    });
  };

  const toggleFinalState = (row: RowModel) => {
    setRows((prev) => {
      if (!prev || isRowEmpty(row)) {
        setAlertMessage("Cannot make empty row final state.");
        return prev;
      }

      if (
        isRowEmpty(
          prev.filter((r) => r.state === row.state && r.id === row.id)[0]
        )
      ) {
        setAlertMessage("Kindly save the row before making it final state.");
      }

      return prev.map((r) => {
        if (r.state === row.state) {
          return { ...r, isFinal: !r.isFinal };
        }
        return r;
      });
    });
  };

  const handleSelect = (e: any) => {
    if (e === null) {
      setSelected(null);
      setActionState("Normal");
    } else setSelected({ id: e.target.id, type: "state" });
  };

  const checkExsitence = (id: string) => {
    return [...states].map((s) => s.id).includes(id);
  };

  const handleDropDynamic = (e: any) => {
    if (states.length >= MaxNumberOfStates) {
      setAlertMessage(`Maximum ${MaxNumberOfStates} states allowed.`);
      return;
    }

    const rect = e.target.getBoundingClientRect();

    let stateX: number, stateY: number;
    // check if event has touch data (mobile) or mouse data (desktop)
    if (e.touches) {
      stateX = e.touches[0].clientX - rect.x;
      stateY = e.touches[0].clientY - rect.y;
    } else {
      stateX = e.clientX - rect.x;
      stateY = e.clientY - rect.y;
    }

    const stateName = promptNewStateName(states, `q${rowId}`);

    if (stateName) {
      const newState = new DraggableStateModel(stateName, stateX, stateY);
      setStates((prev) => [...prev, newState]);
    }

    setRows((prev) => [
      ...prev,
      new RowModel(rowId, stateName, "", "", "", false, false),
    ]);

    setRowId((prev) => prev + 1);
  };

  const handleHighlightNullTransitions = () => {
    setTransitions((transitions) =>
      transitions.map((t) => {
        if (t.value.includes("^")) {
          return {
            ...t,
            color: transitionSelectedColor,
            dashness: {
              animation: 1,
            },
          };
        }
        return t;
      })
    );

    setToolSelected(null);
  };

  const handleStateSizeChange = (
    event: Event,
    value: number,
    activeThumb: number
  ) => {
    setStateSize(value);

    setTransitions((transitions) =>
      transitions.map((t) => {
        return {
          ...t,
          strokeWidth: value / 10,
        };
      })
    );
  };

  const transitionTableProps: TransitionTableProps = {
    rows,
    columns,
  };

  const playgroundProps: PlaygroundProps = {
    selected,
    setSelected,
    actionState,
    setActionState,
    handleSelect,
    checkExsitence,
    handleDropDynamic,
    handleDeleteRow,
    toggleInitialState,
    toggleFinalState,
    setPlaygroundSize,
  };

  const toolsProps: ToolsProps = {
    setToolSelected,
    setIsTestAStringDialogOpen,
    setAlertMessage,
  };

  const testAStringProps: TestAStringProps = {
    isTestAStringDialogOpen,
    setIsTestAStringDialogOpen,
  };

  return (
    <DataContext.Provider
      value={{
        rowId,
        setRowId,
        rows,
        setRows,
        states,
        setStates,
        transitions,
        setTransitions,
        columns,
        playgroundSize,
        stateSize,
        setStateSize,
      }}
    >
      <>
        {alertMessage !== "" && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setAlertMessage("")}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Alert severity="warning">{alertMessage}</Alert>
          </Snackbar>
        )}
        <Box sx={{ flexGrow: 1, m: 1 }}>
          {/* Grid to incorporate Transition table and Playground */}
          <Grid
            container
            columnSpacing={{
              xs: 1,
              sm: 2,
              md: 3,
            }}
          >
            {/* Transition table grid */}
            <Grid item xs={12} md={4}>
              {/* Grid for Add a Row button and Tools */}
              <Grid container justifyContent={"space-between"}>
                <Grid
                  item
                  sx={{
                    display: "flex",
                  }}
                >
                  <Button
                    size="small"
                    onClick={() =>
                      handleAddRow(
                        new RowModel(
                          rowId,
                          `q${rowId}`,
                          "",
                          "",
                          "",
                          false,
                          false
                        )
                      )
                    }
                  >
                    Add a row
                  </Button>
                </Grid>

                <Grid item>
                  <Tools {...toolsProps} />
                </Grid>
              </Grid>
              <TransitionTable {...transitionTableProps} />
            </Grid>

            {/* Playground grid */}
            <Grid item xs={12} md={8}>
              <Slider
                value={stateSize}
                onChange={handleStateSizeChange}
                min={StateMinSize}
                max={StateMaxSize}
                aria-label="Default"
                valueLabelDisplay="auto"
                sx={{
                  marginBottom: "-3px",
                }}
              />
              <Playground {...playgroundProps} />
            </Grid>
          </Grid>
        </Box>

        {toolSelected && toolSelected === AvailableTools.IS_DFA && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setToolSelected(null)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Alert severity={IsDFA(rows)?.[0] ? "success" : "error"}>
              <AlertTitle>{AvailableTools.IS_DFA}</AlertTitle>
              {IsDFA(rows)?.[1]}
            </Alert>
          </Snackbar>
        )}
        {toolSelected && toolSelected === AvailableTools.IS_NFA && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setToolSelected(null)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Alert severity={IsNFA(rows)?.[0] ? "success" : "error"}>
              <AlertTitle>{AvailableTools.IS_NFA}</AlertTitle>
              {IsNFA(rows)?.[1]}
            </Alert>
          </Snackbar>
        )}
        {toolSelected && toolSelected === AvailableTools.NFA_TO_DFA && (
          <NfaToDfa />
        )}
        {toolSelected && toolSelected === AvailableTools.MINIMIZE_DFA && (
          <MinimizeDfa />
        )}
        {toolSelected && toolSelected === AvailableTools.TEST_A_STRING && (
          <TestAString {...testAStringProps} />
        )}
        {toolSelected &&
          toolSelected === AvailableTools.HIGHLIGHT_NULL_TRANSITIONS &&
          handleHighlightNullTransitions()}
      </>
    </DataContext.Provider>
  );
};
