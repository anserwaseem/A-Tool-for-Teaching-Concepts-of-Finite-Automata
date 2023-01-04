import { Snackbar, Alert, AlertTitle } from "@mui/material";
import { ErrorSnackbarProps } from "./props/ErrorSnackbarProps";

export const ErrorSnackbar = (props: ErrorSnackbarProps) => {
  console.log("re rendering ErrorSnackbar, props: ", props);

  return (
    <Snackbar
      open={props?.open ?? true}
      autoHideDuration={6000}
      onClose={props.handleErrorSnackbarClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Alert severity="error">
        <AlertTitle>{props?.titleMessage}</AlertTitle>
        {props?.bodyMessage}
      </Alert>
    </Snackbar>
  );
};
