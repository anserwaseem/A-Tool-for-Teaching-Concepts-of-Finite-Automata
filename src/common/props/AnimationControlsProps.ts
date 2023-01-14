import { SelectChangeEvent } from "@mui/material";

export type AnimationControlsProps = {
  duration: number;
  isPlaying: boolean;
  isComplete: boolean;
  isReady: boolean;
  handleDurationChange: (event: SelectChangeEvent) => void;
  handleAnimation: () => void;
  showNextStep: () => void;
  testStringTextFields?: JSX.Element[];
};
