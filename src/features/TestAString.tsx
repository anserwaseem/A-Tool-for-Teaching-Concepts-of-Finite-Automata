import { useContext, useEffect, useState } from "react";
import { TestAStringProps } from "./props/TestAStringProps";
import {
  Box,
  Grid,
  SelectChangeEvent,
  DialogContentText,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import { AnimationDurationOptions } from "../consts/AnimationDurationOptions";
import { ToolsPlayground } from "./components/tools/Playground";
import { ToolsPlaygroundProps } from "./components/tools/props/PlaygroundProps";
import { DraggableStateModel, TransitionModel } from "../models";
import { DataContext } from "../pages/Editor";
import { startingStateColor } from "../consts/Colors";
import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";
import { TestStringMaxLength } from "../consts/TestStringMaxLength";
import { TestStringStateId } from "../consts/StateIdsExtensions";
import { DrawerHeader } from "../common/DrawerHeader";
import { MainContent } from "../common/MainContent";
import { GetDrawerTransitionTableColumns } from "../utils/GetDrawerTransitionTableColumns";
import { GetDrawerTransitionTableRows } from "../utils/GetDrawerTransitionTableRows";
import { CustomAppBar } from "../common/CustomAppBar";
import { CustomDrawer } from "../common/CustomDrawer";
import { CustomAppBarProps } from "../common/props/CustomAppBarProps";
import { CustomDrawerProps } from "../common/props/CustomDrawerProps";
import { AnimationControlsProps } from "../common/props/AnimationControlsProps";
import { AnimationControls } from "../common/AnimationControls";
import { GetTestStringTextFields } from "./components/testAString/GetTestStringTextFields";
import { MainContentStyles } from "../common/styles/MainContentStyles";

const TestAString = (props: TestAStringProps) => {
  console.log("re rendering TestAString: props");

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[5]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [testAStringStates, setTestAStringStates] = useState<
    DraggableStateModel[]
  >([]);
  const [testAStringTransitions, setTestAStringTransitions] = useState<
    TransitionModel[]
  >([]);

  // 0 for highlighting states
  // 1 for highlighting transitions
  const [displayStep, setDisplayStep] = useState<number>(0);

  const [testString, setTestString] = useState<string>("");
  const [testStringIndex, setTestStringIndex] = useState<number>(-1);
  const [currentStates, setCurrentStates] = useState<string[]>([]);
  const [previousStates, setPreviousStates] = useState<string[]>([]); // states before currentStates
  const [statesToHighlight, setStatesToHighlight] = useState<string[]>([]);
  const [highlightedTransitions, setHighlightedTransitions] = useState<
    TransitionModel[]
  >([]);
  const [dialogError, setDialogError] = useState("");

  const [open, setOpen] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  useEffect(() => {
    if (dataContext) {
      setTestAStringStates(
        dataContext.states.map((state) => {
          return {
            ...state,
            id: state.id + TestStringStateId,
          };
        })
      );
      setTestAStringTransitions(dataContext.transitions);
      setCurrentStates([
        dataContext.rows.find((r) => r.isInitial)?.state ?? "",
      ]);
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      let timer = setTimeout(() => {
        handleUpdateData();

        if (testStringIndex === testString.length + 1) {
          setIsComplete(true);
          setIsPlaying(false);
        }
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, displayStep]);

  const handleUpdateData = () => {
    if (displayStep === 0) {
      setStatesToHighlight(currentStates);

      // reset previously highlighted transitions
      setTestAStringTransitions(dataContext.transitions);
      // setTestAStringTransitions((testAStringTransitions) =>
      //   testAStringTransitions.map((t) => {
      //     if (highlightedTransitions.includes(t)) {
      //       return {
      //         ...t,
      //         props: {
      //           ...t.props,
      //           color: transitionHoverColor,
      //           animateDrawing: false,
      //           dashness: false,
      //         },
      //       };
      //     }
      //     return t;
      //   })
      // );

      setTestStringIndex((i) => i + 1);

      setDisplayStep(1);
    } else if (displayStep === 1) {
      setTestAStringTransitions((testAStringTransitions) => {
        const filteredTransitions = testAStringTransitions.filter(
          (t) =>
            currentStates.includes(t.start) &&
            t.value.includes(testString[testStringIndex])
        );

        setHighlightedTransitions(filteredTransitions);

        const transitions = testAStringTransitions.map((t) => {
          if (filteredTransitions.includes(t)) {
            return {
              ...t,
              color: startingStateColor,
              dashness: {
                animation: 1,
              },
            };
          }
          return t;
        });

        const filteredStates = filteredTransitions.map((t) => t.end);

        if (testString[testStringIndex] === "^") {
          setCurrentStates((currentStates) =>
            Array.from(new Set([...currentStates, ...filteredStates]))
          );

          // check if any of the filteredStates have a null transition, if yes, then decrement testStringIndex in order to check null transitions again for the new currentStates
          if (
            currentStates.toString() !== previousStates.toString() &&
            dataContext?.transitions?.find(
              (t) => filteredStates.includes(t.start) && t.value.includes("^")
            )
          )
            setTestStringIndex((i) => i - 1);
        } else setCurrentStates(filteredStates);
        setPreviousStates(currentStates);

        return transitions;
      });

      if (testStringIndex === testString.length) {
        setDisplayStep(2);
      } else setDisplayStep(0);
    }

    if (displayStep === 2) {
      // setStatesToHighlight(currentStates);
      setOpenSnackbar(true);
      setDisplayStep(0);
    }
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
      setIsPlaying(true);

      setDisplayStep(0);
      setTestAStringStates(
        dataContext.states.map((state) => {
          return {
            ...state,
            id: state.id + TestStringStateId,
          };
        })
      );
      setTestAStringTransitions(dataContext.transitions);
      setCurrentStates([
        dataContext.rows.find((r) => r.isInitial)?.state ?? "",
      ]);
      setPreviousStates([]);
      setTestStringIndex(-1);
      setStatesToHighlight([]);
      setHighlightedTransitions([]);
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    if (isComplete) {
      setIsReady(true);
      setOpenSnackbar(false);
    }

    handleUpdateData();

    if (testStringIndex === testString.length + 1) {
      setIsComplete(true);
      setIsPlaying(false);
    }
  };

  const handleClose = () => {
    props.setIsTestAStringDialogOpen(false);
  };

  const handleChange = (value: string) => {
    if (value.length <= TestStringMaxLength) {
      let appendedValue = value.split("").join("^");
      if (appendedValue?.length > 0) {
        appendedValue = "^" + appendedValue + "^";
      }
      setTestString(appendedValue);
    } else
      setDialogError(
        `Test string cannot be more than ${TestStringMaxLength} characters.`
      );
  };

  const handleSubmit = () => {
    if (testString === "") setDialogError("Please enter a valid string.");
    else if (testString.includes("^^"))
      setDialogError("Please remove ^ from the string.");
    else if (
      !testString.split("").every((c) => PossibleTransitionValues.includes(c))
    )
      setDialogError(
        `Please enter a valid string from following characters ${PossibleTransitionValues.filter(
          (v) => v !== "^"
        ).join(", ")}`
      );
    else {
      setDialogError("none");
      handleClose();
    }
  };

  const playgroundProps: ToolsPlaygroundProps = {
    states: testAStringStates,
    transitions: testAStringTransitions.map((transition) => {
      return {
        ...transition,
        start: transition.start + TestStringStateId,
        end: transition.end + TestStringStateId,
      };
    }),
    setTransitions: setTestAStringTransitions,
    currentStates: statesToHighlight.map((state) => state + TestStringStateId),
    stateSize: dataContext.stateSize,
  };

  const customAppBarProps: CustomAppBarProps = {
    showRightIcon: false,
    open,
    setOpen,
    title: "Test a String",
  };

  const customDrawerProps: CustomDrawerProps = {
    isLeft: true,
    open,
    setOpen,
    title: "Transition Table",
    transitionTableProps: {
      rows: GetDrawerTransitionTableRows(dataContext.rows, ""),
      columns: GetDrawerTransitionTableColumns(dataContext.columns, ["nul"]),
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
    testStringTextFields: GetTestStringTextFields(testString, testStringIndex),
  };

  return (
    <>
      <Dialog open={props.isTestAStringDialogOpen} onClose={handleClose}>
        <DialogTitle>Test a string</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogError === "" || dialogError === "none"
              ? "Enter a string to test if it is accepted by the Automaton."
              : dialogError}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="testString"
            label="String to test"
            type="text"
            fullWidth
            variant="standard"
            value={testString.replaceAll("^", "")}
            onChange={(e) => handleChange(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Ok</Button>
        </DialogActions>
      </Dialog>

      {dialogError === "none" && (
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
            <Alert
              onClose={handleSnackbarClose}
              severity="info"
              sx={{ width: "100%" }}
            >
              {`String ${testString.replaceAll("^", "")} is ${
                previousStates?.includes(
                  dataContext?.rows?.find((r) => r.isFinal)?.state
                )
                  ? ""
                  : "not "
              }accepted.`}
            </Alert>
          </Snackbar>

          <CustomAppBar {...customAppBarProps} />

          <CustomDrawer {...customDrawerProps} />

          <MainContent
            open={open}
            sx={MainContentStyles(open, dataContext?.rows?.length)}
          >
            <DrawerHeader />

            <Grid container spacing={1}>
              <Grid item xs={12} alignItems={"center"}>
                <AnimationControls {...animationControlsProps} />
              </Grid>
              {/* Playground grid */}
              <Grid item xs={12}>
                <ToolsPlayground {...playgroundProps} />
              </Grid>
            </Grid>
          </MainContent>
        </Box>
      )}
    </>
  );
};
export default TestAString;
