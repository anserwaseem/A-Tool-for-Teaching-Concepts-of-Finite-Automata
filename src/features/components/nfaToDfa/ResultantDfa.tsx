import { Box, Grid, SelectChangeEvent, Typography } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { AnimationDurationOptions } from "../../../consts/AnimationDurationOptions";
import { MaxNumberOfStates } from "../../../consts/MaxNumberOfStates";
import {
  RowModel,
  DraggableStateModel,
  TransitionModel,
} from "../../../models";
import { AnimationController } from "../tools/AnimationController";
import { AnimationControllerProps } from "../tools/props/AnimationControllerProps";
import { NfaToDfaPlayground } from "./Playground";
import { NfaToDfaPlaygroundProps } from "./props/PlaygroundProps";
import { ResultantDfaProps } from "./props/ResultantDfaProps";
import { NfaToDfaTransitionTableProps } from "./props/NfaToDfaTransitionTableProps";
import { NfaToDfaTransitionTable } from "./TransitionTable";

export const ResultantDfa = (props: ResultantDfaProps) => {
  const [duration, setDuration] = useState(AnimationDurationOptions[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const [resultantDfaRowId, setResultantDfaRowId] = useState(0);
  const [resultantDfaRows, setResultantDfaRows] = useState<RowModel[]>([]);
  const columns: GridColumns = [
    { field: "id", hide: true, hideable: false },
    {
      field: "state",
      headerName: "State",
      disableColumnMenu: true,
      sortable: false,
      width: 55,
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

  useEffect(() => {
    setResultantDfaRows(props.rows);
    // setResultantDfaStates(props.states);
    // setResultantDfaTransitions(props.transitions);
  }, [props]);

  const handleTimeChange = (event: SelectChangeEvent) => {
    setDuration(Number(event.target.value));
  };

  const handleAnimationPause = () => {
    console.log("ResultantDfa Pause");
    setIsPlaying(false);
  };

  const handleAnimationPlay = () => {
    console.log("ResultantDfa Play");
    setIsPlaying(true);
  };

  const animationControllerProps: AnimationControllerProps = {
    duration: duration,
    handleTimeChange: handleTimeChange,
    handleAnimationPause: handleAnimationPause,
    handleAnimationPlay: handleAnimationPlay,
    setIsComplete: setIsComplete,
  };

  const transitionTableProps: NfaToDfaTransitionTableProps = {
    rows: resultantDfaRows,
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
        DFA Table
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
              <AnimationController {...animationControllerProps} />
            </Grid>
          </Grid>
          <NfaToDfaTransitionTable handleAddRow={function (row: RowModel): void {
            throw new Error("Function not implemented.");
          } } {...transitionTableProps} />
        </Grid>
        {/* Playground grid */}
        <Grid item xs={12} md={8}>
          <NfaToDfaPlayground {...playgroundProps} />
        </Grid>
      </Grid>
    </Box>
  );
};
