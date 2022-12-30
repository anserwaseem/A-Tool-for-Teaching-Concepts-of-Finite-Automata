import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import { ResultantDfaStateId } from "../../../consts/StateIdsExtensions";
import { AppBarAndDrawer } from "../../../common/AppBarAndDrawer";
import { DrawerHeader } from "../../../common/DrawerHeader";
import { MainContent } from "../../../common/MainContent";
import { AppBarAndDrawerProps } from "../../../common/props/AppBarAndDrawerProps";
import { GetDrawerTransitionTableColumns } from "../../../utils/GetDrawerTransitionTableColumns";
import { GetDrawerTransitionTableRows } from "../../../utils/GetDrawerTransitionTableRows";

const numberOfColumns = 3; // one for state, one for a and one for b
let index = numberOfColumns;
// increase this value by 1 by 1 when all states in availableStates object become False continuously otherwise rest it to 0,
// and set isComplete to true when this value becomes equal to the numberOfColumns
// indicating that all states in availableStates object have been processed
let noNewStateFound = 0;

export const ResultantDfa = (props: ResultantDfaProps) => {
  console.log("re rendering ResultantDfa, props", props);

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[0]);
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

  const [open, setOpen] = useState(1);

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

  useEffect(() => {
    console.log(
      "ResultantDfa useEffect, isPlaying, duration: ",
      isPlaying,
      duration
    );
    if (isPlaying) {
      let timer = setTimeout(() => {
        console.log("inside set timeout, index", index);
        const rowIndex = Math.floor(index / numberOfColumns);

        console.log(
          "before handleUpdateData: index, rowIndex: ",
          index,
          rowIndex
        );

        handleUpdateData(rowIndex);
        console.log("pendingTransitions", pendingTransitions);

        console.log(
          "after handleUpdateData complete, noNewStateFound: ",
          noNewStateFound
        );

        // stop if all rows have been displayed i.e., if no new state has to be added in resultantDfaRows for consecutive numberOfColumns times
        if (noNewStateFound === numberOfColumns) {
          setIsComplete(true);
          setIsPlaying(false);
        } else index++;
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [props, resultantDfaRows, isPlaying]);

  const handleUpdateData = (rowIndex: number) => {
    console.log(
      "ResultantDfa handleUpdateData, index, rowIndex, props.rows: ",
      index,
      rowIndex,
      props.rows
    );
    setResultantDfaRowId(rowIndex);

    if (availableStates.every((state) => !state.isAvailable))
      noNewStateFound += 1;
    else noNewStateFound = 0;
    console.log(
      "inside handleUpdateData complete, noNewStateFound: ",
      noNewStateFound,
      "availableStates: ",
      availableStates,
      "\navailableStates.every((state) => !state.isAvailable): ",
      availableStates.every((state) => !state.isAvailable)
    );

    if (noNewStateFound !== numberOfColumns) {
      // add new row to resultantDfaRows
      if (index / rowIndex === numberOfColumns) {
        // find available state to process
        const stateToProcess = availableStates.find(
          (state) => state.isAvailable
        )?.name;
        console.log("stateToProcess: ", stateToProcess);
        if (stateToProcess) {
          // set state as unavailable
          setAvailableStates(
            availableStates.map((state) =>
              state.name === stateToProcess
                ? { ...state, isAvailable: false }
                : state
            )
          );

          console.log("adding new row in resultantDfaRows");
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
          setResultantDfaStates((resultantDfaStates) => [
            ...resultantDfaStates,
            {
              id: stateToProcess,
              x: Math.floor(Math.random() * props.playgroundSize.width),
              y: Math.floor(Math.random() * props.playgroundSize.height),
            },
          ]);

          // add new transitions to resultantDfaTransitions
          if (pendingTransitions.includes(stateToProcess)) {
            console.log("adding new transition in resultantDfaTransitions");

            // find all rows that have stateToProcess as their value
            const rowsHavingPendingTransitions = resultantDfaRows.filter(
              (row) =>
                PossibleTransitionValues.filter((k) => k !== "^").some(
                  (k) => row[k] === stateToProcess
                )
            );
            console.log(
              "rowsHavingPendingTransitions: ",
              rowsHavingPendingTransitions
            );

            const newTransitions: TransitionModel[] = [];

            rowsHavingPendingTransitions.forEach((row) => {
              PossibleTransitionValues.filter((k) => k !== "^").forEach((k) => {
                if (row[k].toString() === stateToProcess) {
                  console.log("row[k]: ", row[k]);
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
            console.log(
              "ResultantDfa index, rowIndex, mapIndex: ",
              index,
              rowIndex,
              mapIndex
            );

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
            console.log("a: ", a);
            // insert a value in availableStates object if it is not already present and set isAvailable to true
            if (a !== "" && !availableStates.find((as) => as.name === a)) {
              console.log("inside setAvailableStates a: ", a, availableStates);
              setAvailableStates((availableStates) => {
                const newAvailableStates = [...availableStates];
                newAvailableStates.push({ name: a, isAvailable: true });
                return newAvailableStates;
              });
            }

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
            console.log("b: ", b);
            // insert b value in availableStates object if it is not already present and set isAvailable to true
            if (b !== "" && !availableStates.find((as) => as.name === b)) {
              setAvailableStates((availableStates) => {
                console.log(
                  "inside setAvailableStates b: ",
                  b,
                  availableStates
                );
                const newAvailableStates = [...availableStates];
                newAvailableStates.push({ name: b, isAvailable: true });
                return newAvailableStates;
              });
            }

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

        if (
          resultantDfaRows
            ?.map((row) => row?.state) // check if updatedValue is present as a state in any row
            ?.includes(updatedValue)
        ) {
          // if transition already exits, append its value
          if (
            resultantDfaTransitions.find(
              (t) => t.start === state && t.end === updatedValue
            )
          ) {
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
          }
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
        } else {
          // check if updatedValue is already present in dfaResultantRows states, if not, add it to pendingTransitions
          if (
            !resultantDfaRows.map((row) => row?.state).includes(updatedValue)
          ) {
            setPendingTransitions([...pendingTransitions, updatedValue]);
          }
        }
      }
    }
  };

  const handleDurationChange = (event: SelectChangeEvent) => {
    console.log(
      "ResultantDfa handleDurationChange, event.target.value, duration: ",
      event.target.value,
      duration
    );
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    console.log("ResultantDfa handleAnimation");
    if (isComplete) {
      console.log("ResultantDfa handleAnimation isComplete");
      // if animation is complete, reset everything i.e., replay
      setIsReady(false);
      setIsComplete(false);
      index = numberOfColumns;
      setIsPlaying(true);
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
    console.log("ResultantDfa show next row, index: ", index);
    const rowIndex = Math.floor(index / numberOfColumns);
    if (isComplete) {
      setIsReady(true);
      props.setIsResultantDfaComplete(true);
    }

    handleUpdateData(rowIndex);

    // stop if all rows have been displayed i.e., if no new state has to be added in resultantDfaRows for consecutive numberOfColumns times
    if (noNewStateFound === numberOfColumns) {
      setIsComplete(true);
      setIsPlaying(false);
    } else index++;
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

  const appBarAndDrawerProps: AppBarAndDrawerProps = {
    title: "Resultant DFA",
    open,
    setOpen,
    transitionTableProps: {
      rows: GetDrawerTransitionTableRows(dataContext, ResultantDfaStateId),
      columns: GetDrawerTransitionTableColumns(dataContext, false),
    },
  };

  return (
    <Box sx={{ display: "flex", m: 1, mt: 5 }}>
      <AppBarAndDrawer {...appBarAndDrawerProps} />

      <MainContent open={open} sx={{ paddingBottom: 12 }}>
        <DrawerHeader />
        {/* Grid to incorporate Transition table and Playground */}
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
                  {/* <Button onClick={handleAnimationPause}>Pause</Button> */}
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
    </Box>
  );
};
