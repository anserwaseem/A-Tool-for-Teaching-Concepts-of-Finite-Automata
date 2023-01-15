import { Box, Menu, Button, MenuItem } from "@mui/material";
import { useState } from "react";
import { Download } from "../../features/Download";
import { DownloadProps } from "../../features/props/DownloadProps";
import { UploadProps } from "../../features/props/UploadProps";
import { Upload } from "../../features/Upload";
import { ToolsProps } from "./props/ToolsProps";
import * as AvailableTools from "../../consts/AvailableTools";

export const Tools = (props: ToolsProps) => {
  console.log("re rendering Tools: props", props);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseToolsMenu = () => {
    setAnchorElUser(null);
  };

  const downloadProps: DownloadProps = {
    handleCloseToolsMenu: handleCloseToolsMenu,
    setAlertMessage: props.setAlertMessage,
  };

  const uploadProps: UploadProps = {
    handleCloseToolsMenu: handleCloseToolsMenu,
    setAlertMessage: props.setAlertMessage,
  };

  return (
    <>
      <Box>
        <Button
          size="small"
          aria-label="tools"
          aria-controls="menu-appbar-tools"
          aria-haspopup="true"
          onClick={handleOpenUserMenu}
          sx={{ marginLeft: 3 }}
        >
          Tools
        </Button>
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
          <Download {...downloadProps} />
          <Upload {...uploadProps} />
          <MenuItem
            onClick={() => {
              handleCloseToolsMenu();
              props.setToolSelected(AvailableTools.IS_DFA);
            }}
          >
            {AvailableTools.IS_DFA}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseToolsMenu();
              props.setToolSelected(AvailableTools.IS_NFA);
            }}
          >
            {AvailableTools.IS_NFA}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseToolsMenu();
              props.setToolSelected(AvailableTools.NFA_TO_DFA);
            }}
          >
            {AvailableTools.NFA_TO_DFA}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseToolsMenu();
              props.setToolSelected(AvailableTools.MINIMIZE_DFA);
            }}
          >
            {AvailableTools.MINIMIZE_DFA}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseToolsMenu();
              props.setToolSelected(AvailableTools.TEST_A_STRING);
              props.setIsTestAStringDialogOpen(true);
            }}
          >
            {AvailableTools.TEST_A_STRING}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseToolsMenu();
              props.setToolSelected(AvailableTools.HIGHLIGHT_NULL_TRANSITIONS);
            }}
          >
            {AvailableTools.HIGHLIGHT_NULL_TRANSITIONS}
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};
