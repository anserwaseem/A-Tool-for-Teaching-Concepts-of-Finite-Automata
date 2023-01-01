import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { AnimationDurationOptions } from "../../../consts/AnimationDurationOptions";
import {
  RowModel,
  DraggableStateModel,
  TransitionModel,
} from "../../../models";
import { ToolsPlayground } from "../tools/Playground";
import { ToolsPlaygroundProps } from "../tools/props/PlaygroundProps";
import { ResultantDfaProps } from "./props/ResultantDfaProps";
import { ToolsTransitionTableProps } from "../tools/props/TransitionTableProps";
import { ToolsTransitionTable } from "../tools/TransitionTable";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { StyledTransitionLabel } from "../playground/StyledTransitionLabel";
import { DataContext } from "../../../components/Editor";
import {
  ModifiedTableStateId,
  NullClosureStateId,
  ResultantDfaStateId,
} from "../../../consts/StateIdsExtensions";
import { DrawerHeader } from "../../../common/DrawerHeader";
import { MainContent } from "../../../common/MainContent";
import { GetDrawerTransitionTableColumns } from "../../../utils/GetDrawerTransitionTableColumns";
import { GetDrawerTransitionTableRows } from "../../../utils/GetDrawerTransitionTableRows";
import { CustomAppBar } from "../../../common/CustomAppBar";
import { CustomDrawer } from "../../../common/CustomDrawer";
import { CustomAppBarProps } from "../../../common/props/CustomAppBarProps";
import { CustomDrawerProps } from "../../../common/props/CustomDrawerProps";
import { GenerateXYCoordinatesForNewState } from "../../../utils/GenerateXYCoordinatesForNewState";

const numberOfColumns = 3; // one for state, one for a and one for b
let index = numberOfColumns;
// increase this value by 1 by 1 when all states in availableStates object become False continuously (numberOfColumns times) otherwise reset it to 0,
// and set isComplete to true when this value becomes equal to the numberOfColumns
// indicating that all states in availableStates object have been processed
let noNewStateFound = 0;

