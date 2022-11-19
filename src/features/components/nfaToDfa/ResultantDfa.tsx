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
  Typography,
} from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { AnimationDurationOptions } from "../../../consts/AnimationDurationOptions";
import {
  RowModel,
  DraggableStateModel,
  TransitionModel,
} from "../../../models";
import { NfaToDfaPlayground } from "./Playground";
import { NfaToDfaPlaygroundProps } from "./props/PlaygroundProps";
import { ResultantDfaProps } from "./props/ResultantDfaProps";
import { NfaToDfaTransitionTableProps } from "./props/NfaToDfaTransitionTableProps";
import { NfaToDfaTransitionTable } from "./TransitionTable";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { StyledTransitionLabel } from "../playground/StyledTransitionLabel";

const numberOfColumns = 3; // one for state, one for a and one for b
let index = numberOfColumns;
// increase this value by 1 by 1 when all states in availableStates object become False continuously otherwise rest it to 0,
// and set isComplete to true when this value becomes equal to the numberOfColumns
// indicating that all states in availableStates object have been processed
let noNewStateFound = 0;

export const ResultantDfa = (props: ResultantDfaProps) => {
  console.log("re rendering ResultantDfa, props", props);
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

        handleUpdateData(
          rowIndex,
          // props.rows.slice(0, rowIndex),
          props.states.slice(0, rowIndex),
          props.transitions
        );

        console.log(
          "after handleUpdateData complete, noNewStateFound: ",
          noNewStateFound
        );
        if (noNewStateFound === numberOfColumns) {
          setIsComplete(true);
          setIsPlaying(false);
        } else index++;
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [props, resultantDfaRows, isPlaying]);

  const handleUpdateData = (
    rowIndex: number,
    // rows: RowModel[],
    states: DraggableStateModel[],
    transitions: TransitionModel[]
  ) => {
    console.log(
      "ResultantDfa handleUpdateData, index, rowIndex, props.rows: ",
      index,
      rowIndex,
      props.rows
    );

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
      setResultantDfaRowId(rowIndex);

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
              isInitial: false,
              isFinal: false,
            },
          ]);

          // add new state to resultantDfaStates
          setResultantDfaStates((resultantDfaStates) => [
            ...resultantDfaStates,
            {
              id: stateToProcess,
              x: Math.floor(Math.random() * props.editorPlaygroundSize.width),
              y: Math.floor(Math.random() * props.editorPlaygroundSize.height),
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

            rowsHavingPendingTransitions.forEach((row) => {
              PossibleTransitionValues.filter((k) => k !== "^").forEach((k) => {
                if (row[k].toString() === stateToProcess) {
                  console.log("row[k]: ", row[k]);
                  const isSelfTransition = row.state === stateToProcess;
                  setResultantDfaTransitions((transitions) => [
                    ...transitions,
                    {
                      props: {
                        labels: <StyledTransitionLabel label={k} />,
                        value: k,
                        start: row.state,
                        end: stateToProcess,
                        // dashness: { animation: 10 },
                        animateDrawing: true,
                        _extendSVGcanvas: isSelfTransition ? 25 : 0,
                        _cpx1Offset: isSelfTransition ? -50 : 0,
                        _cpy1Offset: isSelfTransition ? -50 : 0,
                        _cpx2Offset: isSelfTransition ? 50 : 0,
                        _cpy2Offset: isSelfTransition ? -50 : 0,
                      },
                    },
                  ]);
                }
              });
            });
            
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
        const transitionColumn = a !== "" && b === "" ? "a" : "b"; // check which column has just been updated
        const transitionValue = a !== "" && b === "" ? a : b; // check either a or b is added in rows, and use that value to update transitions
        if (
          resultantDfaRows
            ?.map((row) => row?.state) // check if transitionValue is present as a state in any row
            ?.includes(transitionValue)
        ) {
          // if transition already exits, append its value
          if (
            transitions.find(
              (t) => t.props.start === state && t.props.end === transitionValue
            )
          ) {
            return transitions.map((t) => {
              if (t.props.start === state && t.props.end === transitionValue) {
                return {
                  ...t,
                  props: {
                    ...t.props,
                    labels: (
                      <StyledTransitionLabel
                        label={t.props.value + transitionColumn}
                      />
                    ),
                    value: t.props.value + transitionColumn,
                  },
                };
              } else return t;
            });
          }
          // else, add new transition
          else {
            let isSelfTransition = false;
            if (state === a || state === b) isSelfTransition = true;
            setResultantDfaTransitions((transitions: TransitionModel[]) => [
              ...transitions,
              {
                props: {
                  labels: <StyledTransitionLabel label={transitionColumn} />,
                  value: transitionColumn,
                  start: state,
                  end: transitionValue,
                  // dashness: { animation: 10 },
                  animateDrawing: true,
                  _extendSVGcanvas: isSelfTransition ? 25 : 0,
                  _cpx1Offset: isSelfTransition ? -50 : 0,
                  _cpy1Offset: isSelfTransition ? -50 : 0,
                  _cpx2Offset: isSelfTransition ? 50 : 0,
                  _cpy2Offset: isSelfTransition ? -50 : 0,
                },
              },
            ]);
          }
        } else setPendingTransitions([...pendingTransitions, transitionValue]);
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
      // when replay button is clicked, null clossure component is re rendered
      // so, modified transition table AND resultant dfa are made hidden until animation is completed
      // because modified transition table and resultant dfa are dependent on null closure table
      setIsReady(false);
      setIsComplete(false);
      index = 1;
      setIsPlaying(true);
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    console.log("ResultantDfa show next row, index: ", index);
    const rowIndex = Math.floor(index / numberOfColumns);
    if (isComplete) {
      setIsReady(true);
      props.setIsResultantDfaComplete(true);
    }

    handleUpdateData(
      rowIndex,
      // props.rows.slice(0, rowIndex),
      props.states.slice(0, rowIndex),
      props.transitions
    );

    // stop if all rows have been displayed i.e., if rowIndex equals rows length and last row's null column has been displayed
    if (noNewStateFound === numberOfColumns) {
      setIsComplete(true);
      setIsPlaying(false);
    } else index++;
  };

  const transitionTableProps: NfaToDfaTransitionTableProps = {
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
              .map((tv) => tv.replace("rd", ""))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),
    setRows: setResultantDfaRows,
    columns: columns,
    rowId: resultantDfaRowId,
    setRowId: setResultantDfaRowId,
  };

  const playgroundProps: NfaToDfaPlaygroundProps = {
    states: resultantDfaStates,
    setStates: setResultantDfaStates,
    transitions: resultantDfaTransitions,
    setTransitions: setResultantDfaTransitions,
    rows: resultantDfaRows,
    setRows: setResultantDfaRows,
  };

  return (
    <Box sx={{ flexGrow: 1, m: 1, mt: 5 }}>
      <Typography
        variant="h5"
        component="div"
        gutterBottom
        align="center"
        fontWeight={"bold"}
        bgcolor={"rgb(200, 200, 200)"}
      >
        DFA Table (use null closure of initial state to start)
      </Typography>
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
          <NfaToDfaTransitionTable
            handleAddRow={function (row: RowModel): void {
              throw new Error("Function not implemented.");
            }}
            {...transitionTableProps}
          />
        </Grid>
        {/* Playground grid */}
        <Grid item xs={12} md={8}>
          <NfaToDfaPlayground {...playgroundProps} />
        </Grid>
      </Grid>
    </Box>
  );
};
