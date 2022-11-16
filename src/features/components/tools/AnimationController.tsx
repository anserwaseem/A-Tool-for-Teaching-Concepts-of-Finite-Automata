import {
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { AnimationTimeOptions } from "../../../consts/AnimationTimeOptions";
import { AnimationControllerProps } from "./props/AnimationControllerProps";

export const AnimationController = (props: AnimationControllerProps) => (
  <ButtonGroup disableElevation fullWidth variant="outlined" size="large">
    <FormControl fullWidth>
      <InputLabel id="time-select-label">Time</InputLabel>
      <Select
        labelId="time-select-label"
        id="time-select"
        value={props.duration.toString()}
        label="Time"
        onChange={() => props.handleTimeChange}
      >
        {AnimationTimeOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <Button>Pause</Button>
    <Button>Play</Button>
  </ButtonGroup>
);
