import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { darken, lighten } from "@mui/material/styles";
import { TransitionTableProps } from "./props/TransitionTableProps";
import { RowModel } from "../models";

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const TransitionTable = (props: TransitionTableProps) => {
  return (
    <>
      <Button
        size="small"
        onClick={() =>
          props.handleAddRow(
            new RowModel(props.gridRowId, "", "", "", "", false, false)
          )
        }
      >
        Add a row
      </Button>
      <Box
        sx={{
          "& .super-app-theme--Both": {
            bgcolor: (theme) =>
              `${getBackgroundColor(
                theme.palette.error.main,
                theme.palette.mode
              )} !important`,
          },

          "& .super-app-theme--Initial": {
            bgcolor: (theme) =>
              `${getBackgroundColor(
                theme.palette.info.main,
                theme.palette.mode
              )} !important`,
          },

          "& .super-app-theme--Final": {
            bgcolor: (theme) =>
              `${getBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode
              )} !important`,
          },
        }}
      >
        <DataGrid
          rows={props.gridData}
          columns={props.gridColumns}
          autoHeight
          hideFooter
          experimentalFeatures={{ newEditingApi: true }}
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
    </>
  );
};
export default TransitionTable;
