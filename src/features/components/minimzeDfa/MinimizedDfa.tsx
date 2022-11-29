import {
  Alert,
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
  Snackbar,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AnimationDurationOptions } from "../../../consts/AnimationDurationOptions";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { ToolsTransitionTableProps } from "../tools/props/TransitionTableProps";
import { ToolsTransitionTable } from "../tools/TransitionTable";
import { DataContext } from "../../../components/Editor";
import { MinimizedDfaProps } from "./props/MinimizedDfaProps";
import { ToolsPlayground } from "../tools/Playground";
import { ToolsPlaygroundProps } from "../tools/props/PlaygroundProps";
import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../models";
import { StyledTransitionLabel } from "../playground/StyledTransitionLabel";

const drawerWidth = 300;
let sliceIndex = 0; // index of such row (of Equivalence table) is saved where more than one Ticks are present
let transitionIndex = 0; // used to keep track of which (transition table's) row's transitions are being animated

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

  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...(open === 1 && {
    marginLeft: 0,
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
  backgroundColor: "rgba(148, 148, 148, 0.15)",
  position: "absolute",

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
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const MinimizedDfa = (props: MinimizedDfaProps) => {
  console.log("re rendering MinimizedDfa, props: ", props);

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[6]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [minimizedDfaRows, setMinimizedDfaRows] = useState<RowModel[]>([]);
  const [minimizedDfaStates, setMinimizedDfaStates] = useState<
    DraggableStateModel[]
  >([]);
  const [minimizedDfaTransitions, setMinimizedDfaTransitions] = useState<
    TransitionModel[]
  >([]);

  // 0 for showing explanation of showing original transition table and original DFA,
  // 1 for removing all transitions from DFA,
  // 2 for showing its explanation,
  // 3 for MergeStep,
  // 4 for TransitionStep,
  const [displayStep, setDisplayStep] = useState<number>(0);

  // 0 by default
  // 1 for merging rows & states
  // 2 for showing its explanation
  const [mergeStep, setMergeStep] = useState<number>(0);
  const [stateNamesToMerge, setStateNamesToMerge] = useState<string[]>([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const theme = useTheme();
  const [open, setOpen] = useState(1);

  const handleTableOpen = () => {
    setOpen(1);
  };

  const handleTableClose = () => {
    setOpen(0);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    setMinimizedDfaRows(dataContext?.rows);
    setMinimizedDfaStates(props?.states);
    setMinimizedDfaTransitions(props?.transitions);
  }, []);

  useEffect(() => {
    if (isPlaying && mergeStep !== 1) {
      let timer = setTimeout(() => {
        console.log("inside set timeout");

        handleUpdateData();
      }, duration * 1000);
      return () => clearTimeout(timer);
    } else if (mergeStep === 1) {
      const stateToMergeInto = minimizedDfaStates.find(
        (state) => state.id?.replace("md", "") === stateNamesToMerge[0]
      );
      const statesToMerge = minimizedDfaStates.filter((state) =>
        stateNamesToMerge
          .filter(
            (stateName) => stateName?.replace("md", "") !== stateNamesToMerge[0]
          )
          .includes(state.id?.replace("md", ""))
      );

      // run timer 100 times for duration * 10 time
      let i = 1;
      var started = Date.now();
      var timer = setInterval(function () {
        var timePassed = Date.now() - started;
        if (timePassed >= duration * 1010) {
          clearInterval(timer);
          mergeStates();
          mergeRows();
          setMergeStep(0);
          setDisplayStep(4);
          return;
        }
        const newStates = minimizedDfaStates.map((state) => {
          if (statesToMerge.map((state) => state.id).includes(state.id)) {
            return {
              ...state,
              x: state.x + (i * (stateToMergeInto.x - state.x)) / 100,
              y: state.y + (i * (stateToMergeInto.y - state.y)) / 100,
            };
          } else {
            return state;
          }
        });
        setMinimizedDfaStates(newStates);
        i++;

        console.log("setInterval i: ", i);
      }, duration * 10);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, displayStep, mergeStep]);

  const handleUpdateData = () => {
    console.log("MinimizedDfa handleUpdateData: stepNumber: ", displayStep);
    if (displayStep === 0) {
      setSnackbarMessage(
        "This is the original transition table and the original DFA."
      );
      setOpenSnackbar(true);
      setDisplayStep(1);
    } else if (displayStep === 1) {
      setMinimizedDfaTransitions([]);
      setDisplayStep(2);
    } else if (displayStep === 2) {
      setSnackbarMessage("All transitions of the original DFA are removed.");
      setOpenSnackbar(true);
      setDisplayStep(3);
    } else if (displayStep === 3) {
      const stateNames = getStateNamesToBeMerged();
      if (stateNames?.length === 0) {
        setDisplayStep(5);
      } else {
        setStateNamesToMerge(stateNames);
        setMergeStep(1);
      }
    } else if (displayStep === 4) {
      setSnackbarMessage(
        `
        The states ${stateNamesToMerge
          .slice(0, -1)
          .join(", ")} and ${stateNamesToMerge.at(-1)} are merged.
        `
      );
      setOpenSnackbar(true);
      setDisplayStep(3);
    } else if (displayStep === 5) {
      // add transitions for each row one by one
      handleUpdatingTransitions();
      setDisplayStep(6);
    } else if (displayStep === 6) {
      setSnackbarMessage(
        `Added transitions for row ${transitionIndex} of the transition table.`
      );
      setOpenSnackbar(true);
      if (transitionIndex === minimizedDfaRows.length) {
        setIsComplete(true);
        setIsPlaying(false);
      } else setDisplayStep(5);
    }
  };

  const handleUpdatingTransitions = () => {
    const row = minimizedDfaRows?.[transitionIndex];
    let newtransitions = [...minimizedDfaTransitions] as TransitionModel[];
    PossibleTransitionValues.filter(
      (transitionValue) => transitionValue !== "^"
    ).forEach((transitionValue) => {
      const transitionExists = newtransitions?.find(
        (t) =>
          t?.props?.start === row?.state &&
          t?.props?.end === row?.[transitionValue]
      );
      const isSelfTransition = row?.state === row?.[transitionValue];
      if (!transitionExists) {
        // add new transition
        newtransitions = [
          ...newtransitions,
          {
            props: {
              labels: <StyledTransitionLabel label={transitionValue} />,
              value: transitionValue,
              start: row?.state + "md",
              end: (row?.[transitionValue] as string) + "md",
              // dashness: { animation: 10 },
              animateDrawing: true,
              _extendSVGcanvas: isSelfTransition ? 25 : 0,
              _cpx1Offset: isSelfTransition ? -50 : 0,
              _cpy1Offset: isSelfTransition ? -50 : 0,
              _cpx2Offset: isSelfTransition ? 50 : 0,
              _cpy2Offset: isSelfTransition ? -50 : 0,
            },
          },
        ];
      } else {
        // update transition
        newtransitions = newtransitions.map((t) => {
          return {
            ...t,
            props: {
              ...t.props,
              labels: (
                <StyledTransitionLabel
                  label={t.props.value + transitionValue}
                />
              ),
              value: t.props.value + transitionValue,
            },
          };
        });
      }
    });
    setMinimizedDfaTransitions(newtransitions);
    transitionIndex++;
  };

  const getStateNamesToBeMerged = () => {
    let stateNames: string[] = [];
    let statesFound = false;
    for (
      let i = sliceIndex;
      i < props?.equivalentStatesRows.length && !statesFound;
      i++
    ) {
      const row = props?.equivalentStatesRows[i];
      // if any two columns of row have ✓, then save those column names
      let tickNumber = 0;
      let previousKey = "";
      Object.keys(row).forEach((key) => {
        if (row[key] === "✓") {
          tickNumber++;
          if (tickNumber === 1) previousKey = key;
          else if (tickNumber === 2) {
            stateNames.push(previousKey, key);
            sliceIndex = i + 1;
            statesFound = true;
          }
        }
      });

      if (stateNames?.length > 1) {
        stateNames = stateNames.map((stateName) =>
          stateName.replace("cell-", "")
        );
      }
    }
    console.log("getStatesToBeMerged: ", stateNames);
    return stateNames;
  };

  const mergeStates = () => {
    setMinimizedDfaStates((prev) => {
      return prev
        .filter(
          (state) =>
            !stateNamesToMerge.slice(1).includes(state.id?.replace("md", ""))
        )
        .map((state) => {
          if (state.id?.replace("md", "") === stateNamesToMerge[0]) {
            return {
              ...state,
              id:
                state.id?.replace("md", "") +
                " " +
                stateNamesToMerge.slice(1).join(" ") +
                "md",
            };
          } else {
            return state;
          }
        });
    });
    console.log("done mergeStates");
  };

  const mergeRows = () => {
    // merge rows having states in statesToMerge array
    for (let i = -1; i > -stateNamesToMerge.length; i--) {
      // find statesToMerge[i] in props?.rows and merge it into statesToMerge[0] props?.rows
      setMinimizedDfaRows((prev) => {
        const rowToMerge = prev.find(
          (row) => row.state === stateNamesToMerge.at(i)
        );
        const rowToMergeInto = prev.find(
          (row) => row.state === stateNamesToMerge[0]
        );
        const mergedRow = getMergedRow(rowToMerge, rowToMergeInto);
        const rowsAfterMerge = prev
          .filter((row) => row.state !== stateNamesToMerge.at(i))
          .map((row) => {
            if (row.state === stateNamesToMerge[0]) {
              return mergedRow;
            }
            return row;
          });
        // look in all PossibleTransitionValues in rowsAfterMerge for rowToMerge.state or rowToMergeInto.state and replace it with mergedRow.state
        const rowsAfterMergeWithReplacedState = rowsAfterMerge.map((row) => {
          const newRow = { ...row };
          for (const [key, value] of Object.entries(row)) {
            if (value === rowToMerge.state || value === rowToMergeInto.state) {
              newRow[key] = mergedRow.state;
            }
          }
          return newRow;
        });
        return rowsAfterMergeWithReplacedState;
      });
    }
  };

  const getMergedRow = (
    rowToMerge: RowModel,
    rowToMergeInto: RowModel
  ): RowModel => {
    const mergedRow = { ...rowToMergeInto };
    Object.keys(rowToMerge).forEach((key) => {
      if (key === "isInitial" || key === "isFinal") {
        mergedRow[key] = mergedRow[key] || rowToMerge[key];
      } else if (key !== "id") {
        mergedRow[key] = Array.from(
          new Set(
            mergedRow[key]
              ?.toString()
              ?.concat(" ", rowToMerge[key]?.toString())
              ?.trimEnd()
              ?.split(" ")
          )
        )?.join(" ");
      }
    });
    return mergedRow;
  };

  const handleDurationChange = (event: SelectChangeEvent) => {
    console.log(
      "EquivalentStates handleDurationChange, event.target.value, duration: ",
      event.target.value,
      duration
    );
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    console.log("MinimizedDfa handleAnimation");
    if (isComplete) {
      // if animation is complete, reset everything i.e., replay
      setIsReady(false);
      setIsComplete(false);
      setIsPlaying(true);

      setDisplayStep(0);
      setMergeStep(0);
      setStateNamesToMerge([]);
      sliceIndex = 0;
      transitionIndex = 0;
      setMinimizedDfaRows(dataContext?.rows);
      setMinimizedDfaStates(props?.states);
      setMinimizedDfaTransitions(props?.transitions);
    } else setIsPlaying((v) => !v);
  };

  const showNextStep = () => {
    console.log("MinimizedDfa showNextStep");
    if (isComplete) {
      setIsReady(true);
      props.setIsMinimizedDfaComplete(true);
    }

    handleUpdateData();

    if (transitionIndex === minimizedDfaRows.length) {
      setIsComplete(true);
      setIsPlaying(false);
    }
  };

  const transitionTableProps: ToolsTransitionTableProps = {
    rows: minimizedDfaRows,

    columns: dataContext.columns
      .filter((col) => col.field !== "action" && col.field !== "nul")
      .map((col) => {
        if (col.field === "state") return { ...col, flex: 1 };
        else
          return {
            ...col,
            editable: false,
          };
      }),
  };

  const playgroundProps: ToolsPlaygroundProps = {
    states: minimizedDfaStates,
    transitions: minimizedDfaTransitions,
    canvasWidth: "150%",
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={
            isPlaying ? duration * 1000 : duration * 1000 * 1000
          }
          onClose={handleSnackbarClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="info"
            sx={{ width: "100%" }}
            // icon={
            //   snackbarMessage?.at(-1) === "✓" ? (
            //     <CheckIcon fontSize="medium" />
            //   ) : snackbarMessage?.at(-1) === "✕" ? (
            //     <ClearIcon fontSize="medium" />
            //   ) : snackbarMessage?.at(-1) === "—" ? (
            //     <HorizontalRuleIcon fontSize="medium" />
            //   ) : (
            //     <DataArrayIcon fontSize="medium" />
            //   )
            // }
          >
            {snackbarMessage.slice(0, -1)}
          </Alert>
        </Snackbar>

        <AppBar open={open}>
          <Toolbar>
            <Grid container>
              <Grid item xs={5}>
                <IconButton
                  color="secondary"
                  aria-label="open transition table"
                  onClick={handleTableOpen}
                  // edge="start"
                  sx={{ ml: -1, ...(open === 1 && { mr: 2, display: "none" }) }}
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
                    ...(open === 0 && { mt: 0.5 }),
                  }}
                >
                  Minimized DFA
                </Typography>
              </Grid>
            </Grid>
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
              justifyContent: "space-evenly",
              backgroundColor: "rgba(148, 148, 148, 0.15)",
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

        <Main open={open} sx={{ paddingBottom: 12 }}>
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
                  onClick={showNextStep}
                  disabled={isReady}
                >
                  {isComplete ? "Complete" : "Next"}
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12} md={8}>
                <ToolsPlayground {...playgroundProps} />
              </Grid>
            </Grid>
          </Grid>
        </Main>
      </Box>
    </>
  );
};
