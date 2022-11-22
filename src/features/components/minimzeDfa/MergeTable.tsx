import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  CssBaseline,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { AnimationDurationOptions } from "../../../consts/AnimationDurationOptions";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import { RowModel } from "../../../models";
import { MergeTableProps } from "./props/MergeTableProps";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { MergeTableRowModel } from "../../../models/minimizeDfa/MergeTableRowModel";
import { MaxNumberOfStates } from "../../../consts/MaxNumberOfStates";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { ToolsTransitionTableProps } from "../tools/props/TransitionTableProps";
import { ToolsTransitionTable } from "../tools/TransitionTable";
import { ToolsPlayground } from "../tools/Playground";
import { ToolsPlaygroundProps } from "../tools/props/PlaygroundProps";
import { DataContext } from "../../../components/Editor";
import CheckIcon from "@mui/icons-material/Check";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeOutlined";
import ClearIcon from "@mui/icons-material/Clear";

const drawerWidth = 200;
const columnNames = PossibleTransitionValues.map(
  (value) => value !== "^" && value.toString()
);
let columnIndex = 0;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: number;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),

  ...(open === 0 && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
  marginLeft: `-${drawerWidth}px`,
  marginRight: `-${drawerWidth * 2}px`,

  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...(open === 1 && {
    marginLeft: 0,
  }),
  ...(open === 2 && {
    marginRight: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  top: "auto",
  backgroundColor: "rgb(200, 200, 200)",
  position: "absolute",
  alignItems: "center",

  ...(open === 0 && {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
  ...(open === 1 && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  }),
  ...(open === 2 && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const MergeTable = (props: MergeTableProps) => {
  console.log("re rendering MergeTable, props: ", props);

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[3]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [mergeTableRows, setMergeTableRows] = useState<any[]>([]);
  const [mergeTableColumns, SetMergeTableColumns] = useState<GridColDef[]>([]);
  const [displayStep, setDisplayStep] = useState<boolean>(null); // null for filling diagonal cells only, false for filling diagonal and upper triangular cells and true for filling diagonal, upper triangular, and lower triangular cells; lower triangular cells are filled using stepNumber2
  const [animationStep, setAnimationStep] = useState<boolean>(null); // null for highlighting rows in original transition table, false for showing explanation and true for placing Tick/Cross in Merge Table
  const [statesToHighlight, setStatesToHighlight] = useState<string[]>([]);
  const [columnName, setColumnName] = useState<string>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const theme = useTheme();
  const [open, setOpen] = useState(0); // 1 for table open, 2 for dfa open, 0 for both close

  let row1ToHighlight: RowModel, row2ToHighlight: RowModel;
  // let statesToHighlight: string[] = [];

  const handleTableOpen = () => {
    setOpen(1);
  };

  const handleTableClose = () => {
    setOpen(0);
  };
  const handleDfaOpen = () => {
    setOpen(2);
  };

  const handleDfaClose = () => {
    setOpen(0);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // make DataGrid of props.rows.length by props.rows.length size as soon as props.rows is updated
  useEffect(() => {
    if (dataContext.rows?.length > 0) {
      const columns: GridColDef[] = [
        {
          field: "state",
          headerName: "",
          disableColumnMenu: true,
          sortable: false,
          flex: 1,
        },
      ];

      const rows = [];
      const stateNames = dataContext.rows.map((row) => row.state);
      for (let i = 0; i < dataContext.rows.length; i++) {
        columns.push({
          field: `cell-${dataContext.rows[i].state}`,
          headerName: dataContext.rows[i].state,
          disableColumnMenu: true,
          sortable: false,
          flex: 1,
        });

        // put each state in the first column of each row
        rows.push({
          id: i,
          state: dataContext.rows[i].state,
          ...Object.fromEntries(
            stateNames.map((stateName) => [`cell-${stateName}`, ""])
          ),
        });

        console.log("rows.push: ", rows);
      }

      SetMergeTableColumns(columns);
      setMergeTableRows(rows);
    }
  }, [dataContext.rows]);

  useEffect(() => {
    console.log(
      "MergeTable useEffect, isPlaying, duration: ",
      isPlaying,
      duration
    );
    if (isPlaying) {
      let timer = setTimeout(() => {
        console.log("inside set timeout");

        handleUpdateData();

        // stop if every cell is either marked Tick or Cross or Dash

        if (
          mergeTableRows.every((row) =>
            Object.values(row).every(
              (cell) => cell === "✓" || cell === "✕" || cell === "-"
            )
          )
        ) {
          setIsComplete(true);
          setIsPlaying(false);
        }
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [dataContext.rows, mergeTableRows, isPlaying, displayStep]);

  const handleUpdateData = () => {
    console.log("MergeTable handleUpdateData: stepNumber: ", displayStep);
    if (displayStep === null) {
      console.log("mergeTable handleUpdateData displayStep is null");
      setMergeTableRows(markDiagonalCells());
      setDisplayStep(false);
    } else if (displayStep === false) {
      console.log("mergeTable handleUpdateData displayStep is false");
      setMergeTableRows(markUpperTriangularCells(markDiagonalCells()));
      setDisplayStep(true);
    } else {
      console.log("mergeTable handleUpdateData displayStep is true");
      markLowerTriangularCells(markUpperTriangularCells(markDiagonalCells()));
      // setDisplayStep(null);
    }

    // const columns = mergeTableColumns.map((column) => {
    //   if (column.field?.startsWith("cell-")) {
    //     return {
    //       ...column,
    //       renderCell: renderCell,
    //     };
    //   } else {
    //     return column;
    //   }
    // });

    // if (stepNumber) {
    //   // markUpperTriangularEntries();
    //   alert("markNonDiagonalEntries");
    // }

    // SetMergeTableColumns(columns);
    // setStepNumber(
    //   stepNumber === null ? false : stepNumber === false ? true : null
    // );
  };

  const markDiagonalCells = () => {
    console.log("markDiagonalCells");
    return mergeTableRows.map((row) => {
      return {
        ...row,
        [`cell-${row.state}`]: "✓",
      };
    });
  };

  const markUpperTriangularCells = (rows: any[]) => {
    console.log("markUpperTriangularCells");
    const stateNames = dataContext.rows.map((row) => row.state);
    return rows.map((row, i) => {
      const stateIndex = stateNames.indexOf(row.state);
      const cells = stateNames.map((state, index) => {
        if (stateIndex > index) {
          return "-";
        } else {
          return "";
        }
      });
      console.log("markUpperTriangularCells cells at i: ", i, cells);
      console.log({
        ...row,
        // mark Dash to only those cells of each row for whom cell value is not empty i.e., marked Dash
        ...cells.reduce((acc, cell, index) => {
          if (cell !== "") {
            acc[`cell-${stateNames[index]}`] = cell;
          }
          return acc;
        }, {}),
      });
      return {
        ...row,
        // mark Dash to only those cells of each row for whom cell value is not empty i.e., marked Dash
        ...cells.reduce((acc, cell, index) => {
          if (cell !== "") {
            acc[`cell-${stateNames[index]}`] = cell;
          }
          return acc;
        }, {}),
      };
    });
  };

  const getStatesToBeHighlighted = (rows: any[]) => {
    console.log("getStatesToBeHighlighted");
    const stateNames = dataContext.rows.map((row) => row.state);

    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < stateNames.length; j++) {
        if (i < j && rows[i][`cell-${stateNames[j]}`] === "") {
          return [stateNames[i], stateNames[j]];
        }
      }
    }
  };

  const getExplanation = () => {
    if (statesToHighlight.length > 0) {
      const [state1, state2] = statesToHighlight;
      const row1 = dataContext.rows.find((row) => row.state === state1);
      const row2 = dataContext.rows.find((row) => row.state === state2);
      const state1Status = row1.isFinal ? "final" : "";
      const state2Status = row2.isFinal ? "final" : "";
      const result =
        state1Status === "final" && state2Status === "final"
          ? "✓"
          : (state1Status === "final" && state2Status === "") ||
            (state1Status === "" && state2Status === "final")
          ? "✕"
          : "Empty";

      return (
        "As " +
        state1 +
        " is " +
        state1Status +
        " and " +
        state2 +
        " is " +
        state2Status +
        ".So,  " +
        result
      );
    }
    return "";
  };

  const markLowerTriangularCells = (rows: any[]) => {
    console.log("markLowerTriangularCells");

    if (animationStep === null) {
      // highlight states in original transition table in sidebar
      console.log("mergeTable handleUpdateData animationStep is null");
      console.log("setStatesToHighlight", getStatesToBeHighlighted(rows));
      setStatesToHighlight(getStatesToBeHighlighted(rows));
      setColumnName(columnNames[columnIndex]);
      // setDisplayStep(true);
      setAnimationStep(false);
    } else if (animationStep === false) {
      // show explanation of highlighted cells
      console.log("mergeTable handleUpdateData animationStep is false");
      console.log("animationStep === false: columnIndex", columnIndex);
      if (columnIndex === columnNames.length - 1) setAnimationStep(true);
      else {
        setOpenSnackbar(true);
        columnIndex += 1;
        setAnimationStep(null);
      }
      setStatesToHighlight([]); // reset for next iteration
      // setDisplayStep(true);
    } else if (animationStep === true) {
      // markLowerTriangularCells
      console.log("mergeTable handleUpdateData animationStep is true");
      // setDisplayStep(true);
      setAnimationStep(null);
    }

    // const stateNames = dataContext.rows.map((row) => row.state);
    // return rows.map((row, i) => {
    //   const stateIndex = stateNames.indexOf(row.state);
    //   const cells = stateNames.map((state, index) => {
    //     if (stateIndex < index) {
    //       row1ToHighlight = dataContext.rows.find(
    //         (r) => r.state === stateNames[stateIndex]
    //       );
    //       row2ToHighlight = dataContext.rows.find(
    //         (r) => r.state === stateNames[index]
    //       );
    //       statesToHighlight = [stateNames[stateIndex], stateNames[index]];
    //       return "✕";
    //     } else {
    //       return "";
    //     }
    //   });
    //   console.log("markLowerTriangularCells cells at i: ", i, cells);
    //   console.log({
    //     ...row,
    //     // mark Dash to only those cells of each row for whom cell value is not empty i.e., marked Dash
    //     ...cells.reduce((acc, cell, index) => {
    //       if (cell !== "") {
    //         acc[`cell-${stateNames[index]}`] = cell;
    //       }
    //       return acc;
    //     }, {}),
    //   });
    //   return {
    //     ...row,
    //     // mark Dash to only those cells of each row for whom cell value is not empty i.e., marked Dash
    //     ...cells.reduce((acc, cell, index) => {
    //       if (cell !== "") {
    //         acc[`cell-${stateNames[index]}`] = cell;
    //       }
    //       return acc;
    //     }, {}),
    //   };
    // });
  };

  const renderCell = (params: GridRenderCellParams<string>) => {
    console.log("MergeTable renderCell, params: ", params);
    const { id, field, value } = params;

    // mark diagonal entries as Tick
    if (field?.replace("cell-", "") === params.row.state) {
      return <CheckIcon />;
    }
    // mark uppeer triangular entries as Cross
    if (
      (displayStep as any) !== null &&
      field?.replace("cell-", "") < params.row.state
    ) {
      return <MinimizeRoundedIcon fontSize="small" />;
    }
    // mark lower triangular entries
    if (displayStep) {
      return "ok";
    } else return "";
  };

  const handleDurationChange = (event: SelectChangeEvent) => {
    console.log(
      "MergeTable handleDurationChange, event.target.value, duration: ",
      event.target.value,
      duration
    );
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    console.log("MergeTable handleAnimation");
    if (isComplete) {
      // when replay button is clicked, null clossure component is re rendered
      // so, modified transition table AND resultant dfa are made hidden until animation is completed
      // because modified transition table and resultant dfa are dependent on null closure table
      setIsReady(false);
      setIsComplete(false);
      setIsPlaying(true);
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    console.log("MergeTable show next row");
    if (isComplete) {
      setIsReady(true);
      // props.setCompletedMergeTableRows(mergeTableRows);
      props.setIsMergeTableComplete(true);
    }

    handleUpdateData();

    if (mergeTableRows.every((row) => row.state !== "")) {
      setIsComplete(true);
      setIsPlaying(false);
    }
  };

  const transitionTableProps: ToolsTransitionTableProps = {
    rows: dataContext.rows.map((row) => {
      return {
        ...row,
        ...Object.fromEntries(
          PossibleTransitionValues.concat("state").map((key) => [
            key === "^" ? "nul" : key,
            row[key === "^" ? "nul" : key]
              .toString()
              .split(" ")
              .filter((key) => key !== "")
              .map((tv) => tv.replace("mt", ""))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),

    columns: dataContext.columns
      .filter((col) => col.field !== "action" && col.field !== "nul")
      .map((col) => {
        return {
          ...col,
          editable: false,
        };
      }),

    statesToHighlight: statesToHighlight,
    columnName: columnName,
  };

  const playgroundProps: ToolsPlaygroundProps = {
    states: dataContext.states.map((state) => {
      return {
        ...state,
        id: `${state.id}mt`,
      };
    }),

    transitions: dataContext.transitions.map((transition) => {
      return {
        ...transition,
        props: {
          ...transition.props,
          start: `${transition.props.start}mt`,
          end: `${transition.props.end}mt`,
        },
      };
    }),
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={duration * 1000}
          onClose={handleSnackbarClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="info"
            sx={{ width: "100%" }}
          >
            {getExplanation()}
          </Alert>
        </Snackbar>

        <AppBar open={open}>
          <Toolbar>
            <IconButton
              color="secondary"
              aria-label="open transition table"
              onClick={handleTableOpen}
              edge="start"
              sx={{
                ...(open === 1 && { mr: 2, display: "none" }),
              }}
            >
              <TableChartOutlinedIcon />
            </IconButton>
            <Typography
              noWrap
              variant="h5"
              component="div"
              fontWeight={"bold"}
              color={"black"}
            >
              Merge Table
            </Typography>
            <IconButton
              color="secondary"
              aria-label="open drawer"
              edge="end"
              onClick={handleDfaOpen}
              sx={{
                display: { xs: "none", md: "none", lg: "block" },
                marginTop: { lg: "8px" },
                ...(open === 2 && { display: "none" }),
              }}
            >
              <AccountTreeOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              position: "relative",
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#f5f5f5",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open === 1}
        >
          <DrawerHeader
            sx={{
              justifyContent: "flex-end",
              backgroundColor: "rgb(200, 200, 200)",
              boxShadow:
                "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
            }}
          >
            <Typography
              noWrap
              variant="overline"
              align="center"
              fontWeight={"bold"}
            >
              Transition Table
            </Typography>
            <IconButton onClick={handleTableClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Box
            sx={{
              marginTop: "40%",
            }}
          >
            <ToolsTransitionTable {...transitionTableProps} />
          </Box>
        </Drawer>

        <Main open={open}>
          <DrawerHeader />
          <Grid container>
            {/* Grid for Add a Row button and Tools */}
            <Grid item alignItems={"center"} xs={12}>
              <ButtonGroup
                disableElevation
                fullWidth
                variant="outlined"
                size="large"
              >
                <FormControl fullWidth>
                  <InputLabel id="delay-select-label">Delay</InputLabel>
                  <Select
                    labelId="delay-select-label"
                    id="delay-select"
                    value={duration.toString()}
                    label="Delay"
                    onChange={handleDurationChange}
                  >
                    {AnimationDurationOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  onClick={handleAnimation}
                  startIcon={
                    isPlaying ? (
                      <PauseRoundedIcon />
                    ) : isComplete ? (
                      <ReplayRoundedIcon />
                    ) : (
                      <PlayArrowRoundedIcon />
                    )
                  }
                >
                  {isPlaying ? "Pause" : isComplete ? "Replay" : "Play"}
                </Button>
                <Button
                  variant={isComplete ? "contained" : "outlined"}
                  onClick={showNextRow}
                  disabled={isReady}
                >
                  {isComplete ? "Complete" : "Next"}
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <DataGrid
                rows={mergeTableRows}
                columns={mergeTableColumns}
                autoHeight
                hideFooter
                pageSize={MaxNumberOfStates}
                // density="compact"
                // disableSelectionOnClick
                // experimentalFeatures={{ newEditingApi: true }}
              />
            </Grid>
          </Grid>
        </Main>

        <Drawer
          sx={{
            width: drawerWidth * 2,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              position: "relative",
              width: drawerWidth * 2,
              boxSizing: "border-box",
              backgroundColor: "#f5f5f5",
            },
          }}
          variant="persistent"
          anchor="right"
          open={open === 2}
        >
          <DrawerHeader
            sx={{
              justifyContent: "flex-start",
              backgroundColor: "rgb(200, 200, 200)",
              boxShadow:
                "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
            }}
          >
            <IconButton onClick={handleDfaClose}>
              {theme.direction === "rtl" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
            <Typography
              noWrap
              variant="overline"
              align="center"
              fontWeight={"bold"}
            >
              Original DFA
            </Typography>
          </DrawerHeader>
          <Divider />
          {/* <Box
            sx={{
              marginTop: "40%",
            }}
          > */}
          <ToolsPlayground {...playgroundProps} />
          {/* </Box> */}
        </Drawer>
      </Box>
    </>
  );
};
