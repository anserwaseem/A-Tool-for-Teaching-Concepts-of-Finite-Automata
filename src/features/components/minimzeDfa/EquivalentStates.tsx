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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { AnimationDurationOptions } from "../../../consts/AnimationDurationOptions";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import { EquivalentStatesProps } from "./props/EquivalentStatesProps";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { MaxNumberOfStates } from "../../../consts/MaxNumberOfStates";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { ToolsTransitionTableProps } from "../tools/props/TransitionTableProps";
import { ToolsTransitionTable } from "../tools/TransitionTable";
import { DataContext } from "../../../components/Editor";
import { GetBackgroundColor } from "../../../utils/GetBackgroundColor";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import DataArrayIcon from "@mui/icons-material/DataArray";
import { appBarBackgroundColor } from "../../../consts/Colors";

const drawerWidth = 200;
const columnNames = PossibleTransitionValues.filter((value) => value !== "^");
let columnIndex = 0;
let numberOfTicks = 0;

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

  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...(open === 1 && {
    marginLeft: 0,
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
  backgroundColor: appBarBackgroundColor,
  position: "absolute",

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
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const EquivalentStates = (props: EquivalentStatesProps) => {
  console.log("re rendering EquivalentStates, props: ", props);

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [equivalentStatesRows, setEquivalentStatesRows] = useState<any[]>([]);
  const [equivalentStatesColumns, SetEquivalentStatesColumns] = useState<
    GridColDef[]
  >([]);

  // 0 for filling diagonal cells only,
  // 1 for showing its explanation,
  // 2 for filling diagonal and upper triangular cells,
  // 3 for showing its explanation,
  // 4 for filling diagonal, upper triangular, and initial crosses in cells,
  // 5 for showing its explanation,
  // 6 for filling diagonal, upper triangular, initial crosses and lower triangular cells; lower triangular cells are filled using lowerTriangularStep variable
  const [displayStep, setDisplayStep] = useState<number>(0);

  // false for highlighting rows in original transition table and in equivalent states table,
  // true for showing its explanation
  const [lowerTriangularStep, setLowerTriangularStep] =
    useState<boolean>(false);
  const [statesToHighlight, setStatesToHighlight] = useState<string[]>([]);
  const [columnName, setColumnName] = useState<string>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // cells which would remain empty for current iteration
  const [emptyCells, setEmptyCells] = useState<string[][]>([]);
  const [iteration, setIteration] = useState<number>(0);
  const [isIterationComplete, setIsIterationComplete] =
    useState<boolean>(false);
  const [emptyCellsOfPreviousIteration, setEmptyCellsOfPreviousIteration] =
    useState<string[][]>([]);

  const theme = useTheme();
  const [open, setOpen] = useState(1);

  const handleTableOpen = () => {
    setOpen(1);
  };

  const handleTableClose = () => {
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
    initializeRows();
  }, []);

  useEffect(() => {
    console.log(
      "EquivalentStates useEffect, isPlaying, duration: ",
      isPlaying,
      duration
    );
    if (isPlaying) {
      let timer = setTimeout(() => {
        console.log("inside set timeout");

        handleUpdateData();

        // stop if every cell is filled
        if (
          equivalentStatesRows.every((row) =>
            Object.values(row).every((cell) => cell !== "")
          )
        ) {
          setIsComplete(true);
          setIsPlaying(false);
        }
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [equivalentStatesRows, isPlaying, displayStep, lowerTriangularStep]);

  const handleUpdateData = () => {
    console.log("EquivalentStates handleUpdateData: stepNumber: ", displayStep);
    if (displayStep === 0) {
      console.log(
        "equivalentStates handleUpdateData displayStep is: ",
        displayStep
      );
      setEquivalentStatesRows(markDiagonalCells());
      setDisplayStep(1);
    } else if (displayStep === 1) {
      setEquivalentStatesRows(markDiagonalCells());
      setSnackbarMessage("Diagonal cells are marked with Tick.✓");
      setOpenSnackbar(true);
      setDisplayStep(2);
    } else if (displayStep === 2) {
      console.log(
        "equivalentStates handleUpdateData displayStep is: ",
        displayStep
      );
      setEquivalentStatesRows(markUpperTriangularCells(markDiagonalCells()));
      setDisplayStep(3);
    } else if (displayStep === 3) {
      setEquivalentStatesRows(markUpperTriangularCells(markDiagonalCells()));
      setSnackbarMessage("Upper triangular cells are marked with Dash.—");
      setOpenSnackbar(true);
      setDisplayStep(4);
    } else if (displayStep === 4) {
      console.log(
        "equivalentStates handleUpdateData displayStep is: ",
        displayStep
      );
      setEquivalentStatesRows(
        markInitialCrosses(markUpperTriangularCells(markDiagonalCells()))
      );
      setDisplayStep(5);
    } else if (displayStep === 5) {
      setEquivalentStatesRows(
        markInitialCrosses(markUpperTriangularCells(markDiagonalCells()))
      );
      setSnackbarMessage(
        "All cells having one Final and one Non Final state are marked with Cross.✕"
      );
      setOpenSnackbar(true);
      setDisplayStep(6);
    } else {
      console.log(
        "equivalentStates handleUpdateData displayStep is: ",
        displayStep
      );
      markLowerTriangularCells(
        markInitialCrosses(markUpperTriangularCells(markDiagonalCells()))
      );
    }
  };

  const initializeRows = () => {
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

      SetEquivalentStatesColumns(columns);
      setEquivalentStatesRows(rows);
    }
  };

  const markDiagonalCells = () => {
    console.log("markDiagonalCells");
    return equivalentStatesRows.map((row) => {
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
          if (r.isFinal && !dataContext.rows[stateIndex].isFinal) {
            return "✕";
          } else if (!r.isFinal && dataContext.rows[stateIndex].isFinal) {
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
        console.log(
          "getStatesToBeHighlighted rows[i][`cell-${stateNames[j]}`]: ",
          emptyCells,
          rows[i][`cell-${stateNames[j]}`]
        );
        if (
          i < j &&
          rows[i][`cell-${stateNames[j]}`] === "" &&
          !emptyCells?.some((cell) =>
            cell?.every((c) => c === stateNames[i] || c === stateNames[j])
          )
        ) {
          return [stateNames[i], stateNames[j]];
        }
      }
    }
  };

  function getExplanation(result: string) {
    if (
      statesToHighlight.length > 0 &&
      lowerTriangularStep &&
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

    if (!lowerTriangularStep) {
      // highlight states in original transition table in sidebar
      console.log(
        "equivalentStates handleUpdateData lowerTriangularStep is: ",
        lowerTriangularStep
      );
      console.log("setStatesToHighlight", getStatesToBeHighlighted(rows));
      setStatesToHighlight(getStatesToBeHighlighted(rows));
      setColumnName(columnNames[columnIndex]);
      setLowerTriangularStep(true);
    } else if (lowerTriangularStep) {
      // show explanation of highlighted cells
      console.log(
        "equivalentStates handleUpdateData lowerTriangularStep is: ",
        lowerTriangularStep
      );
      console.log("columnIndex", columnIndex);

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
      console.log(
        "cellValue: ",
        columnNames.length,
        cellValue,
        cellValue === ""
      );

      // paste Cross in the current cell whenever found (and move to the next cell)
      if (cellValue === "✕") {
        setCellValue(rows, cellValue);
      } else if (cellValue === "✓") {
        numberOfTicks++;
        if (
          columnIndex === columnNames.length - 1 &&
          numberOfTicks === columnNames.length
        ) {
          setCellValue(rows, cellValue);
        }
      }
      if (columnIndex === columnNames.length - 1 && cellValue !== "✕") {
        console.log("cellValue is empty");
        setEmptyCells((cells) =>
          cells === undefined
            ? [[...statesToHighlight]]
            : [...cells, [...statesToHighlight]]
        );
      }

      // if there is no further empty cell in rows, then reset emptyCells and set willThereBeNextIteration to false
      const searchIndex = rows.findIndex(
        (row) => row.state === statesToHighlight[0]
      );
      const rowsToCheck = rows.slice(searchIndex + 1);
      const isThereAnyEmptyCell = rowsToCheck.some((row) =>
        Object.keys(row).some((key) => row[key] === "")
      );
      console.log("isThereAnyEmptyCell: ", isThereAnyEmptyCell);

      setStatesToHighlight(getStatesToBeHighlighted(rows));
      setColumnName(columnNames[columnIndex]);
      setSnackbarMessage(getExplanation(cellValue));
      setOpenSnackbar(true);
      setIsIterationComplete(false);
      setLowerTriangularStep(false);

      if (columnIndex === columnNames.length - 1 && !isThereAnyEmptyCell) {
        if (
          emptyCellsOfPreviousIteration?.length > 0 &&
          JSON.stringify(emptyCellsOfPreviousIteration) ===
            JSON.stringify(emptyCells)
        ) {
          setSnackbarMessage(
            "Marking remaining empty cells as Tick as no new cell has been filled in this iteration."
          );

          // mark remaining empty cells as Tick
          const stateNames = dataContext.rows.map((row) => row.state);
          for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < stateNames.length; j++) {
              console.log(
                "getStatesToBeHighlighted rows[i][`cell-${stateNames[j]}`]: ",
                emptyCells,
                rows[i][`cell-${stateNames[j]}`]
              );
              if (rows[i][`cell-${stateNames[j]}`] === "") {
                rows[i][`cell-${stateNames[j]}`] = "✓";
              }
            }
          }
          setEquivalentStatesRows(rows);
        } else setEmptyCellsOfPreviousIteration(emptyCells);

        setEmptyCells([]);
        setIteration((it) => it + 1);
        setIsIterationComplete(true);
      }

      if (columnIndex === columnNames.length - 1 || cellValue === "✕") {
        columnIndex = 0;
        numberOfTicks = 0;
      } else columnIndex += 1;
    }
  };

  const setCellValue = (rows: any[], cellValue: string) => {
    setEquivalentStatesRows(
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
  };

  const handleDurationChange = (event: SelectChangeEvent) => {
    console.log(
      "EquivalentStates handleDurationChange, event.target.value, duration: ",
      event.target.value,
      duration
    );
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    console.log("EquivalentStates handleAnimation");
    if (isComplete) {
      // if animation is complete, reset everything i.e., replay
      setIsReady(false);
      setIsComplete(false);
      setIsPlaying(true);

      initializeRows();
      setDisplayStep(0);
      setLowerTriangularStep(false);
      setStatesToHighlight([]);
      setIteration(0);
      setIsIterationComplete(false);
    } else setIsPlaying((v) => !v);
  };

  const showNextStep = () => {
    console.log("EquivalentStates showNextStep");
    if (isComplete) {
      setIsReady(true);
      setOpenSnackbar(false);
      props.setIsEquivalentStatesFilled(true);
      props.setFilledEquivalentStatesRows(equivalentStatesRows);
    }

    handleUpdateData();

    // stop if every cell is filled
    if (
      equivalentStatesRows.every((row) =>
        Object.values(row).every((cell) => cell !== "")
      )
    ) {
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
              .map((tv) => tv.replace("est", ""))
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
            vertical: "bottom",
            horizontal: "center",
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
        {isIterationComplete && (
          <Snackbar
            open={openSnackbar}
            autoHideDuration={
              isPlaying ? duration * 1000 : duration * 1000 * 1000
            }
            onClose={handleSnackbarClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Alert onClose={handleSnackbarClose} sx={{ width: "100%" }}>
              {`Iteration ${iteration} completed.`}
            </Alert>
          </Snackbar>
        )}

        <AppBar open={open}>
          <Toolbar>
            <Grid container>
              <Grid item xs={5}>
                <IconButton
                  color="secondary"
                  aria-label="open transition table"
                  onClick={handleTableOpen}
                  // edge="start"
                  sx={{ ml: -1, ...(open === 1 && { mr: 2, display: "none" }) }}
                >
                  <TableChartOutlinedIcon />
                </IconButton>
              </Grid>
              <Grid item xs={7}>
                <Typography
                  noWrap
                  variant="h5"
                  fontWeight={"bold"}
                  color={"black"}
                  sx={{
                    ...(open === 0 && { mt: 0.5 }),
                  }}
                >
                  Equivalence States
                </Typography>
              </Grid>
            </Grid>
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
              justifyContent: "space-evenly",
              backgroundColor: appBarBackgroundColor,
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

        <Main open={open} sx={{ paddingBottom: 12 }}>
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
                  onClick={showNextStep}
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
                        theme.palette.mode,
                        0.75
                      )} !important`,
                  },
                  "& .super-app-theme--HighlightCurrentCell": {
                    bgcolor: (theme) =>
                      `${GetBackgroundColor(
                        "#00cc00",
                        theme.palette.mode,
                        0
                      )} !important`,
                  },
                }}
              >
                <DataGrid
                  rows={equivalentStatesRows}
                  columns={equivalentStatesColumns}
                  autoHeight
                  hideFooter
                  pageSize={MaxNumberOfStates}
                  // density="compact"
                  disableSelectionOnClick
                  getCellClassName={(params) => {
                    console.log("HighlightCurrentCell params: ", params);
                    return `super-app-theme--${
                      params && statesToHighlight?.length > 0
                        ? params?.field === "cell-" + statesToHighlight[1] &&
                          params?.row?.state === statesToHighlight[0]
                          ? "HighlightCurrentCell"
                          : dataContext &&
                            dataContext?.rows &&
                            dataContext?.rows?.length > 0
                          ? // if a cell is found in upper triangular region (i.e., it's value is Dash), then highlight the corresponding cell in lower triangular region
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
      </Box>
    </>
  );
};
