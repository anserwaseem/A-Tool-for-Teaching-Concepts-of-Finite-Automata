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
import { NullClosureProps } from "./props/NullClosureProps";
import { ToolsPlaygroundProps } from "../tools/props/PlaygroundProps";
import { ToolsTransitionTableProps } from "../tools/props/TransitionTableProps";
import { ToolsTransitionTable } from "../tools/TransitionTable";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import { StyledTransitionLabel } from "../playground/StyledTransitionLabel";
import { NullCLosureStateId } from "../../../consts/StateIdsExtensions";
import { AppBarAndDrawer } from "../../../common/AppBarAndDrawer";
import { AppBarAndDrawerProps } from "../../../common/props/AppBarAndDrawerProps";
import { DrawerHeader } from "../../../common/DrawerHeader";
import { MainContent } from "../../../common/MainContent";
import { GetDrawerTransitionTableRows } from "../../../utils/GetDrawerTransitionTableRows";
import { GetDrawerTransitionTableColumns } from "../../../utils/GetDrawerTransitionTableColumns";
import { DataContext } from "../../../components/Editor";

const numberOfColumns = 2; // one for state and one for null
let index = numberOfColumns;

export const NullClosure = (props: NullClosureProps) => {
  console.log("re rendering NullClosure, props: ", props);

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [nullClosureRowId, setNullClosureRowId] = useState(0); // TODO why is this needed?
  const [nullClosureRows, setNullClosureRows] = useState<RowModel[]>([]);
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
      field: "nul",
      headerName: "null",
      disableColumnMenu: true,
      sortable: false,
      flex: 2,
    },
  ];
  const [nullClosureStates, setNullClosureStates] = useState<
    DraggableStateModel[]
  >([]);
  const [nullClosureTransitions, setNullClosureTransitions] = useState<
    TransitionModel[]
  >([]);

  const [open, setOpen] = useState(1);

  // populate props rows in null closure table one by one with null closure states and transitions according to specified duration and isPlaying
  useEffect(() => {
    console.log(
      "NullClosure useEffect, isPlaying, duration: ",
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
          rowIndex,
          props.rows.length
        );

        handleUpdateData(
          rowIndex,
          props.rows.slice(0, rowIndex),
          props.states.slice(0, rowIndex),
          props.transitions
        );

        // stop if all rows have been displayed i.e., if rowIndex equals rows length and last row's null column has been displayed
        // index === props.rows.length * numberOfColumns + props.states.length - 1;
        if (
          rowIndex === props.rows.length &&
          index % numberOfColumns === numberOfColumns - 1
        ) {
          setIsComplete(true);
          setIsPlaying(false);
        } else index++;
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [props, nullClosureRows, isPlaying]);

  const handleUpdateData = (
    rowIndex: number,
    rows: RowModel[],
    states: DraggableStateModel[],
    transitions: TransitionModel[]
  ) => {
    console.log(
      "handleUpdateData, rowIndex, index, rows: ",
      rowIndex,
      index,
      rows
    );
    setNullClosureRowId(rowIndex);
    // copy all null transitions for each row and paste them in the null column alongwith state name
    setNullClosureRows(
      rows.map((row, mapIndex) => {
        console.log("index, rowIndex, mapIndex: ", index, rowIndex, mapIndex);
        return {
          ...row,
          a: row.a.replaceAll(" ", ", "),
          b: row.b.replaceAll(" ", ", "),
          nul:
            // display null transitions for every row except the last row
            rowIndex - 1 === mapIndex && index % 2 === 0
              ? ""
              : Array.from(
                  new Set(
                    (
                      row.state +
                      (row.nul ? ", " + row.nul.split(" ").join(", ") : "")
                    ).split(", ")
                  )
                ).join(", "),
        };
      })
    );

    setNullClosureStates(states);
    setNullClosureTransitions(
      transitions
        .filter(
          (transition) =>
            transition.start !== transition.end && // no self transitions
            transition.value.includes("^") &&
            states.findIndex((state) => state.id === transition.start) !== -1 &&
            states.findIndex((state) => state.id === transition.end) !== -1
        )
        .map((transition) => {
          return {
            ...transition,
            labels: <StyledTransitionLabel label="^" />,
            value: "^",
          };
        })
    );
  };

  const handleDurationChange = (event: SelectChangeEvent) => {
    console.log(
      "NullClosure handleDurationChange, event.target.value, duration: ",
      event.target.value,
      duration
    );
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    console.log("NullClosure handleAnimation");
    if (isComplete) {
      // if animation is complete, reset everything i.e., replay
      setIsReady(false);
      setIsComplete(false);
      index = numberOfColumns;
      setIsPlaying(true);
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    console.log("NullClosure show next row, index: ", index);
    const rowIndex = Math.floor(index / numberOfColumns);
    if (isComplete) {
      setIsReady(true);
      props.setRows(nullClosureRows);
      props.setStates(nullClosureStates);
      props.setTransitions(nullClosureTransitions);
      props.setIsNullClosureTableComplete(true);
    }

    handleUpdateData(
      rowIndex,
      props.rows.slice(0, rowIndex),
      props.states.slice(0, rowIndex),
      props.transitions
    );

    // stop if all rows have been displayed i.e., if rowIndex equals rows length and last row's null column has been displayed
    if (rowIndex === props.rows.length && index % numberOfColumns !== 0) {
      setIsComplete(true);
      setIsPlaying(false);
    } else index++;
  };

  const transitionTableProps: ToolsTransitionTableProps = {
    rows: nullClosureRows.map((row) => {
      return {
        ...row,
        ...Object.fromEntries(
          PossibleTransitionValues.concat("state").map((key) => [
            key === "^" ? "nul" : key,
            row[key === "^" ? "nul" : key]
              .toString()
              .split(" ")
              .filter((key) => key !== "")
              .map((tv) => tv.replace(NullCLosureStateId, ""))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),
    columns: columns,
  };

  const playgroundProps: ToolsPlaygroundProps = {
    states: nullClosureStates,
    transitions: nullClosureTransitions,
    setTransitions: setNullClosureTransitions,
    stateSize: props.stateSize,
  };

  const appBarAndDrawerProps: AppBarAndDrawerProps = {
    title: "Null Closure",
    open,
    setOpen,
    transitionTableProps: {
      rows: GetDrawerTransitionTableRows(dataContext, NullCLosureStateId),
      columns: GetDrawerTransitionTableColumns(dataContext, false),
    },
  };

  return (
    <>
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
              <Grid container item xs={12} alignItems={"center"}>
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
              <ToolsTransitionTable {...transitionTableProps} />
            </Grid>
            {/* Playground grid */}
            <Grid item xs={12} md={8}>
              <ToolsPlayground {...playgroundProps} />
            </Grid>
          </Grid>
        </MainContent>
      </Box>
      {/* {isReady && <ModifiedTable {...modifiedTableProps} />} */}
    </>
  );
};
