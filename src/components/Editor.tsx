import { useEffect, useState } from "react";
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

    const previousRow = gridData.find((r) => r.id === row.id);
    if (row.node.length > StateNameMaxLength) {
      alert(`State name cannot be more than ${StateNameMaxLength} characters.`);
      if (previousRow) {
        setGridData((prev) =>
          prev.map((r) => (r.id === row.id ? previousRow : r))
        );
      }
      return;
    }

    setGridData((prev) => {
      console.log("handleSaveRow prev", prev);
      let availableNodeValues = prev.map((r) => r.node).filter((v) => v !== "");
      if (!availableNodeValues.includes(row.node))
        availableNodeValues.push(row.node);

      console.log("availableNodeValues", availableNodeValues);

      const nulPossibleTransitionValues = PossibleTransitionValues.map((v) =>
        v === "^" ? "nul" : v
      );
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
        return prev;
      }

      const nodeAlreadyExists = prev.find(
        (r) =>
          r.node === row.node &&
          r.a === row.a &&
          r.b === row.b &&
          r.nul === row.nul
      );
      if (nodeAlreadyExists) {
        alert("This state value already exists. Kindly choose another value.");
        return prev;
      }

      return prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              ...row,
              ...Object.fromEntries(
                PossibleTransitionValues.map((key) => [
                  key === "^" ? "nul" : key,
                  row[key === "^" ? "nul" : key]
                    .toString()
                    .includes(previousRow.node)
                    ? row[key === "^" ? "nul" : key]
                        .toString()
                        .replace(previousRow.node, row.node)
                    : row[key === "^" ? "nul" : key],
                ])
              ),
            }
          : {
              ...r,
              ...Object.fromEntries(
                PossibleTransitionValues.map((key) => [
                  key === "^" ? "nul" : key,
                  r[key === "^" ? "nul" : key]
                    .toString()
                    .includes(previousRow.node)
                    ? r[key === "^" ? "nul" : key]
                        .toString()
                        .replace(previousRow.node, row.node)
                    : r[key === "^" ? "nul" : key],
                ])
              ),
            }
      );
    });

    setBoxes((prev) =>
      prev.map((b) => (b.id === previousRow.node ? { ...b, id: row.node } : b))
    );

    setLines((prev) =>
      prev.map((l) =>
        l.props.start === previousRow.node && l.props.end === previousRow.node
          ? {
              ...l,
              props: {
                ...l.props,
                start: row.node,
                end: row.node,
              },
            }
          : l.props.start === previousRow.node
          ? { ...l, props: { ...l.props, start: row.node } }
          : l.props.end === previousRow.node
          ? { ...l, props: { ...l.props, end: row.node } }
          : l
      )
    );
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
    // let l = boxes.length;
    // while (checkExsitence("q" + l)) l++;
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
