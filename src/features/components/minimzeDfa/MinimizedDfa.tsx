import {
  Alert,
  Box,
  CssBaseline,
  Grid,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AnimationDurationOptions } from "../../../consts/AnimationDurationOptions";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import { ToolsTransitionTableProps } from "../tools/props/TransitionTableProps";
import { DataContext } from "../../../pages/Editor";
import { MinimizedDfaProps } from "./props/MinimizedDfaProps";
import { ToolsPlayground } from "../tools/Playground";
import { ToolsPlaygroundProps } from "../tools/props/PlaygroundProps";
import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../models";
import { StyledTransitionLabel } from "../playground/StyledTransitionLabel";
import { MinimizedDfaStateId } from "../../../consts/StateIdsExtensions";
import { MainContent } from "../../../common/MainContent";
import { DrawerHeader } from "../../../common/DrawerHeader";
import { CustomAppBar } from "../../../common/CustomAppBar";
import { CustomDrawer } from "../../../common/CustomDrawer";
import { CustomAppBarProps } from "../../../common/props/CustomAppBarProps";
import { CustomDrawerProps } from "../../../common/props/CustomDrawerProps";
import { AnimationControlsProps } from "../../../common/props/AnimationControlsProps";
import { AnimationControls } from "../../../common/AnimationControls";
import { MainContentStyles } from "../../../common/styles/MainContentStyles";

let sliceIndex = 0; // index of such row (of Equivalence table) is saved where more than one Ticks are present
let transitionIndex = 0; // used to keep track of which (transition table's) row's transitions are being animated

