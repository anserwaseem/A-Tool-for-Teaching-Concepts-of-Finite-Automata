import { AlertColor } from "@mui/material";

export type ErrorSnackbarProps = {
  handleErrorSnackbarClose: () => void;
  titleMessage?: string;
  bodyMessage?: string;
  open?: boolean;
  severity?: AlertColor;
};
