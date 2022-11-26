import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { TransitionTableProps } from "./props/TransitionTableProps";
import { MaxNumberOfStates } from "../consts/MaxNumberOfStates";
import { GetBackgroundColor } from "../utils/GetBackgroundColor";

const TransitionTable = (props: TransitionTableProps) => {
  console.log("re rendering TransitionTable: props", props);

  return (
    <Box
      sx={{
        "& .super-app-theme--Both": {
          bgcolor: (theme) =>
            `${GetBackgroundColor(
              theme.palette.info.main,
              theme.palette.mode,
              0.25
            )} !important`,
        },

        "& .super-app-theme--Initial": {
          bgcolor: (theme) =>
            `${GetBackgroundColor(
              theme.palette.warning.light,
              theme.palette.mode,
              0.25
            )} !important`,
        },

        "& .super-app-theme--Final": {
          bgcolor: (theme) =>
            `${GetBackgroundColor(
              theme.palette.success.light,
              theme.palette.mode,
              0.25
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
        // getRowClassName={(params) =>
        //   `super-app-theme--${
        //     params?.row?.isInitial && params?.row?.isFinal
        //       ? "Both"
        //       : params?.row?.isInitial
        //       ? "Initial"
        //       : params?.row?.isFinal && "Final"
        //   }`
        // }
        getCellClassName={(params) =>
          `super-app-theme--${
            params.field !== "state"
              ? ""
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
export default TransitionTable;
