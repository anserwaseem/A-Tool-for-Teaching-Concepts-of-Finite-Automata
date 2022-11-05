import { useState } from "react";
import { Box, Button, Grid, Paper, styled } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowProps,
  GridColumns,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import SaveSharpIcon from "@mui/icons-material/SaveSharp";
import SecurityIcon from "@mui/icons-material/Security";
import { darken, lighten } from "@mui/material/styles";
import Row from "../models/TransitionTableRow.model";

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);
const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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
      width: 200,
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
            onClick={() => toggleInitialState(params.row.id)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<SecurityIcon />}
            label="Toggle Final State"
            onClick={() => toggleFinalState(params.row.id)}
            showInMenu
          />,
        ];
      },
    },
  ];

  const handleAddRow = () => {
    setGridData((prev) => [
      ...prev,
      new Row(gridRowId, "", "", "", "", false, false),
    ]);
    setGridRowId((prev) => prev + 1);
  };

  //   const handleEditRow = (row: Row) => {
  //     setGridRow(row);
  //   };

  const handleDeleteRow = (id: number) => {
    console.log("handleDeleteRow", id);
    setGridData((prev) => prev.filter((row) => row.id !== id));
  };

  const handleSaveRow = (row: Row) => {
    console.log("handleSaveRow", row);
    setGridData((prev) => {
      const nodeAlreadyExists = prev.find(
        (r) => r.node === row.node && r.id !== row.id
      );
      if (nodeAlreadyExists) {
        alert("This node value already exists. Kindly choose another value.");
        return [...prev];
      }

      const availableNodeValues = prev.map((r) => r.node);
      if (
        !availableNodeValues.includes(row.a) ||
        !availableNodeValues.includes(row.b) ||
        !availableNodeValues.includes(row.nul)
      ) {
        alert(
          "This node value doesn't exists. Kindly choose one of the existing node value."
        );
        return [...prev];
      }

      let newGridData = [...prev];
      let index = newGridData.findIndex((r) => r.id === row.id);
      newGridData[index] = row;
      console.log("newGridData", newGridData);
      return newGridData;
    });
  };

  const toggleInitialState = (id: number) => {
    console.log("toggleInitialState", id);
    setGridData((prev) => {
      let newGridData = [...prev];
      let index = newGridData.findIndex((r) => r.id === id);
      newGridData[index].isInitial = !newGridData[index].isInitial;
      console.log("newGridData", newGridData);
      return newGridData;
    });
  };

  const toggleFinalState = (id: number) => {
    console.log("toggleFinalState", id);
    setGridData((prev) => {
      let newGridData = [...prev];
      let index = newGridData.findIndex((r) => r.id === id);
      newGridData[index].isFinal = !newGridData[index].isFinal;
      console.log("newGridData", newGridData);
      return newGridData;
    });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, m: 1 }}>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={8}>
            <Item>2</Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default Editor;
