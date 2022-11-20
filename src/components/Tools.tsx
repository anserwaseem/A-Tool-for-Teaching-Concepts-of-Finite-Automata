import {
  Box,
  Tooltip,
  IconButton,
  Menu,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Drawer,
  Toolbar,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Download } from "../features/Download";
import { Upload } from "../features/Upload";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { ToolsProps } from "./props/ToolsProps";
import { IsDFA } from "../utils/IsDFA";
import { MINIMIZE_DFA, NFA_TO_DFA } from "./types/AvailableTools";

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
            IsDFA(props.rows);
          }}
        >
          Is DFA
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseToolsMenu();
            props.setToolSelected(NFA_TO_DFA);
          }}
        >
          {NFA_TO_DFA}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseToolsMenu();
            props.setToolSelected(MINIMIZE_DFA);
          }}
        >
          {MINIMIZE_DFA}
        </MenuItem>
      </Menu>
    </Box>
  );
};
