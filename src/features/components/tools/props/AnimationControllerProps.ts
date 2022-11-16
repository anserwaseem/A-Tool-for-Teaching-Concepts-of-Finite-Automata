import { SelectChangeEvent } from "@mui/material";

export type AnimationControllerProps = {
  duration: number;
  handleTimeChange: (event: SelectChangeEvent) => void;
};
