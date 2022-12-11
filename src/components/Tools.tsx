import { Box, Menu, Button, MenuItem } from "@mui/material";
import { useState } from "react";
import { Download } from "../features/Download";
import { Upload } from "../features/Upload";
import { ToolsProps } from "./props/ToolsProps";
import * as AvailableTools from "./types/AvailableTools";

export const Tools = (props: ToolsProps) => {
  console.log("re rendering Tools: props");

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseToolsMenu = () => {
    setAnchorElUser(null);
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
          <Download handleCloseToolsMenu={handleCloseToolsMenu} />
          <Upload handleCloseToolsMenu={handleCloseToolsMenu} />
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
