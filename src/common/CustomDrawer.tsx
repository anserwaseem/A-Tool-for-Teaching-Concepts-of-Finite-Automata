import {
  Typography,
  IconButton,
  Divider,
  Box,
  Drawer,
  Grid,
} from "@mui/material";
import { appBarBackgroundColor, drawerHeaderBoxShadow } from "../consts/Colors";
import { DrawerWidth } from "../consts/DrawerWidth";
import { ToolsTransitionTable } from "../features/components/tools/TransitionTable";
import { DrawerHeader } from "./DrawerHeader";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { CustomDrawerProps } from "./props/CustomDrawerProps";

export const CustomDrawer = (props: CustomDrawerProps) => {
  console.log("re rendering CustomDrawer, props: ", props);

  return (
    <Drawer
      sx={{
        width:
          window.innerWidth <= 525
            ? window.innerWidth
            : props.isLeft || props.open === 2
            ? DrawerWidth
            : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          position: "relative",
          marginTop: window.innerWidth <= 525 ? "64px" : 0,
          mx: window.innerWidth <= 525 ? 1 : 0,
          width:
            window.innerWidth <= 525
              ? window.innerWidth - 16
              : props.isLeft || props.open === 2
              ? DrawerWidth
              : 0,
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
        },
      }}
      variant="persistent"
      anchor={
        window.innerWidth <= 525 ? "top" : props.isLeft ? "left" : "right"
      }
      open={props.isLeft ? props.open === 1 : props.open === 2}
    >
      <DrawerHeader
        sx={{
          justifyContent: "space-evenly",
          backgroundColor: appBarBackgroundColor,
          boxShadow: drawerHeaderBoxShadow,
          minHeight: window.innerWidth <= 525 && "40px !important",
        }}
      >
        <Grid container justifyContent="space-around" alignItems="center">
          <Grid item order={props.isLeft ? 1 : 2}>
            <Typography
              noWrap
              variant="overline"
              align="center"
              fontWeight={"bold"}
            >
              {props.title}
            </Typography>
          </Grid>
          <Grid item order={props.isLeft ? 2 : 1}>
            <IconButton
              onClick={() => {
                props.setOpen(0);
              }}
            >
              {window.innerWidth <= 525 ? (
                <ExpandLessIcon />
              ) : props.isLeft ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </Grid>
        </Grid>
      </DrawerHeader>
      <Divider />
      <Box
        sx={{
          marginTop: window.innerWidth <= 525 ? "16px" : "35%",
        }}
      >
        <ToolsTransitionTable {...props.transitionTableProps} />
      </Box>
    </Drawer>
  );
};
