import { Box, Button, Grid, IconButton, Menu, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { darken, lighten } from "@mui/material/styles";
import { TransitionTableProps } from "./props/TransitionTableProps";
import { RowModel } from "../models";
import { useState } from "react";
import { MaxNumberOfStates } from "../consts/MaxNumberOfStates";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Download } from "./Download";
import { Upload } from "./Upload";

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0) : lighten(color, 0);

const TransitionTable = (props: TransitionTableProps) => {
  console.log("re rendering TransitionTable: props", props);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseToolsMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Grid container alignItems={"center"}>
        <Grid item xs={11}>
          <Button
            size="small"
            onClick={() =>
              props.handleAddRow(
                new RowModel(
                  props.rowId,
                  `q${props.rowId}`,
                  "",
                  "",
                  "",
                  false,
                  false
                )
              )
            }
          >
            Add a row
          </Button>
        </Grid>

        <Grid item xs={1}>
          <Box>
            <Tooltip title="Tools">
              <IconButton
                size="large"
                aria-label="tools"
                aria-controls="menu-appbar-tools"
                aria-haspopup="true"
                onClick={handleOpenUserMenu}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar-tools"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseToolsMenu}
            >
              <Download handleCloseToolsMenu={handleCloseToolsMenu} />
              <Upload handleCloseToolsMenu={handleCloseToolsMenu} />
            </Menu>
          </Box>
        </Grid>
      </Grid>

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
    </>
  );
};
export default TransitionTable;
