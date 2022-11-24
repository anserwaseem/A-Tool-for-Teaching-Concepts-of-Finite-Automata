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
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import DataArrayIcon from "@mui/icons-material/DataArray";
import { GetBackgroundColor } from "../../../utils/GetBackgroundColor";

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

  const [duration, setDuration] = useState(AnimationDurationOptions[4]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [mergeTableRows, setMergeTableRows] = useState<any[]>([]);
  const [mergeTableColumns, SetMergeTableColumns] = useState<GridColDef[]>([]);

  // 0 for filling diagonal cells only,
  // 1 for showing its explanation,
  // 2 for filling diagonal and upper triangular cells,
  // 3 for showing its explanation,
  // 4 for filling diagonal, upper triangular, and initial crosses in cells,
  // 5 for showing its explanation,
  // 6 for filling diagonal, upper triangular, initial crosses and lower triangular cells; lower triangular cells are filled using lowerTriangularStep variable
  const [displayStep, setDisplayStep] = useState<number>(0);

  // null for highlighting rows in original transition table,
  // false for showing explanation,
  // true for placing Tick/Cross in Merge Table
  const [lowerTriangularStep, setLowerTriangularStep] = useState<boolean>(null);
  const [statesToHighlight, setStatesToHighlight] = useState<string[]>([]);
  const [columnName, setColumnName] = useState<string>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const theme = useTheme();
  const [open, setOpen] = useState(1); // 1 for table open, 2 for dfa open, 0 for both close

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
              (cell) => cell === "✓" || cell === "✕" || cell === "—"
            )
          )
        ) {
          setIsComplete(true);
          setIsPlaying(false);
        }
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [
    dataContext.rows,
    mergeTableRows,
    isPlaying,
    displayStep,
    lowerTriangularStep,
  ]);

  const handleUpdateData = () => {
    console.log("MergeTable handleUpdateData: stepNumber: ", displayStep);
    if (displayStep === 0) {
      console.log("mergeTable handleUpdateData displayStep is: ", displayStep);
      setMergeTableRows(markDiagonalCells());
      setDisplayStep(1);
    } else if (displayStep === 1) {
      setMergeTableRows(markDiagonalCells());
      setSnackbarMessage("Diagonal cells are marked with Tick.✓");
      setOpenSnackbar(true);
      setDisplayStep(2);
    } else if (displayStep === 2) {
      console.log("mergeTable handleUpdateData displayStep is: ", displayStep);
      setMergeTableRows(markUpperTriangularCells(markDiagonalCells()));
      setDisplayStep(3);
    } else if (displayStep === 3) {
      setMergeTableRows(markUpperTriangularCells(markDiagonalCells()));
      setSnackbarMessage("Upper triangular cells are marked with Dash.—");
      setOpenSnackbar(true);
      setDisplayStep(4);
    } else if (displayStep === 4) {
      console.log("mergeTable handleUpdateData displayStep is: ", displayStep);
      setMergeTableRows(
        markInitialCrosses(markUpperTriangularCells(markDiagonalCells()))
      );
      setDisplayStep(5);
    } else if (displayStep === 5) {
      setMergeTableRows(
        markInitialCrosses(markUpperTriangularCells(markDiagonalCells()))
      );
      setSnackbarMessage(
        "All cells having one Final and one Non Final state are marked with Cross.✕"
      );
      setOpenSnackbar(true);
      setDisplayStep(6);
    } else {
      console.log("mergeTable handleUpdateData displayStep is: ", displayStep);
      markLowerTriangularCells(
        markInitialCrosses(markUpperTriangularCells(markDiagonalCells()))
      );
      //

      // setDisplayStep(null);
    }
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
          return "—";
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

  const markInitialCrosses = (rows: any[]) => {
    console.log("markInitialCrosses");
    // mark cross in the cells of each row for which one state is final and other is not
    return rows.map((row, i) => {
      const stateIndex = dataContext.rows.findIndex(
        (s) => s.state === row.state
      );
      const cells = dataContext.rows.map((r, index) => {
        if (stateIndex < index) {
          if (r.isFinal && !row.isFinal) {
            return "✕";
          } else if (!r.isFinal && row.isFinal) {
            return "✕";
          } else {
            return "";
          }
        } else {
          return "";
        }
      });
      console.log("markInitialCrosses cells at i: ", i, cells);
      return {
        ...row,
        ...cells.reduce((acc, cell, index) => {
          if (cell !== "") {
            acc[`cell-${dataContext.rows[index].state}`] = cell;
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

  function getExplanation(result: string) {
    if (
      statesToHighlight.length > 0 &&
      lowerTriangularStep === false &&
      columnName !== null
    ) {
      console.log("getExplanation statesToHighlight: ", statesToHighlight);
      const [state1, state2] = statesToHighlight;
      const state1ToCheck = dataContext.rows.find(
        (row) => row.state === state1
      )[columnName];
      const state2ToCheck = dataContext.rows.find(
        (row) => row.state === state2
      )[columnName];

      return (
        "As " +
        state1ToCheck +
        " " +
        state2ToCheck +
        " cell is " +
        (result === ""
          ? "Empty"
          : result === "✓"
          ? "Tick"
          : result === "✕"
          ? "Cross"
          : result) +
        "." +
        result
      );
    }
    return "";
  }

  const markLowerTriangularCells = (rows: any[]) => {
    console.log("markLowerTriangularCells");

    if (lowerTriangularStep === null) {
      // highlight states in original transition table in sidebar
      console.log("mergeTable handleUpdateData lowerTriangularStep is null");
      console.log("setStatesToHighlight", getStatesToBeHighlighted(rows));
      setStatesToHighlight(getStatesToBeHighlighted(rows));
      setColumnName(columnNames[columnIndex]);
      // setDisplayStep(true);
      setLowerTriangularStep(false);
    } else if (lowerTriangularStep === false) {
      // show explanation of highlighted cells
      console.log("mergeTable handleUpdateData lowerTriangularStep is false");
      console.log("lowerTriangularStep === false: columnIndex", columnIndex);

      const colValue = dataContext?.rows?.find(
        (row) => row.state === statesToHighlight[1]
      )[columnName];
      const rowValue = dataContext?.rows?.find(
        (row) => row.state === statesToHighlight[0]
      )[columnName];

      let row = rows.find((row) => row.state === rowValue);
      let cellValue = row[`cell-${colValue}`];
      if (cellValue === "—") {
        row = rows.find((row) => row.state === colValue);
        cellValue = row[`cell-${rowValue}`];
      }

      if (cellValue !== "") {
        setMergeTableRows(
          rows.map((row) => {
            if (row.state === statesToHighlight[0]) {
              return {
                ...row,
                [`cell-${statesToHighlight[1]}`]: cellValue,
              };
            }
            return row;
          })
        );
      }

      setStatesToHighlight(getStatesToBeHighlighted(rows));
      setColumnName(columnNames[columnIndex]);
      setSnackbarMessage(getExplanation(cellValue));
      setOpenSnackbar(true);

      if (columnIndex === columnNames.length - 1 || cellValue !== "") {
        columnIndex = 0;
      } else columnIndex += 1;
      setLowerTriangularStep(null);

      // setStatesToHighlight([]); // reset for next iteration
      // setDisplayStep(true);
    } else if (lowerTriangularStep === true) {
      // markLowerTriangularCells
      console.log("mergeTable handleUpdateData lowerTriangularStep is true");
      // setDisplayStep(true);
      setLowerTriangularStep(null);
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
          autoHideDuration={
            isPlaying ? duration * 1000 : duration * 1000 * 1000
          }
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
            icon={
              snackbarMessage?.at(-1) === "✓" ? (
                <CheckIcon fontSize="medium" />
              ) : snackbarMessage?.at(-1) === "✕" ? (
                <ClearIcon fontSize="medium" />
              ) : snackbarMessage?.at(-1) === "—" ? (
                <HorizontalRuleIcon fontSize="medium" />
              ) : (
                <DataArrayIcon fontSize="medium" />
              )
            }
          >
            {snackbarMessage.slice(0, -1)}
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
              <Box
                sx={{
                  "& .super-app-theme--HighlightPair": {
                    bgcolor: (theme) =>
                      `${GetBackgroundColor(
                        theme.palette.primary.light,
                        theme.palette.mode
                      )} !important`,
                  },
                  "& .super-app-theme--HighlightCurrentCell": {
                    bgcolor: (theme) =>
                      `${GetBackgroundColor(
                        theme.palette.error.light,
                        theme.palette.mode
                      )} !important`,
                  },
                }}
              >
                <DataGrid
                  rows={mergeTableRows}
                  columns={mergeTableColumns}
                  autoHeight
                  hideFooter
                  pageSize={MaxNumberOfStates}
                  // density="compact"
                  disableSelectionOnClick
                  getCellClassName={(params) => {
                    console.log("HighlightCurrentCell params: ", params);
                    return `super-app-theme--${
                      params
                        ? params?.field === "cell-" + statesToHighlight[1] &&
                          params?.row?.state === statesToHighlight[0]
                          ? "HighlightCurrentCell"
                          : dataContext &&
                            dataContext?.rows &&
                            dataContext?.rows?.length > 0 &&
                            statesToHighlight?.length > 0
                          ? // if a cell is found in upper triangular region (i., it's value is Dash), then highlight the corresponding cell in lower triangular region
                            params?.field ===
                              "cell-" +
                                dataContext?.rows?.find(
                                  (r) => r.state === statesToHighlight[1]
                                )[columnName] &&
                            params?.row?.state ===
                              dataContext?.rows?.find(
                                (r) => r.state === statesToHighlight[0]
                              )[columnName] &&
                            params?.value !== "—"
                            ? "HighlightPair"
                            : params?.field ===
                                "cell-" +
                                  dataContext?.rows?.find(
                                    (r) => r.state === statesToHighlight[0]
                                  )[columnName] &&
                              params?.row?.state ===
                                dataContext?.rows?.find(
                                  (r) => r.state === statesToHighlight[1]
                                )[columnName] &&
                              params?.value !== "—"
                            ? "HighlightPair"
                            : ""
                          : ""
                        : ""
                    }`;
                  }}
                />
              </Box>
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
