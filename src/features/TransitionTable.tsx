import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { darken, lighten } from "@mui/material/styles";
import { TransitionTableProps } from "./props/TransitionTableProps";
import { useState } from "react";
import { MaxNumberOfStates } from "../consts/MaxNumberOfStates";

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0) : lighten(color, 0);

const TransitionTable = (props: TransitionTableProps) => {
  console.log("re rendering TransitionTable: props", props);

  return (
    <Box
      sx={{
        "& .super-app-theme--Both": {
          bgcolor: (theme) =>
            `${getBackgroundColor(
              theme.palette.info.light,
              theme.palette.mode
            )} !important`,
        },

        "& .super-app-theme--Initial": {
          bgcolor: (theme) =>
            `${getBackgroundColor(
              theme.palette.warning.light,
              theme.palette.mode
            )} !important`,
        },

        "& .super-app-theme--Final": {
          bgcolor: (theme) =>
            `${getBackgroundColor(
              theme.palette.success.light,
              theme.palette.mode
            )} !important`,
        },
      }}
    >
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        autoHeight
        hideFooter
        experimentalFeatures={{ newEditingApi: true }}
        pageSize={MaxNumberOfStates}
        getRowClassName={(params) =>
          `super-app-theme--${
            params?.row?.isInitial && params?.row?.isFinal
              ? "Both"
              : params?.row?.isInitial
              ? "Initial"
              : params?.row?.isFinal && "Final"
          }`
        }
      ></DataGrid>
    </Box>
  );
};
export default TransitionTable;
