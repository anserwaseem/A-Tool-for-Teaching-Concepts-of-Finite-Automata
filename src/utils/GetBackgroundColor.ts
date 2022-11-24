import { darken, lighten } from "@mui/material";

export const GetBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0) : lighten(color, 0);
