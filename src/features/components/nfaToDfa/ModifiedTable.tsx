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
import { NfaToDfaPlayground } from "./Playground";
import { ModifiedTableProps } from "./props/ModifiedTable";
import { NfaToDfaPlaygroundProps } from "./props/PlaygroundProps";
import { ResultantDfaProps } from "./props/ResultantDfaProps";
import { NfaToDfaTransitionTableProps } from "./props/TransitionTableProps";
import { ResultantDfa } from "./ResultantDfa";
import { NfaToDfaTransitionTable } from "./TransitionTable";

export const ModifiedTable = (props: ModifiedTableProps) => {
  const [duration, setDuration] = useState(AnimationTimeOptions[1]);
  const [isPlaying, setIsPlaying] = useState(true);

  const [isComplete, setIsComplete] = useState(true);

  const [modifiedTableRowId, setModifiedTableRowId] = useState(0);
  const [modifiedTableRows, setModifiedTableRows] = useState<RowModel[]>([]);
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

  useEffect(() => {
    setModifiedTableRows(props.rows);
  }, [props]);

  const handleTimeChange = (event: SelectChangeEvent) => {
    setDuration(Number(event.target.value));
  };

  const handleAnimationPause = () => {
    console.log("ModifiedTable Pause");
    setIsPlaying(false);
  };

  const handleAnimationPlay = () => {
    console.log("ModifiedTable Play");
    setIsPlaying(true);
  };

  const handleAddRow = (row: RowModel) => {
    // if (nullClosureStates.length >= MaxNumberOfStates) {
    //   alert(`Maximum ${MaxNumberOfStates} states allowed`);
    //   return;
    // }
    setModifiedTableRows((prev) => [...prev, row]);
    setModifiedTableRowId((prev) => prev + 1);
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
    rows: modifiedTableRows,
    setRows: setModifiedTableRows,
    columns: columns,
    rowId: modifiedTableRowId,
    setRowId: setModifiedTableRowId,
    handleAddRow: handleAddRow,
  };

  const resultantDfaProps: ResultantDfaProps = {
    rows: modifiedTableRows,
    // states: originalStates,
    // transitions: originalTransitions,
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
          Modified Transition Table
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
            <NfaToDfaTransitionTable {...transitionTableProps} />
          </Grid>
          {/* Playground grid */}
          <Grid item xs={12} md={8}>
            {/* <NfaToDfaPlayground {...playgroundProps} /> */}
          </Grid>
        </Grid>
      </Box>
      {isComplete && <ResultantDfa {...resultantDfaProps} />}
    </>
  );
};
