import { Box, Grid, SelectChangeEvent, Typography } from "@mui/material";
import { GridColumns, GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { AnimationTimeOptions } from "../../../consts/AnimationTimeOptions";
import { MaxNumberOfStates } from "../../../consts/MaxNumberOfStates";
import {
  RowModel,
  DraggableStateModel,
  TransitionModel,
} from "../../../models";
import { AnimationController } from "../tools/AnimationController";
import { AnimationControllerProps } from "../tools/props/AnimationControllerProps";
import { ModifiedTable } from "./ModifiedTable";
import { NfaToDfaPlayground } from "./Playground";
import { ModifiedTableProps } from "./props/ModifiedTable";
import { NullClosureProps } from "./props/NullClosureProps";
import { NfaToDfaPlaygroundProps } from "./props/PlaygroundProps";
import { NfaToDfaTransitionTableProps } from "./props/TransitionTableProps";
import { NfaToDfaTransitionTable } from "./TransitionTable";

let duration = AnimationTimeOptions[3];
let index = 1;

export const NullClosure = (props: NullClosureProps) => {
  console.log("re-rendering null closure, props: ", props);
  //   const [duration, setDuration] = useState(AnimationTimeOptions[1]);
  const [isPlaying, setIsPlaying] = useState(true);

  const [isComplete, setIsComplete] = useState(false);

  const [nullClosureRowId, setNullClosureRowId] = useState(0);
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

  // populate props rows in null closure table one by one with null closure states and transitions according to specified duration and isPlaying
  useEffect(() => {
    console.log(
      "null closure useEffect, isPlaying, duration: ",
      isPlaying,
      duration
    );
    if (isPlaying) {
      let timer = setTimeout(() => {
        console.log("inside set timeout, index", index);
        setNullClosureRowId(index);
        setNullClosureRows(props.rows.slice(0, index));
        setNullClosureStates(props.states.slice(0, index));
        setNullClosureTransitions(props.transitions.slice(0, index));

        if (index === props.rows.length) setIsPlaying(false);
        index++;
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [props, nullClosureRows]);

  //   useEffect(() => {
  //     setNullClosureRows(props.rows);
  //     setNullClosureStates(props.states);
  //     setNullClosureTransitions(props.transitions);
  //   }, [props]);

  const handleTimeChange = (event: SelectChangeEvent) => {
    console.log(
      "NullClosure handle time change, event.target.value, duration: ",
      event.target.value,
      duration
    );
    duration = Number(event.target.value);
  };

  const handleAnimationPause = () => {
    console.log("NullClosure Pause");
    setIsPlaying(false);
  };

  const handleAnimationPlay = () => {
    console.log("NullClosure Play");
    setIsPlaying(true);
  };

  const handleAddRow = (row: RowModel) => {
    if (nullClosureStates.length >= MaxNumberOfStates) {
      alert(`Maximum ${MaxNumberOfStates} states allowed`);
      return;
    }
    setNullClosureRows((prev) => [...prev, row]);
    setNullClosureRowId((prev) => prev + 1);
    // const newState = new DraggableStateModel(
    //   row.state,
    //   Math.floor(Math.random() * size.width),
    //   Math.floor(Math.random() * size.height)
    // );
    // setStates((prev) => [...prev, newState]);
  };

  const handleDeleteRow = (row: RowModel) => {
    console.log("handleDeleteRow", row);
    // console.log(
    //   "resultant data",
    //   rows
    //     .filter((r) => r.id !== row.id)
    //     .map((r) => {
    //       return {
    //         ...r,
    //         ...Object.fromEntries(
    //           PossibleTransitionValues.map((key) => [
    //             key === "^" ? "nul" : key,
    //             r[key === "^" ? "nul" : key].toString().includes(row.state)
    //               ? r[key === "^" ? "nul" : key]
    //                   .toString()
    //                   .replace(row.state, "")
    //               : r[key === "^" ? "nul" : key],
    //           ])
    //         ),
    //       };
    //     })
    // );

    // setRows((rows) =>
    //   rows
    //     .filter((r) => r.id !== row.id)
    //     .map((r) => {
    //       return {
    //         ...r,
    //         ...Object.fromEntries(
    //           PossibleTransitionValues.map((key) => [
    //             key === "^" ? "nul" : key,
    //             r[key === "^" ? "nul" : key].toString().includes(row.state)
    //               ? r[key === "^" ? "nul" : key]
    //                   .toString()
    //                   .replace(row.state, "")
    //               : r[key === "^" ? "nul" : key],
    //           ])
    //         ),
    //       };
    //     })
    // );

    // setTransitions((prev) =>
    //   prev.filter(
    //     (t) => t.props.start !== row.state && t.props.end !== row.state
    //   )
    // );

    // setStates((prev) => prev.filter((s) => s.id !== row.state));
  };

  const animationControllerProps: AnimationControllerProps = {
    duration: duration,
    handleTimeChange: handleTimeChange,
    handleAnimationPause: handleAnimationPause,
    handleAnimationPlay: handleAnimationPlay,
    setIsComplete: setIsComplete,
  };

  const transitionTableProps: NfaToDfaTransitionTableProps = {
    rows: nullClosureRows,
    setRows: setNullClosureRows,
    columns: columns,
    rowId: nullClosureRowId,
    setRowId: setNullClosureRowId,
    handleAddRow: handleAddRow,
  };

  const playgroundProps: NfaToDfaPlaygroundProps = {
    states: nullClosureStates,
    setStates: setNullClosureStates,
    transitions: nullClosureTransitions,
    setTransitions: setNullClosureTransitions,
    rows: nullClosureRows,
    setRows: setNullClosureRows,
    handleDeleteRow: handleDeleteRow,
  };

  const modifiedTableProps: ModifiedTableProps = {
    rows: nullClosureRows,
    // states: nullClosureStates,
    // transitions: nullClosureTransitions,
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, m: 1, mt: 5 }}>
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          align="center"
          fontWeight={"bold"}
          bgcolor={"rgb(200, 200, 200)"}
        >
          Null Closure (Reachability)
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
            <Grid container item xs={12} alignItems={"center"}>
              <AnimationController {...animationControllerProps} />
            </Grid>
            <NfaToDfaTransitionTable {...transitionTableProps} />
          </Grid>
          {/* Playground grid */}
          <Grid item xs={12} md={8}>
            <NfaToDfaPlayground {...playgroundProps} />
          </Grid>
        </Grid>
      </Box>
      {isComplete && <ModifiedTable {...modifiedTableProps} />}
    </>
  );
};