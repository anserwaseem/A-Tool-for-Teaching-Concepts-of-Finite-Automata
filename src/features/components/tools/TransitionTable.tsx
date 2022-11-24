import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MaxNumberOfStates } from "../../../consts/MaxNumberOfStates";
import { GetBackgroundColor } from "../../../utils/GetBackgroundColor";
import { ToolsTransitionTableProps } from "./props/TransitionTableProps";

export const ToolsTransitionTable = (props: ToolsTransitionTableProps) => {
  console.log("re rendering ToolsTransitionTable: props", props);

  return (
    <Box
      sx={{
        "& .super-app-theme--Both": {
          bgcolor: (theme) =>
            `${GetBackgroundColor(
              theme.palette.info.light,
              theme.palette.mode
            )} !important`,
        },

        "& .super-app-theme--Initial": {
          bgcolor: (theme) =>
            `${GetBackgroundColor(
              theme.palette.warning.light,
              theme.palette.mode
            )} !important`,
        },

        "& .super-app-theme--Final": {
          bgcolor: (theme) =>
            `${GetBackgroundColor(
              theme.palette.success.light,
              theme.palette.mode
            )} !important`,
        },

        "& .super-app-theme--Highlight": {
          bgcolor: (theme) =>
            `${GetBackgroundColor(
              theme.palette.primary.light,
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
        pageSize={MaxNumberOfStates}
        disableSelectionOnClick
        getCellClassName={(params) =>
          `super-app-theme--${
            params.field !== "state"
              ? params.field === props?.columnName && // restrict to only given column name
                props?.statesToHighlight?.some(
                  // restrict to only the states to highlight
                  (v) => v === params?.row?.state
                ) &&
                "Highlight"
              : params?.row?.isInitial && params?.row?.isFinal
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
