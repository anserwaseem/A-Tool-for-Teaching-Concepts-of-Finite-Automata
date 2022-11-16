import { SelectChangeEvent } from "@mui/material";

export type AnimationControllerProps = {
  duration: number;
  handleTimeChange: (event: SelectChangeEvent) => void;
  handleAnimationPause: () => void;
  handleAnimationPlay: () => void;
  setIsComplete: React.Dispatch<React.SetStateAction<boolean>>;
};