export const MinimizedDfa = (props: MinimizedDfaProps) => {
  console.log("re rendering MinimizedDfa, props: ", props);

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[6]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [minimizedDfaRows, setMinimizedDfaRows] = useState<RowModel[]>([]);
  const [minimizedDfaStates, setMinimizedDfaStates] = useState<
    DraggableStateModel[]
  >([]);
  const [minimizedDfaTransitions, setMinimizedDfaTransitions] = useState<
    TransitionModel[]
  >([]);

  // 0 for showing explanation of showing original transition table and original DFA,
  // 1 for removing all transitions from DFA,
  // 2 for showing its explanation,
  // 3 for MergeStep,
  // 4 for TransitionStep,
  const [displayStep, setDisplayStep] = useState<number>(0);

  // 0 by default
  // 1 for merging rows & states
  // 2 for showing its explanation
  const [mergeStep, setMergeStep] = useState<number>(0);
  const [stateNamesToMerge, setStateNamesToMerge] = useState<string[]>([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [open, setOpen] = useState(0);

  useEffect(() => {
    setMinimizedDfaRows(dataContext?.rows);
    setMinimizedDfaStates(props?.states);
    setMinimizedDfaTransitions(props?.transitions);
  }, []);

  useEffect(() => {
    if (isPlaying && mergeStep !== 1) {
      let timer = setTimeout(() => {
        handleUpdateData();
      }, duration * 1000);
      return () => clearTimeout(timer);
    } else if (mergeStep === 1) {
      const stateToMergeInto = minimizedDfaStates.find(
        (state) =>
          state.id?.replace(MinimizedDfaStateId, "") === stateNamesToMerge[0]
      );
      const statesToMerge = minimizedDfaStates.filter((state) =>
        stateNamesToMerge
          .filter(
            (stateName) =>
              stateName?.replace(MinimizedDfaStateId, "") !==
              stateNamesToMerge[0]
          )
          .includes(state.id?.replace(MinimizedDfaStateId, ""))
      );

      // run timer 100 times for duration * 10 time
      let i = 1;
      var started = Date.now();
      var timer = setInterval(function () {
        var timePassed = Date.now() - started;
        if (timePassed >= duration * 1010) {
          clearInterval(timer);
          mergeStates();
          mergeRows();
          setMergeStep(0);
          setDisplayStep(4);
          return;
        }
        const newStates = minimizedDfaStates.map((state) => {
          if (statesToMerge.map((state) => state.id).includes(state.id)) {
            return {
              ...state,
              x: state.x + (i * (stateToMergeInto.x - state.x)) / 100,
              y: state.y + (i * (stateToMergeInto.y - state.y)) / 100,
            };
          } else {
            return state;
          }
        });
        setMinimizedDfaStates(newStates);
        i++;
      }, duration * 10);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, displayStep, mergeStep]);

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleUpdateData = () => {
    if (displayStep === 0) {
      setSnackbarMessage(
        "This is the original transition table and the original DFA."
      );
      setOpenSnackbar(true);
      setDisplayStep(1);
    } else if (displayStep === 1) {
      setMinimizedDfaTransitions([]);
      setDisplayStep(2);
    } else if (displayStep === 2) {
      setSnackbarMessage("All transitions of the original DFA are removed.");
      setOpenSnackbar(true);
      setDisplayStep(3);
    } else if (displayStep === 3) {
      const stateNames = getStateNamesToBeMerged();
      if (stateNames?.length === 0) setDisplayStep(5);
      else {
        setStateNamesToMerge(stateNames);
        setMergeStep(1);
      }
    } else if (displayStep === 4) {
      setSnackbarMessage(
        `
        The states ${stateNamesToMerge
          .slice(0, -1)
          .join(", ")} and ${stateNamesToMerge.at(-1)} are merged.
        `
      );
      setOpenSnackbar(true);
      setDisplayStep(3);
    } else if (displayStep === 5) {
      // add transitions for each row one by one
      handleUpdatingTransitions();
      setDisplayStep(6);
    } else if (displayStep === 6) {
      setSnackbarMessage(
        `Added transitions for row ${transitionIndex} of the transition table.`
      );
      setOpenSnackbar(true);
      if (transitionIndex === minimizedDfaRows.length) {
        setIsComplete(true);
        setIsPlaying(false);
      } else setDisplayStep(5);
    }
  };

  const handleUpdatingTransitions = () => {
    const row = minimizedDfaRows?.[transitionIndex];
    let newtransitions = [...minimizedDfaTransitions] as TransitionModel[];
    PossibleTransitionValues.filter(
      (transitionValue) => transitionValue !== "^"
    ).forEach((transitionValue) => {
      const transitionExists = newtransitions?.find(
        (t) => t?.start === row?.state && t?.end === row?.[transitionValue]
      );
      const isSelfTransition = row?.state === row?.[transitionValue];
      if (!transitionExists) {
        // add new transition
        newtransitions = [
          ...newtransitions,
          {
            labels: <StyledTransitionLabel label={transitionValue} />,
            value: transitionValue,
            start: row?.state + MinimizedDfaStateId,
            end: (row?.[transitionValue] as string) + MinimizedDfaStateId,
            animateDrawing: true,
            _extendSVGcanvas: isSelfTransition ? 25 : 0,
            _cpx1Offset: isSelfTransition ? -50 : 0,
            _cpy1Offset: isSelfTransition ? -50 : 0,
            _cpx2Offset: isSelfTransition ? 50 : 0,
            _cpy2Offset: isSelfTransition ? -50 : 0,
          },
        ];
      } else {
        // update transition
        newtransitions = newtransitions.map((t) => {
          return {
            ...t,
            labels: <StyledTransitionLabel label={t.value + transitionValue} />,
            value: t.value + transitionValue,
          };
        });
      }
    });
    setMinimizedDfaTransitions(newtransitions);
    transitionIndex++;
  };

  const getStateNamesToBeMerged = () => {
    let stateNames: string[] = [];
    let statesFound = false;
    for (
      let i = sliceIndex;
      i < props?.equivalentStatesRows.length && !statesFound;
      i++
    ) {
      const row = props?.equivalentStatesRows[i];
      // if any two columns of row have ✓, then save those column names
      let tickNumber = 0;
      let previousKey = "";

      Object.keys(row).forEach((key) => {
        if (row[key] === "✓") {
          tickNumber++;
          if (tickNumber === 1) previousKey = key;
          else if (tickNumber === 2) {
            stateNames.push(previousKey, key);
            sliceIndex = i + 1;
            statesFound = true;
          }
        }
      });

      if (stateNames?.length > 1) {
        stateNames = stateNames.map((stateName) =>
          stateName.replace("cell-", "")
        );
      }
    }
    return stateNames;
  };

  const mergeStates = () => {
    setMinimizedDfaStates((prev) => {
      return prev
        .filter(
          (state) =>
            !stateNamesToMerge
              .slice(1)
              .includes(state.id?.replace(MinimizedDfaStateId, ""))
        )
        .map((state) => {
          if (
            state.id?.replace(MinimizedDfaStateId, "") === stateNamesToMerge[0]
          )
            return {
              ...state,
              id:
                state.id?.replace(MinimizedDfaStateId, "") +
                " " +
                stateNamesToMerge.slice(1).join(" ") +
                MinimizedDfaStateId,
            };
          else return state;
        });
    });
  };

  const mergeRows = () => {
    // merge rows having states in statesToMerge array
    for (let i = -1; i > -stateNamesToMerge.length; i--) {
      // find statesToMerge[i] in props?.rows and merge it into statesToMerge[0] props?.rows
      setMinimizedDfaRows((prev) => {
        const rowToMerge = prev.find(
          (row) => row.state === stateNamesToMerge.at(i)
        );
        const rowToMergeInto = prev.find(
          (row) => row.state === stateNamesToMerge[0]
        );
        const mergedRow = getMergedRow(rowToMerge, rowToMergeInto);
        const rowsAfterMerge = prev
          .filter((row) => row.state !== stateNamesToMerge.at(i))
          .map((row) => {
            if (row.state === stateNamesToMerge[0]) {
              return mergedRow;
            }
            return row;
          });
        // look in all PossibleTransitionValues in rowsAfterMerge for rowToMerge.state or rowToMergeInto.state and replace it with mergedRow.state
        const rowsAfterMergeWithReplacedState = rowsAfterMerge.map((row) => {
          const newRow = { ...row };
          for (const [key, value] of Object.entries(row)) {
            if (value === rowToMerge.state || value === rowToMergeInto.state) {
              newRow[key] = mergedRow.state;
            }
          }
          return newRow;
        });
        return rowsAfterMergeWithReplacedState;
      });
    }
  };

  const getMergedRow = (
    rowToMerge: RowModel,
    rowToMergeInto: RowModel
  ): RowModel => {
    const mergedRow = { ...rowToMergeInto };
    Object.keys(rowToMerge).forEach((key) => {
      if (key === "isInitial" || key === "isFinal") {
        mergedRow[key] = mergedRow[key] || rowToMerge[key];
      } else if (key !== "id") {
        mergedRow[key] = Array.from(
          new Set(
            mergedRow[key]
              ?.toString()
              ?.concat(" ", rowToMerge[key]?.toString())
              ?.trimEnd()
              ?.split(" ")
          )
        )?.join(" ");
      }
    });
    return mergedRow;
  };

  const handleDurationChange = (event: SelectChangeEvent) => {
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    if (isComplete) {
      // if animation is complete, reset everything i.e., replay
      setIsReady(false);
      setIsComplete(false);
      setIsPlaying(true);

      setDisplayStep(0);
      setMergeStep(0);
      setStateNamesToMerge([]);
      sliceIndex = 0;
      transitionIndex = 0;
      setMinimizedDfaRows(dataContext?.rows);
      setMinimizedDfaStates(props?.states);
      setMinimizedDfaTransitions(props?.transitions);
    } else setIsPlaying((v) => !v);
  };

  const showNextStep = () => {
    if (isComplete) {
      setIsReady(true);
      props.setIsMinimizedDfaComplete(true);
    }

    handleUpdateData();

    if (transitionIndex === minimizedDfaRows.length) {
      setIsComplete(true);
      setIsPlaying(false);
    }
  };

  const transitionTableProps: ToolsTransitionTableProps = {
    rows: minimizedDfaRows,

    columns: dataContext.columns
      .filter((col) => col.field !== "action" && col.field !== "nul")
      .map((col) => {
        if (col.field === "state") return { ...col, flex: 1 };
        else
          return {
            ...col,
            editable: false,
          };
      }),
  };

  const playgroundProps: ToolsPlaygroundProps = {
    states: minimizedDfaStates,
    transitions: minimizedDfaTransitions,
    setTransitions: setMinimizedDfaTransitions,
    canvasWidth: window.innerWidth >= 900 ? "150%" : "100%",
    stateSize: props.stateSize,
  };

  const customAppBarProps: CustomAppBarProps = {
    showRightIcon: false,
    open,
    setOpen,
    title: "Minimized DFA",
  };

  const customDrawerProps: CustomDrawerProps = {
    isLeft: true,
    open,
    setOpen,
    title: "Transition Table",
    transitionTableProps,
  };

  const animationControlsProps: AnimationControlsProps = {
    duration,
    isPlaying,
    isComplete,
    isReady,
    handleAnimation,
    showNextStep,
    handleDurationChange,
  };

  return (
    <>
      <Box sx={{ display: "flex", mt: 3 }}>
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
            // icon={
            //   snackbarMessage?.at(-1) === "✓" ? (
            //     <CheckIcon fontSize="medium" />
            //   ) : snackbarMessage?.at(-1) === "✕" ? (
            //     <ClearIcon fontSize="medium" />
            //   ) : snackbarMessage?.at(-1) === "—" ? (
            //     <HorizontalRuleIcon fontSize="medium" />
            //   ) : (
            //     <DataArrayIcon fontSize="medium" />
            //   )
            // }
          >
            {snackbarMessage.slice(0, -1)}
          </Alert>
        </Snackbar>

        <CustomAppBar {...customAppBarProps} />

        <CustomDrawer {...customDrawerProps} />

        <MainContent
          open={open}
          sx={MainContentStyles(open, dataContext?.rows?.length)}
        >
          <DrawerHeader />
          <Grid container>
            <Grid item alignItems={"center"} xs={12}>
              <AnimationControls {...animationControlsProps} />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12} md={8}>
                <ToolsPlayground {...playgroundProps} />
              </Grid>
            </Grid>
          </Grid>
        </MainContent>
      </Box>
    </>
  );
};
