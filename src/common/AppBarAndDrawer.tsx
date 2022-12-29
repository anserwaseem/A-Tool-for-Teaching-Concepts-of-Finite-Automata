import {
  Toolbar,
  Grid,
  IconButton,
  Typography,
  Drawer,
  Divider,
  Box,
  styled,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { appBarBackgroundColor, drawerHeaderBoxShadow } from "../consts/Colors";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { ToolsTransitionTable } from "../features/components/tools/TransitionTable";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { AppBarAndDrawerProps } from "./props/AppBarAndDrawerProps";
import { DrawerHeader } from "./DrawerHeader";
import { DrawerWidth } from "../consts/DrawerWidth";

interface AppBarProps extends MuiAppBarProps {
  open?: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  top: "auto",
  backgroundColor: appBarBackgroundColor,
  position: "absolute",

  ...(open === 0 && {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
  ...(open === 1 && {
    width: `calc(100% - ${DrawerWidth}px)`,
    marginLeft: DrawerWidth,
  }),
}));

export const AppBarAndDrawer = (props: AppBarAndDrawerProps) => {
  const theme = useTheme();

  return (
    <>
      <AppBar open={props.open}>
        <Toolbar>
          <Grid container>
            <Grid item xs={5}>
              <IconButton
                color="secondary"
                aria-label="open transition table"
                onClick={() => {
                  props.setOpen(1);
                }}
                sx={{
                  ml: -1,
                  ...(props.open === 1 && { mr: 2, display: "none" }),
                }}
              >
                <TableChartOutlinedIcon />
              </IconButton>
            </Grid>
            <Grid item xs={7}>
              <Typography
                noWrap
                variant="h5"
                fontWeight={"bold"}
                color={"black"}
                sx={{
                  ...(props.open === 0 && { mt: 0.5 }),
                }}
              >
                {props.title}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: DrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            position: "relative",
            width: DrawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
          },
        }}
        variant="persistent"
        anchor="left"
        open={props.open === 1}
      >
        <DrawerHeader
          sx={{
            justifyContent: "space-evenly",
            backgroundColor: appBarBackgroundColor,
            boxShadow: drawerHeaderBoxShadow,
          }}
        >
          <Typography
            noWrap
            variant="overline"
            align="center"
            fontWeight={"bold"}
          >
            Transition Table
          </Typography>
          <IconButton
            onClick={() => {
              props.setOpen(0);
            }}
          >
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
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
    </>
  );
};
