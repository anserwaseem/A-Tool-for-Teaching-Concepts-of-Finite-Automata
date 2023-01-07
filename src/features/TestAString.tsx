import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useContext, useEffect, useState } from "react";
import { TestAStringProps } from "./props/TestAStringProps";
import {
  Box,
  Grid,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  DialogContentText,
} from "@mui/material";
import { AnimationDurationOptions } from "../consts/AnimationDurationOptions";
import { ToolsPlayground } from "./components/tools/Playground";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { ToolsPlaygroundProps } from "./components/tools/props/PlaygroundProps";
import { DraggableStateModel, TransitionModel } from "../models";
import { DataContext } from "../pages/Editor";
import { startingStateColor, stateSelectedColor } from "../consts/Colors";
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

        if (testStringIndex === testString.length) {
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

      setDisplayStep(0);
    }
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
    if (isComplete) setIsReady(true);

    handleUpdateData();

    if (testStringIndex === testString.length) {
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
        <Box sx={{ display: "flex", m: 1, mt: 5 }}>
          <CustomAppBar {...customAppBarProps} />

          <CustomDrawer {...customDrawerProps} />

          <MainContent open={open} sx={{ paddingBottom: 12 }}>
            <DrawerHeader />

            <Grid
              container
              columnSpacing={{
                xs: 1,
                sm: 2,
                md: 3,
              }}
            >
              <Grid item xs={12} alignItems={"center"}>
                <ButtonGroup
                  disableElevation
                  fullWidth
                  variant="outlined"
                  size="large"
                >
                  {testString
                    .replaceAll("^", "")
                    .split("")
                    .map((char, index) => (
                      <TextField
                        key={index}
                        id={`testString${index}`}
                        value={char}
                        variant="standard"
                        InputProps={{
                          readOnly: true,
                          sx: {
                            textAlignLast: "center",
                          },
                        }}
                        sx={{
                          backgroundColor:
                            Math.floor((testStringIndex - 1) / 2) === index
                              ? startingStateColor
                              : "inherit",
                          flexDirection: "inherit",
                          borderRadius: "20px",
                          border: `1px solid ${stateSelectedColor}`,
                          borderWidth: "0 1px 0 1px",
                        }}
                      />
                    ))}

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
