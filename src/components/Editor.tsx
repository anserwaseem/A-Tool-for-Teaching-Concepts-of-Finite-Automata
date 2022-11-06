import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColumns, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import SecurityIcon from "@mui/icons-material/Security";
import { darken, lighten } from "@mui/material/styles";
import Row from "../models/TransitionTableRow.model";

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const Editor = () => {
  const [gridRowId, setGridRowId] = useState(1);
  const [gridData, setGridData] = useState<Row[]>([]);
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
  const [selectedIndex, setSelectedIndex] = useState(1);

  function handleListItemClick(event: any, index: number) {
    setSelectedIndex(index);
  }

  const handleAddRow = () => {
    setGridData((prev) => [
      ...prev,
      new Row(gridRowId, "", "", "", "", false, false),
    ]);
    setGridRowId((prev) => prev + 1);
  };

  const handleDeleteRow = (id: number) => {
    console.log("handleDeleteRow", id);
    setGridData((prev) => prev.filter((row) => row.id !== id));
  };

  const isRowEmpty = (row: Row) => {
    return row.node === "" && row.a === "" && row.b === "" && row.nul === "";
  };

  const handleSaveRow = (row: Row) => {
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
        availableNodeValues.concat(row.node);

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
      let index = newGridData.findIndex((r) => r.id === row.id);
      newGridData[index] = row;
      console.log("newGridData", newGridData);
      return newGridData;
    });
  };

  const toggleInitialState = (row: Row) => {
    console.log("toggleInitialState", row);
    setGridData((prev) => {
      console.log("toggleInitialState prev", prev);
      if (!prev || isRowEmpty(row)) {
        alert("Cannot make empty row initial state.");
        return prev;
      }

      if (prev.filter((r) => r.isInitial).length > 0 && !row.isInitial) {
        alert("Only one initial state is allowed.");
        return prev;
      }

      let newGridData = [...prev];
      let index = newGridData.findIndex((r) => r.id === row.id);
      newGridData[index].isInitial = !newGridData[index].isInitial;
      console.log("newGridData", newGridData);
      return newGridData;
    });
  };

  const toggleFinalState = (row: Row) => {
    console.log("toggleFinalState", row);
    setGridData((prev) => {
      console.log("toggleFinalState prev", prev);
      if (!prev || isRowEmpty(row)) {
        alert("Cannot make empty row final state.");
        return prev;
      }

      let newGridData = [...prev];
      let index = newGridData.findIndex((r) => r.id === row.id);
      newGridData[index].isFinal = !newGridData[index].isFinal;
      console.log("newGridData", newGridData);
      return newGridData;
    });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, m: 1 }}>
        {/* Grid to incorporate Transition table and Automata */}
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* Transition table grid */}
          <Grid item sm={12} md={4}>
            <Button size="small" onClick={handleAddRow}>
              Add a row
            </Button>
            <Box
              sx={{
                "& .super-app-theme--Both": {
                  bgcolor: (theme) =>
                    `${getBackgroundColor(
                      theme.palette.error.main,
                      theme.palette.mode
                    )} !important`,
                },

                "& .super-app-theme--Initial": {
                  bgcolor: (theme) =>
                    `${getBackgroundColor(
                      theme.palette.info.main,
                      theme.palette.mode
                    )} !important`,
                },

                "& .super-app-theme--Final": {
                  bgcolor: (theme) =>
                    `${getBackgroundColor(
                      theme.palette.success.main,
                      theme.palette.mode
                    )} !important`,
                },
              }}
            >
              <DataGrid
                rows={gridData}
                columns={gridColumns}
                autoHeight
                hideFooter
                experimentalFeatures={{ newEditingApi: true }}
                getRowClassName={(params) =>
                  `super-app-theme--${
                    params?.row?.isInitial && params?.row?.isFinal
                      ? "Both"
                      : params?.row?.isInitial
                      ? "Initial"
                      : params?.row?.isFinal && "Final"
                  }`
                }
              ></DataGrid>
            </Box>
          </Grid>
          {/* Automata grid */}
          <Grid container item sm={12} md={8}>
            {/* Automata toolbar grid */}
            <Grid container item sm={12} md={2}>
              <Slide direction="up" in mountOnEnter unmountOnExit>
                <Grid
                  container
                  item
                  direction={{ sm: "row", md: "column" }}
                  justifyContent={{
                    sm: "space-evenly",
                  }}
                >
                  <Grid item>
                    <ListItem
                      button
                      selected={selectedIndex === 0}
                      onClick={(event) => handleListItemClick(event, 0)}
                    >
                      <Tooltip title="Add node">
                        <ListItemIcon>
                          <EditSharpIcon />
                        </ListItemIcon>
                      </Tooltip>
                    </ListItem>
                  </Grid>
                  <Grid item>
                    <ListItem
                      button
                      selected={selectedIndex === 1}
                      onClick={(event) => handleListItemClick(event, 1)}
                    >
                      <Tooltip title="Add transition">
                        <ListItemIcon>
                          <EditSharpIcon />
                        </ListItemIcon>
                      </Tooltip>
                    </ListItem>
                  </Grid>
                  <Grid item>
                    <ListItem
                      button
                      selected={selectedIndex === 2}
                      onClick={(event) => handleListItemClick(event, 2)}
                    >
                      <Tooltip title="Mouse">
                        <ListItemIcon>
                          <EditSharpIcon />
                        </ListItemIcon>
                      </Tooltip>
                    </ListItem>
                  </Grid>
                  <Grid item>
                    <ListItem
                      button
                      selected={selectedIndex === 3}
                      onClick={(event) => handleListItemClick(event, 3)}
                    >
                      <Tooltip title="Undo">
                        <ListItemIcon>
                          <EditSharpIcon />
                        </ListItemIcon>
                      </Tooltip>
                    </ListItem>
                  </Grid>
                </Grid>
              </Slide>
            </Grid>
            {/* Automata canvas grid */}
            <Grid item sm={12} md={10}>
              Automata goes here ...
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default Editor;
