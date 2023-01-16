import { Toolbar, Grid, IconButton, Typography, styled } from "@mui/material";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { appBarBackgroundColor } from "../consts/Colors";
import { DrawerWidth } from "../consts/DrawerWidth";
import { CustomAppBarProps } from "./props/CustomAppBarProps";

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
    width: window.innerWidth <= 525 ? "100%" : `calc(100% - ${DrawerWidth}px)`,
    marginLeft: DrawerWidth,
  }),
  ...(open === 2 && {
    width: window.innerWidth <= 525 ? "100%" : `calc(100% - ${DrawerWidth}px)`,
    marginRight: window.innerWidth <= 525 ? 0 : DrawerWidth,
  }),
}));

export const CustomAppBar = (props: CustomAppBarProps) => {
  console.log("re rendering CustomAppBar, props: ", props);

  return (
    <AppBar open={props.open}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <IconButton
              color="secondary"
              aria-label="open transition table"
              edge="start"
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
          <Grid item>
            <Typography noWrap variant="h5" fontWeight={"bold"} color={"black"}>
              {props.title}
            </Typography>
          </Grid>
          <Grid item>
            {props.showRightIcon && (
              <IconButton
                color="secondary"
                aria-label="open transition table"
                onClick={() => {
                  props.setOpen(2);
                }}
                sx={{
                  marginTop: { lg: "8px" },
                  ...(props.open === 2 && { display: "none" }),
                }}
              >
                <TableChartOutlinedIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