export const ResultantDfa = (props: ResultantDfaProps) => {
  console.log("re rendering ResultantDfa, props", props);

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[3]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [resultantDfaRowId, setResultantDfaRowId] = useState(0);
  const [resultantDfaRows, setResultantDfaRows] = useState<RowModel[]>([]);
  const columns: GridColumns = [
    { field: "id", hide: true, hideable: false },
    {
      field: "state",
      headerName: "State",
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "a",
      headerName: "a",
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "b",
      headerName: "b",
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
    },
  ];
  const [resultantDfaStates, setResultantDfaStates] = useState<
    DraggableStateModel[]
  >([]);
  const [resultantDfaTransitions, setResultantDfaTransitions] = useState<
    TransitionModel[]
  >([]);

  // set initial states's null closure as the first state to process in DFA table
  const [availableStates, setAvailableStates] = useState([
    {
      name:
        props.rows.find((row) => row.isInitial)?.nul ?? // in case of no null closure, use state name itself
        props.rows.find((row) => row.isInitial)?.state ??
        "",
      isAvailable: true,
    },
  ]);

  const [pendingTransitions, setPendingTransitions] = useState<string[]>([]);

  const [open, setOpen] = useState(1);

  const [showExplanation, setShowExplanation] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (isPlaying) {
      let timer = setTimeout(() => {
        // if (!showExplanation) {
        const rowIndex = Math.floor(index / numberOfColumns);

        handleUpdateData(rowIndex);

        // stop if all rows have been displayed
        if (noNewStateFound === numberOfColumns) {
          setIsComplete(true);
          setIsPlaying(false);
          // handleExplanation();
        }
        index++;
        // } else handleExplanation();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [props, resultantDfaRows, isPlaying, showExplanation]);

  const handleUpdateData = (rowIndex: number) => {
    setResultantDfaRowId(rowIndex);

    if (availableStates.every((state) => !state.isAvailable))
      noNewStateFound += 1;
    else noNewStateFound = 0;

    if (noNewStateFound !== numberOfColumns) {
      // add new row to resultantDfaRows
      if (index / rowIndex === numberOfColumns) {
        // find available state to process
        const stateToProcess = availableStates.find(
          (state) => state.isAvailable
        )?.name;

        if (stateToProcess) {
          // set state as unavailable
          setAvailableStates(
            availableStates.map((state) =>
              state.name === stateToProcess
                ? { ...state, isAvailable: false }
                : state
            )
          );

          setResultantDfaRows((resultantDfaRows) => [
            ...resultantDfaRows,
            {
              id: resultantDfaRows.length,
              state: stateToProcess,
              a: "",
              b: "",
              nul: "",
              isInitial:
                resultantDfaRows.length === 0 &&
                stateToProcess
                  .replaceAll(ResultantDfaStateId, "")
                  .split(", ")
                  .includes(
                    dataContext.rows.find((row) => row.isInitial).state
                  ),
              isFinal: stateToProcess
                .replaceAll(ResultantDfaStateId, "")
                .split(", ")
                .some((s) =>
                  dataContext.rows
                    .filter((row) => row.isFinal)
                    .map((row) => row.state)
                    .includes(s)
                ),
            },
          ]);

          // add new state to resultantDfaStates
          const { x, y } = GenerateXYCoordinatesForNewState(
            resultantDfaStates,
            props.playgroundSize
          );
          setResultantDfaStates((resultantDfaStates) => [
            ...resultantDfaStates,
            {
              id: stateToProcess,
              x: x,
              y: y,
            },
          ]);

          // add new transitions to resultantDfaTransitions
          if (pendingTransitions.includes(stateToProcess)) {
            // find all rows that have stateToProcess as their value
            const rowsHavingPendingTransitions = resultantDfaRows.filter(
              (row) =>
                PossibleTransitionValues.filter((k) => k !== "^").some(
                  (k) => row[k] === stateToProcess
                )
            );

            const newTransitions: TransitionModel[] = [];

            rowsHavingPendingTransitions.forEach((row) => {
              PossibleTransitionValues.filter((k) => k !== "^").forEach((k) => {
                if (row[k].toString() === stateToProcess) {
                  const isSelfTransition = row.state === stateToProcess;
                  newTransitions.push({
                    labels: <StyledTransitionLabel label={k} />,
                    value: k,
                    start: row.state,
                    end: stateToProcess,
                    animateDrawing: true,
                    _extendSVGcanvas: isSelfTransition ? 25 : 0,
                    _cpx1Offset: isSelfTransition ? -50 : 0,
                    _cpy1Offset: isSelfTransition ? -50 : 0,
                    _cpx2Offset: isSelfTransition ? 50 : 0,
                    _cpy2Offset: isSelfTransition ? -50 : 0,
                  });
                }
              });
            });

            setResultantDfaTransitions((transitions) => [
              ...transitions,
              ...newTransitions,
            ]);

            setPendingTransitions(
              pendingTransitions.filter(
                (transition) => transition !== stateToProcess
              )
            );
          }
        }
      }

      // update resultantDfaRows
      else {
        let state: string, a: string, b: string;

        setResultantDfaRows((rows) =>
          rows.map((row, mapIndex) => {
            state = row.state;

            a =
              rowIndex - 1 === mapIndex // is last row?
                ? ((index - 1) % rowIndex === 0 &&
                    index !== 3 &&
                    index !== 6) ||
                  // b condition
                  index === 5 ||
                  ((index - 1) % rowIndex === 1 &&
                    index !== 3 &&
                    index !== 4 &&
                    index !== 6)
                  ? Array.from(
                      new Set(
                        row.state // replace each state name with its corresponding nul closure
                          ?.split(", ")
                          ?.filter((tv) => tv !== "")
                          ?.map((tv) =>
                            tv?.replace(
                              tv,
                              props.rows.find((r) => r.state === tv)?.a ?? tv
                            )
                          )
                          ?.filter((tv) => tv !== "")
                          ?.join(", ")
                          ?.split(", ")
                      ) // remove duplicates
                    )
                      ?.sort()
                      ?.join(", ") ?? ""
                  : ""
                : row.a;

            if (
              rowIndex - 1 === mapIndex && // is last row?
              a === ""
            )
              a = "Φ";

            // insert a value in availableStates object if it is not already present and set isAvailable to true
            if (a !== "" && !availableStates.find((as) => as.name === a))
              setAvailableStates((availableStates) => {
                const newAvailableStates = [...availableStates];
                newAvailableStates.push({ name: a, isAvailable: true });
                return newAvailableStates;
              });

            b =
              rowIndex - 1 === mapIndex // is last row?
                ? index === 5 ||
                  ((index - 1) % rowIndex === 1 &&
                    index !== 3 &&
                    index !== 4 &&
                    index !== 6)
                  ? Array.from(
                      new Set(
                        row.state // replace each state name with its corresponding nul closure
                          ?.split(", ")
                          ?.filter((tv) => tv !== "")
                          ?.map((tv) =>
                            tv?.replace(
                              tv,
                              props.rows.find((r) => r.state === tv)?.b ?? tv
                            )
                          )
                          ?.filter((tv) => tv !== "")
                          ?.join(", ")
                          ?.split(", ")
                      ) // remove duplicates
                    )
                      ?.sort()
                      ?.join(", ") ?? ""
                  : ""
                : row.b;

            if (
              rowIndex - 1 === mapIndex && // is last row?
              index % numberOfColumns === numberOfColumns - 1 && // is it turn of b column to be filled?
              b === ""
            )
              b = "Φ";

            // insert b value in availableStates object if it is not already present and set isAvailable to true
            if (b !== "" && !availableStates.find((as) => as.name === b))
              setAvailableStates((availableStates) => {
                const newAvailableStates = [...availableStates];
                newAvailableStates.push({ name: b, isAvailable: true });
                return newAvailableStates;
              });

            return {
              ...row,
              a: a,
              b: b,
            };
          })
        );

        // update resultantDfaTransitions
        const updatedColumn =
          (index - 1) / numberOfColumns === rowIndex ? "a" : "b"; // check which column has just been updated
        const updatedValue = (index - 1) / numberOfColumns === rowIndex ? a : b; // check either a or b is added in rows, and use that value to update transitions

        // check if updatedValue is present as a state in any row
        if (
          resultantDfaRows?.map((row) => row?.state)?.includes(updatedValue)
        ) {
          // if transition already exits, append its value
          if (
            resultantDfaTransitions.find(
              (t) => t.start === state && t.end === updatedValue
            )
          )
            setResultantDfaTransitions((transitions) =>
              transitions.map((t) => {
                if (t.start === state && t.end === updatedValue) {
                  return {
                    ...t,
                    labels: (
                      <StyledTransitionLabel label={t.value + updatedColumn} />
                    ),
                    value: t.value + updatedColumn,
                  };
                } else return t;
              })
            );
          // else, add new transition
          else {
            let isSelfTransition = false;
            if (state === a || state === b) isSelfTransition = true;
            setResultantDfaTransitions((transitions: TransitionModel[]) => [
              ...transitions,
              {
                labels: <StyledTransitionLabel label={updatedColumn} />,
                value: updatedColumn,
                start: state,
                end: updatedValue,
                animateDrawing: true,
                _extendSVGcanvas: isSelfTransition ? 25 : 0,
                _cpx1Offset: isSelfTransition ? -50 : 0,
                _cpy1Offset: isSelfTransition ? -50 : 0,
                _cpx2Offset: isSelfTransition ? 50 : 0,
                _cpy2Offset: isSelfTransition ? -50 : 0,
              },
            ]);
          }
        }
        // check if updatedValue is already present in dfaResultantRows states, if not, add it to pendingTransitions
        else if (
          !resultantDfaRows.map((row) => row?.state).includes(updatedValue)
        )
          setPendingTransitions([...pendingTransitions, updatedValue]);
      }
    }

    // setShowExplanation(true);
  };

  const handleExplanation = () => {
    if (index % numberOfColumns === 1)
      setSnackbarMessage(
        index - numberOfColumns === 1
          ? `Null closure of initial state becomes the initial state of resultant DFA i.e., ${dataContext.modifiedTableRows?.[0]?.nul?.replaceAll(
              ModifiedTableStateId,
              ""
            )} `
          : `Added state ${resultantDfaRows?.[
              resultantDfaRowId - 1
            ]?.state?.replaceAll(ResultantDfaStateId, "")}.`
      );
    else if (index % numberOfColumns === 2)
      setSnackbarMessage(
        resultantDfaRows?.[resultantDfaRowId - 1]?.a !== "Φ"
          ? "Taken " +
              (resultantDfaRows?.[resultantDfaRowId - 1]?.state?.split(", ")
                ?.length > 1
                ? "union of "
                : "") +
              "[a] transitions of state" +
              (resultantDfaRows?.[resultantDfaRowId - 1]?.state?.split(", ")
                ?.length > 1
                ? "s"
                : "") +
              ` ${resultantDfaRows?.[resultantDfaRowId - 1]?.state?.replaceAll(
                ResultantDfaStateId,
                ""
              )} from Modified Table.`
          : "Added phi transition as no [a] transition is available for state" +
              (resultantDfaRows?.[resultantDfaRowId - 1]?.state?.split(", ")
                ?.length > 1
                ? "s"
                : "") +
              ` ${resultantDfaRows?.[resultantDfaRowId - 1]?.state?.replaceAll(
                ResultantDfaStateId,
                ""
              )} in Modified Table.`
      );
    else
      setSnackbarMessage(
        resultantDfaRows?.[resultantDfaRowId - 1]?.b !== "Φ"
          ? "Taken " +
              (resultantDfaRows?.[resultantDfaRowId - 1]?.state?.split(", ")
                ?.length > 1
                ? "union of "
                : "") +
              "[b] transitions of state" +
              (resultantDfaRows?.[resultantDfaRowId - 1]?.state?.split(", ")
                ?.length > 1
                ? "s"
                : "") +
              ` ${resultantDfaRows?.[resultantDfaRowId - 1]?.state?.replaceAll(
                ResultantDfaStateId,
                ""
              )} from Modified Table.`
          : "Added phi transition as no [b] transition is available for state" +
              (resultantDfaRows?.[resultantDfaRowId - 1]?.state?.split(", ")
                ?.length > 1
                ? "s"
                : "") +
              ` ${resultantDfaRows?.[resultantDfaRowId - 1]?.state?.replaceAll(
                ResultantDfaStateId,
                ""
              )} in Modified Table.`
      );

    setOpenSnackbar(true);
    setShowExplanation(false);
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

  const handleDurationChange = (event: SelectChangeEvent) => {
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    if (isComplete) {
      // if animation is complete, reset everything i.e., replay
      setIsReady(false);
      setIsComplete(false);
      index = numberOfColumns;
      setIsPlaying(true);
      setResultantDfaRowId(0);
      setResultantDfaRows([]);
      setResultantDfaStates([]);
      setResultantDfaTransitions([]);
      setPendingTransitions([]);
      setAvailableStates([
        {
          name:
            props?.rows?.find((row) => row.isInitial)?.nul ?? // in case of no null closure, use state name itself
            props?.rows?.find((row) => row.isInitial)?.state ??
            "",
          isAvailable: true,
        },
      ]);
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    // if (!showExplanation) {
    const rowIndex = Math.floor(index / numberOfColumns);
    if (isComplete) {
      setIsReady(true);
      props.setIsResultantDfaComplete(true);
    }

    handleUpdateData(rowIndex);

    // stop if all rows have been displayed
    if (noNewStateFound === numberOfColumns) {
      setIsComplete(true);
      setIsPlaying(false);
      // handleExplanation();
    }
    index++;
    // } else handleExplanation();
  };

  const transitionTableProps: ToolsTransitionTableProps = {
    rows: resultantDfaRows.map((row) => {
      return {
        ...row,
        ...Object.fromEntries(
          PossibleTransitionValues.concat("state").map((key) => [
            key === "^" ? "nul" : key,
            row[key === "^" ? "nul" : key]
              .toString()
              .split(" ")
              .filter((key) => key !== "")
              .map((tv) => tv.replace(ResultantDfaStateId, ""))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),
    columns: columns,
  };

  const playgroundProps: ToolsPlaygroundProps = {
    states: resultantDfaStates,
    transitions: resultantDfaTransitions,
    setTransitions: setResultantDfaTransitions,
    stateSize: props.stateSize,
  };

  const customAppBarProps: CustomAppBarProps = {
    showRightIcon: true,
    open,
    setOpen,
    title: "Resultant DFA",
  };

  const leftDrawerProps: CustomDrawerProps = {
    isLeft: true,
    open,
    setOpen,
    title: "Modified Table",
    transitionTableProps: {
      rows: GetDrawerTransitionTableRows(
        dataContext.modifiedTableRows,
        ModifiedTableStateId
      ),
      columns: GetDrawerTransitionTableColumns(dataContext.columns, ["nul"]),
    },
  };

  const rightDrawerProps: CustomDrawerProps = {
    isLeft: false,
    open,
    setOpen,
    title: "Null Closure Table",
    transitionTableProps: {
      rows: GetDrawerTransitionTableRows(
        dataContext.nullClosureRows,
        NullClosureStateId
      ),
      columns: GetDrawerTransitionTableColumns(dataContext.columns, ["a", "b"]),
    },
  };

  return (
    <Box sx={{ display: "flex", m: 1, mt: 5 }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={isPlaying ? duration * 1000 : duration * 1000 * 1000}
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
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <CustomAppBar {...customAppBarProps} />

      <CustomDrawer {...leftDrawerProps} />

      <MainContent open={open}>
        <DrawerHeader />
        {/* Grid to incorporate Transition table and Playground */}
        <Grid
          container
          columnSpacing={{
            xs: 1,
            sm: 2,
            md: 3,
          }}
          pt={1.6}
        >
          {/* Transition table grid */}
          <Grid item xs={12} md={4}>
            {/* Grid for Add a Row button and Tools */}
            <Grid container alignItems={"center"}>
              <Grid item xs={12}>
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
                {/* <AnimationController {...animationControllerProps} /> */}
              </Grid>
            </Grid>
            <ToolsTransitionTable {...transitionTableProps} />
          </Grid>
          {/* Playground grid */}
          <Grid item xs={12} md={8}>
            <ToolsPlayground {...playgroundProps} />
          </Grid>
        </Grid>
      </MainContent>

      <CustomDrawer {...rightDrawerProps} />
    </Box>
  );
};
