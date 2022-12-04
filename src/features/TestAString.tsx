import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
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

const TestAString = (props: TestAStringProps) => {
  console.log("re rendering TestAString: props");
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

  const [testString, setTestString] = useState<string>("");

  const handleClose = () => {
    props.setIsTestAStringDialogOpen(false);
  };

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

        if (true) {
          setIsComplete(true);
          setIsPlaying(false);
        } else {
        }
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  const handleUpdateData = () => {};

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

  const playgroundProps: ToolsPlaygroundProps = {
    states: testAStringStates,
    transitions: testAStringTransitions,
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
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
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
