import { useState } from "react";
import { Box, Grid } from "@mui/material";
import { GridColumns, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import SecurityIcon from "@mui/icons-material/Security";
import { RowModel, DraggableStateModel, TransitionModel } from "../models";
import PlayGround from "../features/Playground";
import { PlaygroundProps } from "../features/props/PlaygroundProps";
import { selectedElementType } from "../features/props/SelectedElementType";
import { TransitionTableProps } from "../features/props/TransitionTableProps";
import TransitionTable from "../features/TransitionTable";

const Editor = () => {
  const [gridRowId, setGridRowId] = useState(1);
  const [gridData, setGridData] = useState<RowModel[]>([]);
  const gridColumns: GridColumns = [
    { field: "id", hide: true, hideable: false },
    {
      field: "node",
      headerName: "Node",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "a",
      headerName: "a",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
      width: 50,
    },
    {
      field: "b",
      headerName: "b",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
      width: 50,
    },
    {
      field: "nul",
      headerName: "null",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
      width: 50,
    },
    {
      field: "action",
      headerName: "Action",
      disableColumnMenu: true,
      sortable: false,
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
            onClick={() => handleDeleteRow(params.row.id)}
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

  const [selected, setSelected] = useState<selectedElementType | null>(null);
  const [actionState, setActionState] = useState("Normal");

  const handleAddRow = () => {
    setGridData((prev) => [
      ...prev,
      new RowModel(gridRowId, "", "", "", "", false, false),
    ]);
    setGridRowId((prev) => prev + 1);
  };

  const handleDeleteRow = (id: number) => {
    console.log("handleDeleteRow", id);
    setGridData((prev) => prev.filter((row) => row.id !== id));
  };

  const isRowEmpty = (row: RowModel) => {
    return row.node === "" && row.a === "" && row.b === "" && row.nul === "";
  };

  const handleSaveRow = (row: RowModel) => {
    console.log("handleSaveRow", row);
    setGridData((prev) => {
      console.log("handleSaveRow prev", prev);
      if (!prev || isRowEmpty(row)) {
        alert("Cannot save empty row.");
        return prev;
      }

      const availableNodeValues = prev
        .map((r) => r.node)
        .filter((v) => v !== "");
      if (!availableNodeValues.includes(row.node))
        availableNodeValues.push(row.node);

      console.log("availableNodeValues", availableNodeValues);

      const areTransitionValuesInvalid = [
        row.a !== "" && !availableNodeValues.includes(row.a),
        row.b !== "" && !availableNodeValues.includes(row.b),
        row.nul !== "" && !availableNodeValues.includes(row.nul),
      ];
      console.log("areTransitionValuesInvalid", areTransitionValuesInvalid);
      if (areTransitionValuesInvalid.includes(true)) {
        alert(
          `Transition values must be empty or one of the following: ${availableNodeValues.join(
            ", "
          )}`
        );
        return prev;
      }

      const nodeAlreadyExists = prev.find(
        (r) => r.node === row.node && r.id !== row.id
      );
      if (nodeAlreadyExists) {
        alert("This node value already exists. Kindly choose another value.");
        return prev;
      }

      let newGridData = [...prev];
      newGridData[row.id - 1] = row;
      console.log("newGridData", newGridData);
      return newGridData;
    });
  };

  const toggleInitialState = (row: RowModel) => {
    console.log("toggleInitialState", row);
    setGridData((prev) => {
      console.log("toggleInitialState prev", prev);
      if (!prev || isRowEmpty(row)) {
        alert("Cannot make empty row initial state.");
        return prev;
      }

      if (isRowEmpty(prev[row.id - 1])) {
        alert("Kindly save the row before making it initial state.");
      }

      if (prev.filter((r) => r.isInitial).length > 0 && !row.isInitial) {
        alert("Only one initial state is allowed.");
        return prev;
      }

      let newGridData = [...prev];
      newGridData[row.id - 1].isInitial = !newGridData[row.id - 1].isInitial;
      console.log("newGridData", newGridData);
      return newGridData;
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

      if (isRowEmpty(prev[row.id - 1])) {
        alert("Kindly save the row before making it final state.");
      }

      let newGridData = [...prev];
      newGridData[row.id - 1].isFinal = !newGridData[row.id - 1].isFinal;
      console.log("newGridData", newGridData);
      return newGridData;
    });
  };

  const handleSelect = (e: any) => {
    console.log("PlayGround handleSelect", e);
    if (e === null) {
      setSelected(null);
      setActionState("Normal");
    } else {
      console.log("PlayGround handleSelect e", e.target.id);
      setSelected({ id: e.target.id, type: "box" });
    }
  };

  const checkExsitence = (id: string) => {
    return [...boxes].map((b) => b.id).includes(id);
  };

  const handleDropDynamic = (e: any) => {
    console.log("handleDropDynamic", e);
    let l = boxes.length;
    while (checkExsitence("q" + l)) l++;
    let { x, y } = e.target.getBoundingClientRect();
    const stateName = prompt("Enter state name: ", "q" + l);
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
    // }
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
              <PlayGround {...playgroundProps} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default Editor;
