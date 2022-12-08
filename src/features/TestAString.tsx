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
  Typography,
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
import { DataContext } from "../components/Editor";
import { startingStateColor } from "../consts/Colors";

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
  const [testStringIndex, setTestStringIndex] = useState<number>(-1); // before iterating original string, check if there are any null transitions from the initial state, hence the index is -1

  const [currentChar, setCurrentChar] = useState<string>("^"); // ^ is the starting character
  const [currentStates, setCurrentStates] = useState<string[]>([]);
  const [statesToHighlight, setStatesToHighlight] = useState<string[]>([]);
  const [transitionsToHighlight, setTransitionsToHighlight] = useState<
    TransitionModel[]
  >([]);

  useEffect(() => {
    console.log("TestAString useEffect, dataContext: ", dataContext);
    if (dataContext) {
      setTestAStringStates(
        dataContext.states.map((state) => {
          return {
            ...state,
            id: `${state.id}ts`,
          };
        })
      );
      setTestAStringTransitions(dataContext.transitions);
      setCurrentStates((currentStates) => [
        ...currentStates,
        dataContext.rows.find((r) => r.isInitial)?.state ?? "",
      ]);
    }
  }, []);

  useEffect(() => {
    console.log(
      "ResultantDfa useEffect, isPlaying, duration: ",
      isPlaying,
      duration
    );
    if (isPlaying) {
      let timer = setTimeout(() => {
        console.log("inside set timeout");

        handleUpdateData();

        // if (true) {
        //   setIsComplete(true);
        //   setIsPlaying(false);
        // } else {
        // }
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, displayStep]);

  const handleUpdateData = () => {
    if (displayStep === 0) {
      setStatesToHighlight((statesToHighlight) => [
        ...statesToHighlight,
        ...currentStates,
      ]);

      setDisplayStep(1);
    } else if (displayStep === 1) {
      setTestAStringTransitions((testAStringTransitions) => {
        const filteredTransitions = testAStringTransitions.filter(
          (t) =>
            currentStates.includes(t.props.start) &&
            t.props.value === currentChar
        );
        const transitions = testAStringTransitions.map((t) => {
          if (filteredTransitions.includes(t)) {
            return {
              ...t,
              props: {
                ...t.props,
                color: startingStateColor,
                dashness: {
                  animation: 1,
                },
              },
            };
          }
          return t;
        });
        setCurrentStates((currentStates) => [
          ...currentStates,
          ...filteredTransitions.map((t) => t.props.end),
        ]);
        return transitions;
      });

      // setTransitionsToHighlight((transitionsToHighlight) => [
      //   ...transitionsToHighlight,
      //   ...(testAStringTransitions
      //     ?.filter(
      //       (t) =>
      //         currentStates.includes(t.props.start) &&
      //         t.props.value === currentChar
      //     )
      //     ?.map((t) => ({
      //       ...t,
      //       props: {
      //         ...t.props,
      //         color: startingStateColor,
      //         dashness: {
      //           animation: 10,
      //         },
      //       },
      //     })) ?? []),
      //   // .find(
      //   //   (t) =>
      //   //     currentStates.includes(t.props.start) &&
      //   //     t.props.value === currentChar
      //   // ) ?? null,
      // ]);
      setDisplayStep(0);
    }
  };

  const handleDurationChange = (event: SelectChangeEvent) => {
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    console.log("TestAString handleAnimation");
    if (isComplete) {
      console.log("TestAString handleAnimation isComplete");
      // if animation is complete, reset everything i.e., replay
      setIsReady(false);
      setIsComplete(false);
      setIsPlaying(true);
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    console.log("TestAString show next row");
    if (isComplete) {
      setIsReady(true);
    }

    handleUpdateData();

    if (true) {
      setIsComplete(true);
      setIsPlaying(false);
    } else {
    }
  };

  const handleClose = () => {
    props.setIsTestAStringDialogOpen(false);
  };

  const handleOk = () => {
    setTestString((testString) => {
      // append ^ at start and after every character in testString
      let ts = testString.split("").join("^") + "^";
      ts = testString === "" ? "^".concat(ts) : ts;
      return ts;
    });
    handleClose();
  };

  const playgroundProps: ToolsPlaygroundProps = {
    states: testAStringStates,
    transitions: testAStringTransitions.map((transition) => {
      return {
        ...transition,
        props: {
          ...transition.props,
          start: `${transition.props.start}ts`,
          end: `${transition.props.end}ts`,
        },
      };
    }),
    currentStates: currentStates.map((state) => `${state}ts`),
  };

  return (
    <>
      <Dialog open={props.isTestAStringDialogOpen} onClose={handleClose}>
        <DialogTitle>Test a string</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a string to test if it is accepted by the Automaton.
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
            onChange={(e) => setTestString(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ flexGrow: 1, m: 1, mt: 5 }}>
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          align="center"
          fontWeight={"bold"}
          bgcolor={"rgb(200, 200, 200)"}
        >
          Test a String
        </Typography>

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
      </Box>
    </>
  );
};
export default TestAString;
