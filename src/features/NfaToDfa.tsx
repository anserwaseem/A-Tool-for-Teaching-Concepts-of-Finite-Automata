import {
  Box,
  Grid,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { Tools } from "../components/Tools";
import { AnimationTimeOptions } from "../consts/AnimationTimeOptions";
import { RowModel } from "../models";
import { AnimationController } from "./components/tools/AnimationController";
import { AnimationControllerProps } from "./components/tools/props/AnimationControllerProps";
import Playground from "./Playground";
import { NfaToDfaProps } from "./props/NfaToDfaProps";
import TransitionTable from "./TransitionTable";

export const NfaToDfa = (props: NfaToDfaProps) => {
  const [duration, setDuration] = useState(AnimationTimeOptions[0]);

  const handleTimeChange = (event: SelectChangeEvent) => {
    setDuration(Number(event.target.value));
  };

  const animationControllerProps: AnimationControllerProps = {
    duration: duration,
    handleTimeChange: handleTimeChange,
  };

  return (
    <Box sx={{ flexGrow: 1, m: 1, mt: 5 }}>
      {/* Grid to incorporate Transition table and Playground */}
      <Grid
        container
        columnSpacing={{
          xs: 1,
          sm: 2,
          md: 3,
        }}
      >
        {/* Transition table grid */}
        <Grid item xs={12} md={4}>
          {/* Grid for Add a Row button and Tools */}
          <Grid container alignItems={"center"}>
            <Grid item xs={12}>
              <AnimationController {...animationControllerProps} />
            </Grid>
          </Grid>
          {/* <TransitionTable {...transitionTableProps} /> */}
        </Grid>
        {/* Playground grid */}
        <Grid item xs={12} md={8}>
          {/* <Playground {...playgroundProps} /> */}
        </Grid>
      </Grid>
    </Box>
  );
};
