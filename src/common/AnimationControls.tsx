import {
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { AnimationDurationOptions } from "../consts/AnimationDurationOptions";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { AnimationControlsProps } from "./props/AnimationControlsProps";

export const AnimationControls = (props: AnimationControlsProps) => {
  return (
    <ButtonGroup
      disableElevation
      fullWidth
      variant="outlined"
      size={window.innerWidth <= 525 ? "small" : "large"}
    >
      {props?.testStringTextFields}

      <FormControl fullWidth>
        <InputLabel id="delay-select-label">Delay</InputLabel>
        <Select
          labelId="delay-select-label"
          id="delay-select"
          value={props.duration.toString()}
          label="Delay"
          onChange={props.handleDurationChange}
        >
          {AnimationDurationOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        onClick={props.handleAnimation}
        startIcon={
          props.isPlaying ? (
            <PauseRoundedIcon />
          ) : props.isComplete ? (
            <ReplayRoundedIcon />
          ) : (
            <PlayArrowRoundedIcon />
          )
        }
      >
        {props.isPlaying ? "Pause" : props.isComplete ? "Replay" : "Play"}
      </Button>

      <Button
        variant={props.isComplete ? "contained" : "outlined"}
        onClick={props.showNextStep}
        disabled={props.isReady}
      >
        {props.isComplete ? "Complete" : "Next"}
      </Button>
    </ButtonGroup>
  );
};
