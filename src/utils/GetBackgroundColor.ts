import { darken, lighten } from "@mui/material";

export const GetBackgroundColor = (
  color: string,
  mode: string,
  frequency: number
) => (mode === "dark" ? darken(color, frequency) : lighten(color, frequency));
