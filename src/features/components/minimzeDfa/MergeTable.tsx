import {
  Box,
  Button,
  ButtonGroup,
  CssBaseline,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { AnimationDurationOptions } from "../../../consts/AnimationDurationOptions";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import { RowModel } from "../../../models";
import { MergeTableProps } from "./props/MergeTableProps";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { MergeTableRowModel } from "../../../models/minimizeDfa/MergeTableRowModel";
import { MaxNumberOfStates } from "../../../consts/MaxNumberOfStates";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { ToolsTransitionTableProps } from "../tools/props/TransitionTableProps";
import { ToolsTransitionTable } from "../tools/TransitionTable";
import { ToolsPlayground } from "../tools/Playground";
import { ToolsPlaygroundProps } from "../tools/props/PlaygroundProps";
import { DataContext } from "../../../components/Editor";

const numberOfColumns = 3; // one for state, one for a and one for b
let index = numberOfColumns;

const drawerWidth = 200;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: number;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),

  ...(open === 0 && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
  marginLeft: `-${drawerWidth}px`,
  marginRight: `-${drawerWidth * 2}px`,

  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...(open === 1 && {
    marginLeft: 0,
  }),
  ...(open === 2 && {
    marginRight: 0,
  }),
}));

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
  backgroundColor: "rgb(200, 200, 200)",
  position: "absolute",
  alignItems: "center",

  ...(open === 0 && {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
  ...(open === 1 && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  }),
  ...(open === 2 && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const MergeTable = (props: MergeTableProps) => {
  console.log("re rendering MergeTable, props: ", props);

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [mergeTableRows, setMergeTableRows] = useState<MergeTableRowModel[]>(
    []
  );
  const [mergeTableColumns, SetMergeTableColumns] = useState<GridColDef[]>([]);

  const theme = useTheme();
  const [open, setOpen] = useState(0); // 1 for table open, 2 for dfa open, 0 for both close

  const handleTableOpen = () => {
    setOpen(1);
  };

  const handleTableClose = () => {
    setOpen(0);
  };
  const handleDfaOpen = () => {
    setOpen(2);
  };

  const handleDfaClose = () => {
    setOpen(0);
  };

  // make DataGrid of props.rows.length by props.rows.length size as soon as props.rows is updated
  useEffect(() => {
    if (dataContext.rows?.length > 0) {
      const columns: GridColDef[] = [
        { field: "id", hide: true, hideable: false },
        {
          field: "state",
          headerName: "",
          disableColumnMenu: true,
          sortable: false,
          flex: 1,
        },
      ];

      const rows: MergeTableRowModel[] = [];
      for (let i = 0; i < dataContext.rows.length; i++) {
        columns.push({
          field: dataContext.rows[i].state,
          headerName: dataContext.rows[i].state,
          disableColumnMenu: true,
          sortable: false,
          flex: 1,
        });

        // put each state in the first column
        rows.push({
          id: i,
          state: dataContext.rows[i].state,
        });
      }

      SetMergeTableColumns(columns);
      setMergeTableRows(rows);
    }
  }, [dataContext.rows]);

  useEffect(() => {
    console.log(
      "MergeTable useEffect, isPlaying, duration: ",
      isPlaying,
      duration
    );
    if (isPlaying) {
      let timer = setTimeout(() => {
        console.log("inside set timeout, index", index);
        const rowIndex = Math.floor(index / numberOfColumns);

        // handleUpdateData(rowIndex, props.rows.slice(0, rowIndex));

        // stop if all rows have been displayed i.e., if rowIndex equals rows length and last row's last column has been displayed
        if (
          rowIndex === dataContext.rows.length &&
          index % numberOfColumns === numberOfColumns - 1
        ) {
          setIsComplete(true);
          setIsPlaying(false);
        } else index++;
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [props, mergeTableRows, isPlaying]);

  const handleUpdateData = (rowIndex: number, rows: RowModel[]) => {
    console.log(
      "MergeTable handleUpdateData, rowIndex, index, rows: ",
      rowIndex,
      index,
      rows
    );
  };

  const handleDurationChange = (event: SelectChangeEvent) => {
    console.log(
      "MergeTable handleDurationChange, event.target.value, duration: ",
      event.target.value,
      duration
    );
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    console.log("MergeTable handleAnimation");
    if (isComplete) {
      // when replay button is clicked, null clossure component is re rendered
      // so, modified transition table AND resultant dfa are made hidden until animation is completed
      // because modified transition table and resultant dfa are dependent on null closure table
      setIsReady(false);
      setIsComplete(false);
      index = 1;
      setIsPlaying(true);
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    console.log("MergeTable show next row, index: ", index);
    const rowIndex = Math.floor(index / numberOfColumns);
    if (isComplete) {
      setIsReady(true);
      props.setCompletedMergeTableRows(mergeTableRows);
      props.setIsMergeTableComplete(true);
    }

    // handleUpdateData(rowIndex, props.rows.slice(0, rowIndex));

    // stop if all rows have been displayed i.e., if rowIndex equals rows length and last row's last column has been displayed
    if (rowIndex === dataContext.rows.length && index % numberOfColumns !== 0) {
      setIsComplete(true);
      setIsPlaying(false);
    } else index++;
  };

  const transitionTableProps: ToolsTransitionTableProps = {
    rows: dataContext.rows.map((row) => {
      return {
        ...row,
        ...Object.fromEntries(
          PossibleTransitionValues.concat("state").map((key) => [
            key === "^" ? "nul" : key,
            row[key === "^" ? "nul" : key]
              .toString()
              .split(" ")
              .filter((key) => key !== "")
              .map((tv) => tv.replace("mt", ""))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),

    columns: dataContext.columns
      .filter((col) => col.field !== "action" && col.field !== "nul")
      .map((col) => {
        return {
          ...col,
          editable: false,
        };
      }),
  };

  const playgroundProps: ToolsPlaygroundProps = {
    states: dataContext.states.map((state) => {
      return {
        ...state,
        id: `${state.id}mt`,
      };
    }),

    transitions: dataContext.transitions.map((transition) => {
      return {
        ...transition,
        props: {
          ...transition.props,
          start: `${transition.props.start}mt`,
          end: `${transition.props.end}mt`,
        },
      };
    }),
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar open={open}>
          <Toolbar>
            <IconButton
              color="secondary"
              aria-label="open transition table"
              onClick={handleTableOpen}
              edge="start"
              sx={{
                ...(open === 1 && { mr: 2, display: "none" }),
              }}
            >
              <TableChartOutlinedIcon />
            </IconButton>
            <Typography
              noWrap
              variant="h5"
              component="div"
              fontWeight={"bold"}
              color={"black"}
            >
              Merge Table
            </Typography>
            <IconButton
              color="secondary"
              aria-label="open drawer"
              edge="end"
              onClick={handleDfaOpen}
              sx={{
                display: { xs: "none", md: "none", lg: "block" },
                marginTop: { lg: "8px" },
                ...(open === 2 && { display: "none" }),
              }}
            >
              <AccountTreeOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              position: "relative",
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#f5f5f5",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open === 1}
        >
          <DrawerHeader
            sx={{
              justifyContent: "flex-end",
              backgroundColor: "rgb(200, 200, 200)",
              boxShadow:
                "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
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
            <IconButton onClick={handleTableClose}>
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
            <ToolsTransitionTable {...transitionTableProps} />
          </Box>
        </Drawer>

        <Main open={open}>
          <DrawerHeader />
          <Grid container xs={12}>
            {/* Grid for Add a Row button and Tools */}
            <Grid container alignItems={"center"}>
              <Grid item xs={12}>
                <ButtonGroup
                  disableElevation
                  fullWidth
                  variant="outlined"
                  size="large"
                >
                  <FormControl fullWidth>
                    <InputLabel id="delay-select-label">Delay</InputLabel>
                    <Select
                      labelId="delay-select-label"
                      id="delay-select"
                      value={duration.toString()}
                      label="Delay"
                      onChange={handleDurationChange}
                    >
                      {AnimationDurationOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* <Button onClick={handleAnimationPause}>Pause</Button> */}
                  <Button
                    onClick={handleAnimation}
                    startIcon={
                      isPlaying ? (
                        <PauseRoundedIcon />
                      ) : isComplete ? (
                        <ReplayRoundedIcon />
                      ) : (
                        <PlayArrowRoundedIcon />
                      )
                    }
                  >
                    {isPlaying ? "Pause" : isComplete ? "Replay" : "Play"}
                  </Button>
                  <Button
                    variant={isComplete ? "contained" : "outlined"}
                    onClick={showNextRow}
                    disabled={isReady}
                  >
                    {isComplete ? "Complete" : "Next"}
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
            <DataGrid
              rows={mergeTableRows}
              columns={mergeTableColumns}
              autoHeight
              hideFooter
              pageSize={MaxNumberOfStates}
              // disableSelectionOnClick
              // experimentalFeatures={{ newEditingApi: true }}
            />
          </Grid>
        </Main>

        <Drawer
          sx={{
            width: drawerWidth * 2,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              position: "relative",
              width: drawerWidth * 2,
              boxSizing: "border-box",
              backgroundColor: "#f5f5f5",
            },
          }}
          variant="persistent"
          anchor="right"
          open={open === 2}
        >
          <DrawerHeader
            sx={{
              justifyContent: "flex-start",
              backgroundColor: "rgb(200, 200, 200)",
              boxShadow:
                "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
            }}
          >
            <IconButton onClick={handleDfaClose}>
              {theme.direction === "rtl" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
            <Typography
              noWrap
              variant="overline"
              align="center"
              fontWeight={"bold"}
            >
              Original DFA
            </Typography>
          </DrawerHeader>
          <Divider />
          {/* <Box
            sx={{
              marginTop: "40%",
            }}
          > */}
          <ToolsPlayground {...playgroundProps} />
          {/* </Box> */}
        </Drawer>
      </Box>
    </>
  );
};
