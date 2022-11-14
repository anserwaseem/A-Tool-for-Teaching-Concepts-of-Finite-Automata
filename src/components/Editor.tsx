import { useState } from "react";
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
import { PlaygroundSize } from "./interfaces/playgroundSize";
import { StyledTransitionLabel } from "../features/components/playground/StyledTransitionLabel";
import { MaxNumberOfStates } from "../consts/MaxNumberOfStates";

const Editor = () => {
  console.log("re rendering Editor");

  const [gridRowId, setGridRowId] = useState(0);
  const [gridData, setGridData] = useState<RowModel[]>([]);
  const gridColumns: GridColumns = [
    { field: "id", hide: true, hideable: false },
    {
      field: "node",
      headerName: "Node",
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
  const [boxes, setBoxes] = useState<DraggableStateModel[]>([]);
  const [lines, setLines] = useState<TransitionModel[]>([]);

  const [selected, setSelected] = useState<SelectedElementType | null>(null);
  const [actionState, setActionState] = useState("Normal");
  const [size, setSize] = useState<PlaygroundSize>({ width: 0, height: 0 });

  const handleAddRow = (row: RowModel) => {
    if (boxes.length >= MaxNumberOfStates) {
      alert(`Maximum ${MaxNumberOfStates} states allowed`);
      return;
    }
    setGridData((prev) => [...prev, row]);
    setGridRowId((prev) => prev + 1);
    console.log(
      "added row, now adding new state at: ",
      size.width,
      size.height
    );
    let newBox = {
      id: row.node,
      x: Math.floor(Math.random() * size.width),
      y: Math.floor(Math.random() * size.height),
      shape: "state",
    };
    setBoxes((prev) => [...prev, newBox]);
  };

  const handleDeleteRow = (row: RowModel) => {
    console.log("handleDeleteRow", row);
    console.log(
      "resultant data",
      gridData
        .filter((r) => r.id !== row.id)
        .map((r) => {
          return {
            ...r,
            ...Object.fromEntries(
              PossibleTransitionValues.map((key) => [
                key === "^" ? "nul" : key,
                r[key === "^" ? "nul" : key].toString().includes(row.node)
                  ? r[key === "^" ? "nul" : key]
                      .toString()
                      .replace(row.node, "")
                  : r[key === "^" ? "nul" : key],
              ])
            ),
          };
        })
    );

    setGridData((rows) =>
      rows
        .filter((r) => r.id !== row.id)
        .map((r) => {
          return {
            ...r,
            ...Object.fromEntries(
              PossibleTransitionValues.map((key) => [
                key === "^" ? "nul" : key,
                r[key === "^" ? "nul" : key].toString().includes(row.node)
                  ? r[key === "^" ? "nul" : key]
                      .toString()
                      .replace(row.node, "")
                  : r[key === "^" ? "nul" : key],
              ])
            ),
          };
        })
    );

    setLines((prev) =>
      prev.filter((l) => l.props.start !== row.node && l.props.end !== row.node)
    );

    setBoxes((prev) => prev.filter((b) => b.id !== row.node));
  };

  const isRowEmpty = (row: RowModel) => {
    return !row
      ? true
      : row.node === "" && row.a === "" && row.b === "" && row.nul === "";
  };

  const handleSaveRow = (row: RowModel) => {
    console.log("handleSaveRow", row);
    console.log("handleSaveRow", gridData);

    if (isRowEmpty(row)) {
      alert("Cannot save empty row.");
      return;
    }

    const oldRow = gridData.find((r) => r.id === row.id);
    if (!oldRow) {
      alert("Cannot save row.");
      return;
    }

    if (row.node.length > StateNameMaxLength) {
      alert(`State name cannot be more than ${StateNameMaxLength} characters.`);
      if (oldRow) {
        setGridData((prev) => prev.map((r) => (r.id === row.id ? oldRow : r)));
      }
      return;
    }

    // if state name is changed AND transition values are added/updated/removed, not allowed
    if (
      oldRow.node !== row.node &&
      PossibleTransitionValues.some(
        (key) =>
          row[key === "^" ? "nul" : key] !== oldRow[key === "^" ? "nul" : key]
      )
    ) {
      alert(
        `Cannot change state name when transition values are added/updated/removed.`
      );
      if (oldRow) {
        setGridData((prev) => prev.map((r) => (r.id === row.id ? oldRow : r)));
      }
      return;
    }

    const nulPossibleTransitionValues = PossibleTransitionValues.map((v) =>
      v === "^" ? "nul" : v
    );
    let updatedGridData: RowModel[] = [];
    let errorWhileSavingRow = false;
    setGridData((prev) => {
      console.log("handleSaveRow prev", prev);
      let availableNodeValues = prev.map((r) => r.node).filter((v) => v !== "");
      // if (oldRow.node !== row.node)
      //   availableNodeValues = availableNodeValues
      //     .filter((v) => v !== oldRow.node)
      //     .concat(row.node);

      if (!availableNodeValues.includes(row.node))
        availableNodeValues.push(row.node);
      console.log("availableNodeValues", availableNodeValues);

      const areTransitionValuesInvalid = nulPossibleTransitionValues.some(
        (key) => {
          const transitionValues = row[key]
            .toString()
            .split(" ")
            .filter((v) => v !== "");
          return transitionValues.some((v) => !availableNodeValues.includes(v));
        }
      );

      console.log("areTransitionValuesInvalid", areTransitionValuesInvalid);
      if (areTransitionValuesInvalid) {
        alert(
          `Transition values must be empty or from the following: ${availableNodeValues.join(
            ", "
          )}`
        );
        errorWhileSavingRow = true;
        return prev.map((r) => (r.id === row.id ? oldRow : r));
      }

      const stateAlreadyExists = prev.find(
        (r) =>
          r.node === row.node &&
          r.a === row.a &&
          r.b === row.b &&
          r.nul === row.nul
      );
      if (stateAlreadyExists) {
        alert("This state value already exists. Kindly choose another value.");
        errorWhileSavingRow = true;
        return prev;
      }

      updatedGridData = prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              ...row,
              ...Object.fromEntries(
                PossibleTransitionValues.map((key) => [
                  key === "^" ? "nul" : key,
                  row[key === "^" ? "nul" : key]
                    .toString()
                    .includes(oldRow.node)
                    ? row[key === "^" ? "nul" : key]
                        .toString()
                        .replace(oldRow.node, row.node)
                    : row[key === "^" ? "nul" : key],
                ])
              ),
            }
          : {
              ...r,
              ...Object.fromEntries(
                PossibleTransitionValues.map((key) => [
                  key === "^" ? "nul" : key,
                  r[key === "^" ? "nul" : key].toString().includes(oldRow.node)
                    ? r[key === "^" ? "nul" : key]
                        .toString()
                        .replace(oldRow.node, row.node)
                    : r[key === "^" ? "nul" : key],
                ])
              ),
            }
      );

      return updatedGridData;
    });

    if (!errorWhileSavingRow) {
      setBoxes((prev) =>
        prev.map((b) => (b.id === oldRow.node ? { ...b, id: row.node } : b))
      );

      // if only state name is changed
      if (
        oldRow.node !== row.node &&
        PossibleTransitionValues.every(
          (key) =>
            row[key === "^" ? "nul" : key] === oldRow[key === "^" ? "nul" : key]
        )
      ) {
        let updatedtransitions = lines.map((l) =>
          l.props.start === oldRow.node && l.props.end === oldRow.node
            ? {
                ...l,
                props: {
                  ...l.props,
                  start: row.node,
                  end: row.node,
                },
              }
            : l.props.start === oldRow.node
            ? {
                ...l,
                props: {
                  ...l.props,
                  start: row.node,
                },
              }
            : l.props.end === oldRow.node
            ? {
                ...l,
                props: {
                  ...l.props,
                  end: row.node,
                },
              }
            : l
        );
        console.log("updatedtransitions", updatedtransitions);
        setLines(updatedtransitions);
      } else {
        // if new transitions are added

        let addedTransitions: TransitionModel[] = [];
        let removedTransitions: TransitionModel[] = [];

        PossibleTransitionValues.forEach((key) => {
          const oldTransitionValues = oldRow[key === "^" ? "nul" : key]
            .toString()
            .split(" ")
            .filter((v) => v !== "");
          console.log("oldTransitionValues", oldTransitionValues);

          const newTransitionValues = row[key === "^" ? "nul" : key]
            .toString()
            .split(" ")
            .filter((v) => v !== "");
          console.log("newTransitionValues", newTransitionValues);

          const addedTransitionValues = newTransitionValues.filter(
            (v) => !oldTransitionValues.includes(v)
          );
          console.log("addedTransitionValues", addedTransitionValues);

          const removedTransitionValues = oldTransitionValues.filter(
            (v) => !newTransitionValues.includes(v)
          );
          console.log("removedTransitionValues", removedTransitionValues);

          addedTransitionValues.forEach((v) => {
            console.log("addedTransitionValues key, v: ", key, v);

            // if transition value v is already present in the transitions array, then just update it's labels & value
            const transitionAlreadyExists = addedTransitions.find(
              (t) => t.props.start === row.node && t.props.end === v
            );

            if (transitionAlreadyExists) {
              transitionAlreadyExists.props.labels = (
                <StyledTransitionLabel
                  label={transitionAlreadyExists.props.value + key}
                />
              );
              transitionAlreadyExists.props.value =
                transitionAlreadyExists.props.value + key;
            } else {
              const isSelfTransition = v === row.node;
              const newLine: TransitionModel = {
                props: {
                  start: row.node,
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
                menuWindowOpened: false,
              };
              addedTransitions.push(newLine);
            }
          });
          console.log("addedTransitions", addedTransitions);

          removedTransitionValues.forEach((v) => {
            console.log("removedTransitionValues key, v: ", key, v);
            const removedTransition = lines.find(
              (l) => l.props.start === row.node && l.props.end === v
            );

            // if removed transition's label (value) is of length 1, then remove the transition
            if (removedTransition.props.value.length === 1) {
              removedTransitions.push(removedTransition);
            } else {
              // else just update the transition's label & value
              removedTransition.props.labels = (
                <StyledTransitionLabel
                  label={removedTransition.props.value.replace(key, "")}
                />
              );
              removedTransition.props.value =
                removedTransition.props.value.replace(key, "");
            }
          });
          console.log("removedTransitions", removedTransitions);
        });

        setLines((prev) => {
          // update removedTransitions's labels && value if it's already present
          const updatedRemovedTransitions = prev.map((l) =>
            removedTransitions.find(
              (t) => t.props.start === l.props.start && t.props.end === l.props.end
            )
              ? {
                  ...l,
                  props: {
                    ...l.props,
                    labels: (
                      <StyledTransitionLabel
                        label={
                          removedTransitions.find(
                            (t) =>
                              t.props.start === l.props.start &&
                              t.props.end === l.props.end
                          )?.props.value
                        }
                      />
                    ),
                    value:
                      removedTransitions.find(
                        (t) =>
                          t.props.start === l.props.start &&
                          t.props.end === l.props.end
                      )?.props.value,
                  },
                }
              : l
          );

          console.log("updatedRemovedTransitions", updatedRemovedTransitions);

          // update addedTransitions's labels & value if it's are already present
          const updatedAddedTransitions = addedTransitions.map((a) => {
            const transitionAlreadyExists = prev.find(
              (p) =>
                p.props.start === a.props.start && p.props.end === a.props.end
            );
            console.log(
              "transitionAlreadyExists.props.value, a.props.value:",
              transitionAlreadyExists?.props.value,
              a.props.value
            );
            if (
              transitionAlreadyExists &&
              transitionAlreadyExists.props.value !== a.props.value
            ) {
              return {
                ...transitionAlreadyExists,
                props: {
                  ...transitionAlreadyExists.props,
                  labels: (
                    <StyledTransitionLabel
                      label={
                        transitionAlreadyExists.props.value + a.props.value
                      }
                    />
                  ),
                  value: transitionAlreadyExists.props.value + a.props.value,
                },
              };
            }
            return a;
          });
          console.log("updatedAddedTransitions", updatedAddedTransitions);

          return [...updatedRemovedTransitions, ...updatedAddedTransitions];
        });
      }
    }
  };

  const toggleInitialState = (row: RowModel) => {
    console.log("toggleInitialState", row);
    setGridData((prev) => {
      console.log("toggleInitialState prev", prev);
      if (!prev || isRowEmpty(row)) {
        alert("Cannot make empty row initial state.");
        return prev;
      }

      if (
        isRowEmpty(
          prev.filter((r) => r.node === row.node && r.id === row.id)[0]
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
        if (r.node === row.node) {
          return { ...r, isInitial: !r.isInitial };
        }
        return r;
      });
    });
  };

  const toggleFinalState = (row: RowModel) => {
    console.log("toggleFinalState", row);
    setGridData((prev) => {
      console.log("toggleFinalState prev", prev);
      if (!prev || isRowEmpty(row)) {
        alert("Cannot make empty row final state.");
        return prev;
      }

      if (
        isRowEmpty(
          prev.filter((r) => r.node === row.node && r.id === row.id)[0]
        )
      ) {
        alert("Kindly save the row before making it final state.");
      }

      return prev.map((r) => {
        if (r.node === row.node) {
          return { ...r, isFinal: !r.isFinal };
        }
        return r;
      });
    });
  };

  const handleSelect = (e: any) => {
    console.log("Playground handleBoxSelect e", e);
    if (e === null) {
      setSelected(null);
      setActionState("Normal");
    } else {
      console.log("Playground handleBoxSelect id", e.target.id);
      setSelected({ id: e.target.id, type: "box" });
    }
  };

  const checkExsitence = (id: string) => {
    return [...boxes].map((b) => b.id).includes(id);
  };

  const handleDropDynamic = (e: any) => {
    console.log("handleDropDynamic", e);
    if (boxes.length >= MaxNumberOfStates) {
      alert(`Maximum ${MaxNumberOfStates} states allowed.`);
      return;
    }

    let { x, y } = e.target.getBoundingClientRect();
    const stateName = promptNewStateName(boxes, `q${gridRowId}`);
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

    setGridData((prev) => [
      ...prev,
      new RowModel(gridRowId, stateName, "", "", "", false, false),
    ]);
    setGridRowId((prev) => prev + 1);
  };

  const transitionTableProps: TransitionTableProps = {
    gridData,
    setGridData,
    gridColumns,
    gridRowId,
    setGridRowId,
    handleAddRow,
  };

  const playgroundProps: PlaygroundProps = {
    boxes,
    setBoxes,
    lines,
    setLines,
    selected,
    setSelected,
    actionState,
    setActionState,
    handleSelect,
    checkExsitence,
    handleDropDynamic,
    gridData,
    setGridData,
    handleDeleteRow,
    toggleInitialState,
    toggleFinalState,
    setSize,
  };

  return (
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
  );
};
export default Editor;
