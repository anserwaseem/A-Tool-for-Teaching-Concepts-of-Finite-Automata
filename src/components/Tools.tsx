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

export const Tools = (props: ToolsProps) => {
  console.log("re rendering Tools: props");

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseToolsMenu = () => {
    setAnchorElUser(null);
  };

  //   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  //   const toggleDrawer =
  //     (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
  //       if (
  //         event.type === "keydown" &&
  //         ((event as React.KeyboardEvent).key === "Tab" ||
  //           (event as React.KeyboardEvent).key === "Shift")
  //       ) {
  //         return;
  //       }

  //       setIsDrawerOpen(open);
  //     };

  //   const list = () => (
  //     <Box
  //       sx={{ width: 250 }}
  //       role="presentation"
  //       onClick={toggleDrawer(false)}
  //       onKeyDown={toggleDrawer(false)}
  //     >
  //       <List>
  //         {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
  //           <ListItem key={text} disablePadding>
  //             <ListItemButton>
  //               <ListItemIcon>
  //                 {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //               </ListItemIcon>
  //               <ListItemText primary={text} />
  //             </ListItemButton>
  //           </ListItem>
  //         ))}
  //       </List>
  //       <Divider />
  //       <List>
  //         {["All mail", "Trash", "Spam"].map((text, index) => (
  //           <ListItem key={text} disablePadding>
  //             <ListItemButton>
  //               <ListItemIcon>
  //                 {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //               </ListItemIcon>
  //               <ListItemText primary={text} />
  //             </ListItemButton>
  //           </ListItem>
  //         ))}
  //       </List>
  //     </Box>
  //   );

  return (
    // <>
    //   <Button onClick={toggleDrawer(true)}>Tools</Button>
    //   <Drawer
    //     anchor="left"
    //     open={isDrawerOpen}
    //     onClose={toggleDrawer(false)}
    //     sx={{
    //       width: 250,
    //       flexShrink: 0,
    //       [`& .MuiDrawer-paper`]: {
    //         width: 250,
    //         boxSizing: "border-box",
    //       },
    //     }}
    //   >
    //     {list()}
    //   </Drawer>
    // </>

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
          <Button variant="text" component="label">
            Is DFA
          </Button>
        </MenuItem>
      </Menu>
    </Box>
  );
};
