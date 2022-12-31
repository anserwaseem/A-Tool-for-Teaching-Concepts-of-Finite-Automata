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
import { CustomDrawerProps } from "./props/CustomDrawerProps";

export const CustomDrawer = (props: CustomDrawerProps) => {
  console.log("re rendering CustomDrawer, props: ", props);

  return (
    <Drawer
      sx={{
        width: props.isLeft || props.open === 2 ? DrawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          position: "relative",
          width: props.isLeft || props.open === 2 ? DrawerWidth : 0,
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
        },
      }}
      variant="persistent"
      anchor={props.isLeft ? "left" : "right"}
      open={props.isLeft ? props.open === 1 : props.open === 2}
    >
      <DrawerHeader
        sx={{
          justifyContent: "space-evenly",
          backgroundColor: appBarBackgroundColor,
          boxShadow: drawerHeaderBoxShadow,
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
              {props.isLeft ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Grid>
        </Grid>
      </DrawerHeader>
      <Divider />
      <Box
        sx={{
          marginTop: "40%",
        }}
      >
        <ToolsTransitionTable {...props.transitionTableProps} />
      </Box>
    </Drawer>
  );
};
