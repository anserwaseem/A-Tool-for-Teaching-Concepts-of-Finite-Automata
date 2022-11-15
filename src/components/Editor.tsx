import { createContext, useState } from "react";
import { Box, Grid } from "@mui/material";
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
    },
    {
      field: "b",
      headerName: "b",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "nul",
      headerName: "null",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      sortable: false,
      width: 70,
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
  const [size, setSize] = useState<PlaygroundSize>({ width: 0, height: 0 });

  const handleAddRow = (row: RowModel) => {
    if (states.length >= MaxNumberOfStates) {
      alert(`Maximum ${MaxNumberOfStates} states allowed`);
      return;
    }
    setRows((prev) => [...prev, row]);
    setRowId((prev) => prev + 1);
    console.log(
      "added row, now adding new state at: ",
      size.width,
      size.height
    );
    const newState = new DraggableStateModel(
      row.state,
      Math.floor(Math.random() * size.width),
      Math.floor(Math.random() * size.height)
    );
    setStates((prev) => [...prev, newState]);
  };

  const handleDeleteRow = (row: RowModel) => {
    console.log("handleDeleteRow", row);
    console.log(
      "resultant data",
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
      prev.filter(
        (t) => t.props.start !== row.state && t.props.end !== row.state
      )
    );

    setStates((prev) => prev.filter((s) => s.id !== row.state));
  };

  const isRowEmpty = (row: RowModel) => {
    return !row
      ? true
      : row.state === "" && row.a === "" && row.b === "" && row.nul === "";
  };

  const handleSaveRow = (row: RowModel) => {
    console.log("handleSaveRow", row);
    console.log("handleSaveRow", rows);

    if (isRowEmpty(row)) {
      alert("Cannot save empty row.");
      return;
    }

    const oldRow = rows.find((r) => r.id === row.id);
    if (!oldRow) {
      alert("Cannot save row.");
      return;
    }

    if (row.state.length > StateNameMaxLength) {
      alert(`State name cannot be more than ${StateNameMaxLength} characters.`);
      if (oldRow) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? oldRow : r)));
      }
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
      alert(
        `Cannot change state name when transition values are added/updated/removed.`
      );
      if (oldRow) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? oldRow : r)));
      }
      return;
    }

    const nulPossibleTransitionValues = PossibleTransitionValues.map((v) =>
      v === "^" ? "nul" : v
    );
    let updatedRows: RowModel[] = [];
    let errorWhileSavingRow = false;
    setRows((prev) => {
      console.log("handleSaveRow prev", prev);
      let availableStateValues = prev
        .map((r) => r.state)
        .filter((v) => v !== "");
      // if (oldRow.state !== row.state)
      //   availableStateValues = availableStateValues
      //     .filter((v) => v !== oldRow.state)
      //     .concat(row.state);

      if (!availableStateValues.includes(row.state))
        availableStateValues.push(row.state);
      console.log("availableStateValues", availableStateValues);

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

      console.log("areTransitionValuesInvalid", areTransitionValuesInvalid);
      if (areTransitionValuesInvalid) {
        alert(
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
        alert("This state value already exists. Kindly choose another value.");
        errorWhileSavingRow = true;
        return prev;
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

    if (!errorWhileSavingRow) {
      setStates((prev) =>
        prev.map((s) => (s.id === oldRow.state ? { ...s, id: row.state } : s))
      );

      // if only state name is changed
      if (
        oldRow.state !== row.state &&
        PossibleTransitionValues.every(
          (key) =>
            row[key === "^" ? "nul" : key] === oldRow[key === "^" ? "nul" : key]
        )
      ) {
        let updatedtransitions = transitions.map((t) =>
          t.props.start === oldRow.state && t.props.end === oldRow.state
            ? {
                ...t,
                props: {
                  ...t.props,
                  start: row.state,
                  end: row.state,
                },
              }
            : t.props.start === oldRow.state
            ? {
                ...t,
                props: {
                  ...t.props,
                  start: row.state,
                },
              }
            : t.props.end === oldRow.state
            ? {
                ...t,
                props: {
                  ...t.props,
                  end: row.state,
                },
              }
            : t
        );
        console.log("updatedtransitions", updatedtransitions);
        setTransitions(updatedtransitions);
      } // if new transitions are added
      else {
        // remove those transitions which are going from this state
        let updatedtransitions = transitions.filter(
          (t) => t.props.start !== oldRow.state
        );

        // for each possible transition value, add new transitions which are going from this state
        PossibleTransitionValues.forEach((key) => {
          const transitionValues = row[key === "^" ? "nul" : key]
            .toString()
            .split(" ")
            .filter((v) => v !== "");
          console.log("transitionValues", transitionValues);
          transitionValues.forEach((v) => {
            // console.log("key, v: ", key, v);
            const isSelfTransition = v === row.state;
            // if transition is not already added, add new transition
            if (
              !updatedtransitions.find(
                (t) => t.props.start === row.state && t.props.end === v
              )
            ) {
              // console.log("adding new transition");
              updatedtransitions.push({
                props: {
                  start: row.state,
                  end: v,
                  labels: <StyledTransitionLabel label={key} />,
                  value: key,
                  animateDrawing: true,
                  _extendSVGcanvas: isSelfTransition ? 25 : 0,
                  _cpx1Offset: isSelfTransition ? -50 : 0,
                  _cpy1Offset: isSelfTransition ? -50 : 0,
                  _cpx2Offset: isSelfTransition ? 50 : 0,
                  _cpy2Offset: isSelfTransition ? -50 : 0,
                },
              });
            } // if transition is already added, update its labels & value
            else {
              // console.log("updating existing transition");
              updatedtransitions = updatedtransitions.map((t) =>
                t.props.start === row.state && t.props.end === v
                  ? {
                      ...t,
                      props: {
                        ...t.props,
                        labels: (
                          <StyledTransitionLabel label={t.props.value + key} />
                        ),
                        value: t.props.value + key,
                      },
                    }
                  : t
              );
            }
          });
        });

        // console.log("updatedtransitions", updatedtransitions);
        setTransitions(updatedtransitions);
      }
    }
  };

  const toggleInitialState = (row: RowModel) => {
    console.log("toggleInitialState", row);
    setRows((prev) => {
      console.log("toggleInitialState prev", prev);
      if (!prev || isRowEmpty(row)) {
        alert("Cannot make empty row initial state.");
        return prev;
      }

      if (
        isRowEmpty(
          prev.filter((r) => r.state === row.state && r.id === row.id)[0]
        )
      ) {
        alert("Kindly save the row before making it initial state.");
        return prev;
      }

      if (prev.filter((r) => r.isInitial).length > 0 && !row.isInitial) {
        alert("Only one initial state is allowed.");
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
    console.log("toggleFinalState", row);
    setRows((prev) => {
      console.log("toggleFinalState prev", prev);
      if (!prev || isRowEmpty(row)) {
        alert("Cannot make empty row final state.");
        return prev;
      }

      if (
        isRowEmpty(
          prev.filter((r) => r.state === row.state && r.id === row.id)[0]
        )
      ) {
        alert("Kindly save the row before making it final state.");
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
    console.log("Playground handleStateSelect e", e);
    if (e === null) {
      setSelected(null);
      setActionState("Normal");
    } else {
      console.log("Playground handleStateSelect id", e.target.id);
      setSelected({ id: e.target.id, type: "state" });
    }
  };

  const checkExsitence = (id: string) => {
    return [...states].map((s) => s.id).includes(id);
  };

  const handleDropDynamic = (e: any) => {
    console.log("handleDropDynamic", e);
    if (states.length >= MaxNumberOfStates) {
      alert(`Maximum ${MaxNumberOfStates} states allowed.`);
      return;
    }

    let { x, y } = e.target.getBoundingClientRect();
    const stateName = promptNewStateName(states, `q${rowId}`);
    if (stateName) {
      const newState = new DraggableStateModel(
        stateName,
        e.clientX - x,
        e.clientY - y
      );
      setStates([...states, newState]);
    }
    console.log("states", states);

    setRows((prev) => [
      ...prev,
      new RowModel(rowId, stateName, "", "", "", false, false),
    ]);
    setRowId((prev) => prev + 1);
  };

  const transitionTableProps: TransitionTableProps = {
    rows,
    setRows,
    columns,
    rowId,
    setRowId,
    handleAddRow,
  };

  const playgroundProps: PlaygroundProps = {
    states,
    setStates,
    transitions,
    setTransitions,
    selected,
    setSelected,
    actionState,
    setActionState,
    handleSelect,
    checkExsitence,
    handleDropDynamic,
    rows,
    setRows,
    handleDeleteRow,
    toggleInitialState,
    toggleFinalState,
    setSize,
  };

  return (
    <DataContext.Provider
      value={{
        rows,
        states,
        transitions,
      }}
    >
      <>
        <Box sx={{ flexGrow: 1, m: 1 }}>
          {/* Grid to incorporate Transition table and Automata */}
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
              <TransitionTable {...transitionTableProps} />
            </Grid>
            {/* Automata grid */}
            <Grid container item xs={12} md={8}>
              {/* Automata canvas grid */}
              <Grid item xs={12}>
                <Playground {...playgroundProps} />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </>
    </DataContext.Provider>
  );
};
