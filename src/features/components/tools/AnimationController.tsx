import {
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { AnimationTimeOptions } from "../../../consts/AnimationTimeOptions";
import { AnimationControllerProps } from "./props/AnimationControllerProps";

export const AnimationController = (props: AnimationControllerProps) => {
  console.log("re-rendering AnimationController, props: ", props);
  return (
    <ButtonGroup disableElevation fullWidth variant="outlined" size="large">
      <FormControl fullWidth>
        <InputLabel id="time-select-label">Time</InputLabel>
        <Select
          labelId="time-select-label"
          id="time-select"
          value={props.duration.toString()}
          label="Time"
          onChange={props.handleTimeChange}
        >
          {AnimationTimeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={props.handleAnimationPause}>Pause</Button>
      <Button onClick={props.handleAnimationPlay}>Play</Button>
      <Button variant="contained" onClick={() => props.setIsComplete(true)}>
        Next
      </Button>
    </ButtonGroup>
  );
};
