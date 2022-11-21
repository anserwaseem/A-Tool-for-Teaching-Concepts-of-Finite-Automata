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
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  useGridApiRef,
} from "@mui/x-data-grid";
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
import CheckIcon from "@mui/icons-material/Check";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeOutlined";
import ClearIcon from "@mui/icons-material/Clear";

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

  const [duration, setDuration] = useState(AnimationDurationOptions[3]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [mergeTableRows, setMergeTableRows] = useState<any[]>([]);
  const [mergeTableColumns, SetMergeTableColumns] = useState<GridColDef[]>([]);
  const [stepNumber, setStepNumber] = useState<boolean>(null); // null for step 0, false for step 1 and true for step 2

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
        {
          field: "state",
          headerName: "",
          disableColumnMenu: true,
          sortable: false,
          flex: 1,
        },
      ];

      const rows = [];
      for (let i = 0; i < dataContext.rows.length; i++) {
        columns.push({
          field: `cell-${dataContext.rows[i].state}`,
          headerName: dataContext.rows[i].state,
          disableColumnMenu: true,
          sortable: false,
          flex: 1,
        });

        // put each state in the first column
        rows.push({
          id: i,
          state: dataContext.rows[i].state,
          // [`cell-${dataContext.rows[i].state}`]:
          //   dataContext.rows[i].state + "w",
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
        console.log("inside set timeout");

        handleUpdateData();

        // stop if all rows are filled
        if (false) {
          setIsComplete(true);
          setIsPlaying(false);
        }
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [dataContext.rows, mergeTableRows, isPlaying, stepNumber]);

  const handleUpdateData = () => {
    console.log("MergeTable handleUpdateData: stepNumber: ", stepNumber);
    if (stepNumber === null) {
      setMergeTableRows(markDiagonalCells());
      setStepNumber(false);
    } else if (stepNumber === false) {
      setMergeTableRows(markUpperTriangularCells(markDiagonalCells()));
      setStepNumber(true);
    } else alert("markNonDiagonalEntries");

    // const columns = mergeTableColumns.map((column) => {
    //   if (column.field?.startsWith("cell-")) {
    //     return {
    //       ...column,
    //       renderCell: renderCell,
    //     };
    //   } else {
    //     return column;
    //   }
    // });

    // if (stepNumber) {
    //   // markUpperTriangularEntries();
    //   alert("markNonDiagonalEntries");
    // }

    // SetMergeTableColumns(columns);
    // setStepNumber(
    //   stepNumber === null ? false : stepNumber === false ? true : null
    // );
  };

  const markDiagonalCells = () => {
    console.log("markDiagonalCells");
    return mergeTableRows.map((row) => {
      return {
        ...row,
        [`cell-${row.state}`]: "✓",
      };
    });
    // console.log("markDiagonalCells rows: ", rows);

    // setMergeTableRows(rows);
  };

  const markUpperTriangularCells = (rows: any[]) => {
    console.log("markUpperTriangularCells");
    const stateNames = dataContext.rows.map((row) => row.state);
    return rows.map((row, i) => {
      const stateIndex = stateNames.indexOf(row.state);
      const cells = stateNames.map((state, index) => {
        if (stateIndex > index) {
          return "-"; // TODO Cross ✕
        } else {
          return "";
        }
      });
      console.log("cells at i: ", i, cells);
      console.log({
        ...row,
        // mark Dash to only those cells which are not empty
        ...cells.reduce((acc, cell, index) => {
          if (cell !== "") {
            acc[`cell-${stateNames[index]}`] = cell;
          }
          return acc;
        }, {}),
      });
      return {
        ...row,
        // paste value of only those cells which are not empty
        ...cells.reduce((acc, cell, index) => {
          if (cell !== "") {
            acc[`cell-${stateNames[index]}`] = cell;
          }
          return acc;
        }, {}),
      };
    });
    // console.log("markUpperTriangularCells rows: ", rows);

    // setMergeTableRows(rows);
  };

  const renderCell = (params: GridRenderCellParams<string>) => {
    console.log("MergeTable renderCell, params: ", params);
    const { id, field, value } = params;

    // mark diagonal entries as Tick
    if (field?.replace("cell-", "") === params.row.state) {
      return <CheckIcon />;
    }
    // mark uppeer triangular entries as Cross
    if (
      (stepNumber as any) !== null &&
      field?.replace("cell-", "") < params.row.state
    ) {
      return <MinimizeRoundedIcon fontSize="small" />;
    }
    // mark lower triangular entries
    if (stepNumber) {
      return "ok";
    } else return "";
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
      setIsPlaying(true);
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    console.log("MergeTable show next row");
    if (isComplete) {
      setIsReady(true);
      // props.setCompletedMergeTableRows(mergeTableRows);
      props.setIsMergeTableComplete(true);
    }

    handleUpdateData();

    if (mergeTableRows.every((row) => row.state !== "")) {
      setIsComplete(true);
      setIsPlaying(false);
    }
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
          <Grid container>
            {/* Grid for Add a Row button and Tools */}
            <Grid item alignItems={"center"} xs={12}>
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
            <Grid item xs={12}>
              <DataGrid
                rows={mergeTableRows}
                columns={mergeTableColumns}
                autoHeight
                hideFooter
                pageSize={MaxNumberOfStates}
                // density="compact"
                // disableSelectionOnClick
                // experimentalFeatures={{ newEditingApi: true }}
              />
            </Grid>
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
