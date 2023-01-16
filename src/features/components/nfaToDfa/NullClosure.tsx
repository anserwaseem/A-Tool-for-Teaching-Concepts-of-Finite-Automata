import { Alert, Box, Grid, SelectChangeEvent, Snackbar } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { useContext, useEffect, useRef, useState } from "react";
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
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import { StyledTransitionLabel } from "../playground/StyledTransitionLabel";
import { NullClosureStateId } from "../../../consts/StateIdsExtensions";
import { DrawerHeader } from "../../../common/DrawerHeader";
import { MainContent } from "../../../common/MainContent";
import { GetDrawerTransitionTableRows } from "../../../utils/GetDrawerTransitionTableRows";
import { GetDrawerTransitionTableColumns } from "../../../utils/GetDrawerTransitionTableColumns";
import { DataContext } from "../../../pages/Editor";
import { CustomAppBar } from "../../../common/CustomAppBar";
import { CustomDrawer } from "../../../common/CustomDrawer";
import { CustomAppBarProps } from "../../../common/props/CustomAppBarProps";
import { CustomDrawerProps } from "../../../common/props/CustomDrawerProps";
import { AnimationControlsProps } from "../../../common/props/AnimationControlsProps";
import { AnimationControls } from "../../../common/AnimationControls";
import { MainContentStyles } from "../../../common/styles/MainContentStyles";

const numberOfColumns = 2; // one for state and one for null
let index = numberOfColumns;

export const NullClosure = (props: NullClosureProps) => {
  console.log("re rendering NullClosure, props: ", props);

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[5]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

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

  const [open, setOpen] = useState(0);

  const [showExplanation, setShowExplanation] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // populate props rows in null closure table one by one with null closure states and transitions according to specified duration and isPlaying
  useEffect(() => {
    if (isPlaying) {
      let timer = setTimeout(() => {
        if (!showExplanation) {
          const rowIndex = Math.floor(index / numberOfColumns);

          handleUpdateData(
            rowIndex,
            props.rows.slice(0, rowIndex),
            props.states.slice(0, rowIndex),
            props.transitions
          );

          // stop if all rows have been displayed
          if (rowIndex > props.rows.length && index % numberOfColumns === 0) {
            setIsComplete(true);
            setIsPlaying(false);
            handleExplanation();
          }
          index++;
        } else handleExplanation();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [props, nullClosureRows, isPlaying, showExplanation]);

  const handleExplanation = () => {
    if (index % numberOfColumns === 0)
      setSnackbarMessage(
        `Added null closure of ${dataContext?.rows?.[
          nullClosureRowId - 1
        ]?.state?.replaceAll(
          NullClosureStateId,
          ""
        )} i.e., ${dataContext?.rows?.[nullClosureRowId - 1]?.state?.replaceAll(
          NullClosureStateId,
          ""
        )} itself` +
          (dataContext?.rows?.[nullClosureRowId - 1]?.nul !== ""
            ? ` and its null transition ${dataContext?.rows?.[
                nullClosureRowId - 1
              ]?.nul
                ?.split(", ")
                ?.filter(
                  (s) => s !== dataContext?.rows?.[nullClosureRowId - 1]?.state
                )
                ?.join(", ")
                ?.replaceAll(NullClosureStateId, "")}.`
            : " only.")
      );
    else
      setSnackbarMessage(
        `Added state ${nullClosureRows?.[
          nullClosureRowId - 1
        ]?.state?.replaceAll(NullClosureStateId, "")}.`
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

  const handleUpdateData = (
    rowIndex: number,
    rows: RowModel[],
    states: DraggableStateModel[],
    transitions: TransitionModel[]
  ) => {
    setNullClosureRowId(rowIndex);
    // copy all null transitions for each row and paste them in the null column alongwith state name
    setNullClosureRows(
      rows.map((row, mapIndex) => {
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
    setShowExplanation(true);
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
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    if (!showExplanation) {
      const rowIndex = Math.floor(index / numberOfColumns);
      if (isComplete) {
        setIsReady(true);
        setOpenSnackbar(false);
        props.setRows(nullClosureRows);
        props.setStates(nullClosureStates);
        props.setTransitions(nullClosureTransitions);
        props.setIsNullClosureTableComplete(true);
        dataContext.setNullClosureRows(nullClosureRows);
      }

      handleUpdateData(
        rowIndex,
        props.rows.slice(0, rowIndex),
        props.states.slice(0, rowIndex),
        props.transitions
      );

      // stop if all rows have been displayed
      if (rowIndex > props.rows.length && index % numberOfColumns === 0) {
        setIsComplete(true);
        setIsPlaying(false);
        handleExplanation();
      }
      index++;
    } else handleExplanation();
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
              .map((tv) => tv.replace(NullClosureStateId, ""))
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

  const customAppBarProps: CustomAppBarProps = {
    showRightIcon: false,
    open,
    setOpen,
    title: "Null Closure",
  };

  const customDrawerProps: CustomDrawerProps = {
    isLeft: true,
    open,
    setOpen,
    title: "Transition Table",
    transitionTableProps: {
      rows: GetDrawerTransitionTableRows(dataContext.rows, ""),
      columns: GetDrawerTransitionTableColumns(dataContext.columns, []),
    },
  };

  const animationControlsProps: AnimationControlsProps = {
    duration,
    isPlaying,
    isComplete,
    isReady,
    handleAnimation,
    showNextStep: showNextRow,
    handleDurationChange,
  };

  return (
    <>
      <Box sx={{ display: "flex", mt: 3 }}>
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
          <Alert onClose={handleSnackbarClose} severity="info">
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <CustomAppBar {...customAppBarProps} />

        <CustomDrawer {...customDrawerProps} />

        <MainContent
          open={open}
          sx={MainContentStyles(open, dataContext?.rows?.length)}
        >
          <DrawerHeader />
          {/* Grid to incorporate Transition table and Playground */}
          <Grid container spacing={1}>
            {/* Transition table grid */}
            <Grid item xs={12} md={4}>
              <Grid container item xs={12} alignItems={"center"}>
                <AnimationControls {...animationControlsProps} />
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
