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
import { GridColumns, GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { AnimationDurationOptions } from "../../../consts/AnimationDurationOptions";
import { MaxNumberOfStates } from "../../../consts/MaxNumberOfStates";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import {
  RowModel,
  DraggableStateModel,
  TransitionModel,
} from "../../../models";
import { AnimationController } from "../tools/AnimationController";
import { AnimationControllerProps } from "../tools/props/AnimationControllerProps";
import { NfaToDfaPlayground } from "./Playground";
import { ModifiedTableProps } from "./props/ModifiedTableProps";
import { NfaToDfaTransitionTableProps } from "./props/NfaToDfaTransitionTableProps";
import { NfaToDfaPlaygroundProps } from "./props/PlaygroundProps";
import { ResultantDfaProps } from "./props/ResultantDfaProps";
import { ResultantDfa } from "./ResultantDfa";
import { NfaToDfaTransitionTable } from "./TransitionTable";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

const numberOfColumns = 3; // one for state, one for a and one for b
let index = numberOfColumns;

export const ModifiedTable = (props: ModifiedTableProps) => {
  console.log("re-rendering modified table, props: ", props);
  const [duration, setDuration] = useState(AnimationDurationOptions[1]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

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
    console.log(
      "ModifiedTable useEffect, isPlaying, duration: ",
      isPlaying,
      duration
    );
    if (isPlaying) {
      let timer = setTimeout(() => {
        console.log("inside set timeout, index", index);
        const rowIndex = Math.floor(index / numberOfColumns);
        // console.log(
        //   "before handleUpdateData ModifiedTable:",
        //   props.rows,
        //   props.rows.map((row, mapIndex) => {
        //     console.log(
        //       "rowIndex, index, mapIndex: ",
        //       rowIndex,
        //       index,
        //       mapIndex
        //     );
        //     return {
        //       ...row,
        //       // ...Object.fromEntries(
        //       //   PossibleTransitionValues.filter(
        //       //     (transition) => transition !== "^"
        //       //   ).map((key, tvIndex) => [
        //       //     key,
        //       //     row[key] // for each Possible Transition Value except ^, replace each value with its corresponding nul closure
        //       //       .toString()
        //       //       .split(", ")
        //       //       .map((tv) => tv.replace(tv, row.nul))
        //       //       .join(", "),
        //       //   ])
        //       // ),
        //       a:
        //         rowIndex - 1 === mapIndex
        //           ? (index - 1) % rowIndex === 0
        //             ? row.nul // replace each state name with its corresponding nul closure
        //                 .split(", ")
        //                 .map((tv) => tv.replace(tv, row.nul))
        //                 .join(", ")
        //             : ""
        //           : row.a,
        //       b:
        //         rowIndex - 1 === mapIndex
        //           ? (index - 1) % rowIndex === 1
        //             ? row.nul // replace each state name with its corresponding nul closure
        //                 .split(", ")
        //                 .map((tv) => tv.replace(tv, row.nul))
        //                 .join(", ")
        //             : ""
        //           : row.b,
        //     };
        //   })
        // );

        setModifiedTableRowId(rowIndex);
        setModifiedTableRows(
          props.rows.slice(0, rowIndex).map((row, mapIndex) => {
            console.log(
              "rowIndex, index, mapIndex: ",
              rowIndex,
              index,
              mapIndex
            );
            return {
              ...row,
              // ...Object.fromEntries(
              //   PossibleTransitionValues.filter(
              //     (transition) => transition !== "^"
              //   ).map((key, tvIndex) => [
              //     key,
              //     row[key] // for each Possible Transition Value except ^, replace each value with its corresponding nul closure
              //       .toString()
              //       .split(", ")
              //       .map((tv) => tv.replace(tv, row.nul))
              //       .join(", "),
              //   ])
              // ),
              a:
                rowIndex - 1 === mapIndex
                  ? ((index - 1) % rowIndex === 0 &&
                      index !== 3 &&
                      index !== 6) ||
                    index === 5 ||
                    ((index - 1) % rowIndex === 1 &&
                      index !== 3 &&
                      index !== 4 &&
                      index !== 6)
                    ? row.a // replace each state name with its corresponding nul closure
                        ?.split(", ")
                        ?.filter((tv) => tv !== "")
                        ?.map((tv) =>
                          tv?.replace(
                            tv,
                            props.rows.find((r) => r.state === tv)?.nul ?? tv
                          )
                        )
                        ?.join(", ") ?? ""
                    : ""
                  : row.a,
              b:
                rowIndex - 1 === mapIndex
                  ? index === 5 ||
                    ((index - 1) % rowIndex === 1 &&
                      index !== 3 &&
                      index !== 4 &&
                      index !== 6)
                    ? row.b // replace each state name with its corresponding nul closure
                        ?.split(", ")
                        ?.filter((tv) => tv !== "")
                        ?.map((tv) =>
                          tv?.replace(
                            tv,
                            props.rows.find((r) => r.state === tv)?.nul ?? tv
                          )
                        )
                        ?.join(", ") ?? ""
                    : ""
                  : row.b,
            };
          })
        );

        // stop if all rows have been displayed i.e., if rowIndex equals rows length and last row's last column has been displayed
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
  }, [props, modifiedTableRows, isPlaying]);

  const handleDurationChange = (event: SelectChangeEvent) => {
    console.log(
      "ModifiedTable handleDurationChange, event.target.value, duration: ",
      event.target.value,
      duration
    );
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    console.log("ModifiedTable handleAnimation");
    if (isComplete) {
      // when replay button is clicked, null clossure component is re-rendered
      // so, modified transition table AND resultant dfa are made hidden until animation is completed
      // because modified transition table and resultant dfa are dependent on null closure table
      setIsReady(false);
      setIsComplete(false);
      index = 1;
      setIsPlaying(true);
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    console.log("ModifiedTable show next row, index: ", index);
    const rowIndex = Math.floor(index / numberOfColumns);
    console.log(
      "before handleUpdateData: index, rowIndex: ",
      index,
      rowIndex,
      props.rows.length
    );

    setModifiedTableRowId(rowIndex);
    setModifiedTableRows(
      props.rows.slice(0, rowIndex).map((row, mapIndex) => {
        console.log("rowIndex, index, mapIndex: ", rowIndex, index, mapIndex);
        return {
          ...row,
          a:
            rowIndex - 1 === mapIndex // if last row
              ? ((index - 1) % rowIndex === 0 && index !== 3 && index !== 6) ||
                // b condition
                index === 5 ||
                ((index - 1) % rowIndex === 1 &&
                  index !== 3 &&
                  index !== 4 &&
                  index !== 6)
                ? row.a // replace each state name with its corresponding nul closure
                    ?.split(", ")
                    ?.filter((tv) => tv !== "")
                    ?.map((tv) =>
                      tv?.replace(
                        tv,
                        props.rows.find((r) => r.state === tv)?.nul ?? tv
                      )
                    )
                    ?.join(", ") ?? ""
                : ""
              : row.a, // if not last row, return original value
          b:
            rowIndex - 1 === mapIndex
              ? index === 5 || // handling exceptional case
                ((index - 1) % rowIndex === 1 &&
                  index !== 3 && // handling exceptional case
                  index !== 4 && // handling exceptional case
                  index !== 6) // handling exceptional case
                ? row.b // replace each state name with its corresponding nul closure
                    ?.split(", ")
                    ?.filter((tv) => tv !== "")
                    ?.map((tv) =>
                      tv?.replace(
                        tv,
                        props.rows.find((r) => r.state === tv)?.nul ?? tv
                      )
                    )
                    ?.join(", ") ?? ""
                : ""
              : row.b,
        };
      })
    );

    // stop if all rows have been displayed i.e., if rowIndex equals rows length and last row's last column has been displayed
    if (rowIndex === props.rows.length && index % numberOfColumns !== 0) {
      setIsComplete(true);
      setIsPlaying(false);
    } else index++;
  };

  const transitionTableProps: NfaToDfaTransitionTableProps = {
    rows: modifiedTableRows.map((row) => {
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
    setRows: setModifiedTableRows,
    columns: columns,
    rowId: modifiedTableRowId,
    setRowId: setModifiedTableRowId,
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
          Modified Transition Table (replace each state with its null closure)
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
            {/* <NfaToDfaPlayground {...playgroundProps} /> */}
          </Grid>
        </Grid>
      </Box>
      {/* {isComplete && <ResultantDfa {...resultantDfaProps} />} */}
    </>
  );
};
