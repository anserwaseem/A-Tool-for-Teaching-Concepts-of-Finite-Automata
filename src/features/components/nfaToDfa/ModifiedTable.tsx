import {
  Alert,
  Box,
  Grid,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { AnimationDurationOptions } from "../../../consts/AnimationDurationOptions";
import { PossibleTransitionValues } from "../../../consts/PossibleTransitionValues";
import { RowModel } from "../../../models";
import { ModifiedTableProps } from "./props/ModifiedTableProps";
import { ToolsTransitionTableProps } from "../tools/props/TransitionTableProps";
import { ToolsTransitionTable } from "../tools/TransitionTable";
import {
  ModifiedTableStateId,
  NullClosureStateId,
} from "../../../consts/StateIdsExtensions";
import { DrawerHeader } from "../../../common/DrawerHeader";
import { MainContent } from "../../../common/MainContent";
import { GetDrawerTransitionTableColumns } from "../../../utils/GetDrawerTransitionTableColumns";
import { GetDrawerTransitionTableRows } from "../../../utils/GetDrawerTransitionTableRows";
import { DataContext } from "../../../pages/Editor";
import { CustomAppBar } from "../../../common/CustomAppBar";
import { CustomDrawer } from "../../../common/CustomDrawer";
import { CustomAppBarProps } from "../../../common/props/CustomAppBarProps";
import { CustomDrawerProps } from "../../../common/props/CustomDrawerProps";
import { AnimationControlsProps } from "../../../common/props/AnimationControlsProps";
import { AnimationControls } from "../../../common/AnimationControls";

const numberOfColumns = 3; // one for state, one for a and one for b
let index = numberOfColumns;

export const ModifiedTable = (props: ModifiedTableProps) => {
  console.log("re rendering modified table, props: ", props);

  const dataContext = useContext(DataContext);

  const [duration, setDuration] = useState(AnimationDurationOptions[5]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isComplete, setIsComplete] = useState(false); // set to true when data is completely displayed
  const [isReady, setIsReady] = useState(false); // set to true when animation is completed and user clicks on "Complete" button i.e., when user is ready to move on to next step

  const [modifiedTableRowId, setModifiedTableRowId] = useState(0);
  const [modifiedTableRows, setModifiedTableRows] = useState<RowModel[]>([]);
  const columns: GridColumns = [
    { field: "id", hide: true, hideable: false },
    {
      field: "state",
      headerName: "State",
      disableColumnMenu: true,
      sortable: false,
      width: 55,
    },
    {
      field: "a",
      headerName: "a",
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "b",
      headerName: "b",
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
    },
  ];

  const [open, setOpen] = useState(1);

  const [showExplanation, setShowExplanation] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (isPlaying) {
      let timer = setTimeout(() => {
        if (!showExplanation) {
          const rowIndex = Math.floor(index / numberOfColumns);

          handleUpdateData(rowIndex, props.rows.slice(0, rowIndex));

          // stop if all rows have been displayed
          if (rowIndex > props.rows.length && index % numberOfColumns === 0) {
            setIsComplete(true);
            setIsPlaying(false);
            handleExplanation();
          }
          index++;
        } else handleExplanation();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [props, modifiedTableRows, isPlaying, showExplanation]);

  const handleUpdateData = (rowIndex: number, rows: RowModel[]) => {
    if (rowIndex <= rows.length) {
      setModifiedTableRowId(rowIndex);

      let updatedRow = rows?.at(-1);
      updatedRow = {
        ...updatedRow,
        a:
          ((index - 1) % rowIndex === 0 && index !== 3 && index !== 6) ||
          // b condition
          index === 5 ||
          ((index - 1) % rowIndex === 1 &&
            index !== 3 &&
            index !== 4 &&
            index !== 6)
            ? Array.from(
                new Set(
                  updatedRow.a // replace each state name with its corresponding nul closure
                    ?.split(", ")
                    ?.filter((tv) => tv !== "")
                    ?.map((tv) =>
                      tv?.replace(
                        tv,
                        props.rows.find((r) => r.state === tv)?.nul ?? tv
                      )
                    )
                    ?.join(", ")
                    ?.split(", ")
                    ?.sort()
                )
              )?.join(", ") ?? ""
            : "",
        b:
          index === 5 ||
          ((index - 1) % rowIndex === 1 &&
            index !== 3 &&
            index !== 4 &&
            index !== 6)
            ? Array.from(
                new Set(
                  updatedRow.b // replace each state name with its corresponding nul closure
                    ?.split(", ")
                    ?.filter((tv) => tv !== "")
                    ?.map((tv) =>
                      tv?.replace(
                        tv,
                        props.rows.find((r) => r.state === tv)?.nul ?? tv
                      )
                    )
                    ?.join(", ")
                    ?.split(", ")
                    ?.sort()
                )
              )?.join(", ") ?? ""
            : "",
      };

      setModifiedTableRows((mtRows) => {
        mtRows[rowIndex - 1] = updatedRow;
        return mtRows;
      });

      setShowExplanation(true);
    }
  };

  const handleExplanation = () => {
    let openSnackbar = true;
    if (index % numberOfColumns === 1)
      setSnackbarMessage(
        `Added state ${modifiedTableRows?.[
          modifiedTableRowId - 1
        ]?.state?.replaceAll(ModifiedTableStateId, "")}.`
      );
    else if (index % numberOfColumns === 2)
      dataContext?.rows?.[modifiedTableRowId - 1]?.a
        ? setSnackbarMessage(
            dataContext?.rows?.[modifiedTableRowId - 1]?.a
              ? `Updated ${
                  dataContext?.rows?.[modifiedTableRowId - 1]?.a
                } with its null closure i.e., {${Array.from(
                  new Set(
                    dataContext?.rows?.[modifiedTableRowId - 1]?.a
                      ?.split(" ")
                      ?.map((s) =>
                        dataContext.nullClosureRows
                          ?.find(
                            (r) =>
                              r.state.replaceAll(NullClosureStateId, "") === s
                          )
                          ?.nul?.replaceAll(NullClosureStateId, "")
                      )
                      ?.filter((s) => s?.replaceAll(",", ""))
                      ?.join(", ")
                      ?.split(", ")
                      ?.sort()
                  )
                )?.join(", ")}}`
              : ""
          )
        : (openSnackbar = false);
    else
      dataContext?.rows?.[modifiedTableRowId - 1]?.b
        ? setSnackbarMessage(
            dataContext?.rows?.[modifiedTableRowId - 1]?.b
              ? `Updated ${
                  dataContext?.rows?.[modifiedTableRowId - 1]?.b
                } with its null closure i.e., {${Array.from(
                  new Set(
                    dataContext?.rows?.[modifiedTableRowId - 1]?.b
                      ?.split(" ")
                      ?.map((s) =>
                        dataContext.nullClosureRows
                          ?.find(
                            (r) =>
                              r.state.replaceAll(NullClosureStateId, "") === s
                          )
                          ?.nul?.replaceAll(NullClosureStateId, "")
                      )
                      ?.filter((s) => s?.replaceAll(",", ""))
                      ?.join(", ")
                      ?.split(", ")
                      ?.sort()
                  )
                )?.join(", ")}}`
              : ""
          )
        : (openSnackbar = false);

    setOpenSnackbar(openSnackbar);
    setShowExplanation(false);
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

  const handleDurationChange = (event: SelectChangeEvent) => {
    setDuration(Number(event.target.value));
  };

  const handleAnimation = () => {
    if (isComplete) {
      setIsReady(false);
      setIsComplete(false);
      index = numberOfColumns;
      setIsPlaying(true);
      setModifiedTableRowId(0);
      setModifiedTableRows([]);
    } else setIsPlaying((v) => !v);
  };

  const showNextRow = () => {
    if (!showExplanation) {
      const rowIndex = Math.floor(index / numberOfColumns);
      if (isComplete) {
        setIsReady(true);
        props.setIsModifiedTransitionTableComplete(true);
        dataContext.setModifiedTableRows(modifiedTableRows);
      }

      handleUpdateData(rowIndex, props.rows.slice(0, rowIndex));

      // stop if all rows have been displayed
      if (rowIndex > props.rows.length && index % numberOfColumns === 0) {
        setIsComplete(true);
        setIsPlaying(false);
        handleExplanation();
      }
      index++;
    } else handleExplanation();
  };

  const transitionTableProps: ToolsTransitionTableProps = {
    rows: modifiedTableRows.map((row) => {
      return {
        ...row,
        ...Object.fromEntries(
          PossibleTransitionValues.concat("state").map((key) => [
            key === "^" ? "nul" : key,
            row[key === "^" ? "nul" : key]
              ?.toString()
              ?.split(" ")
              ?.filter((key) => key !== "")
              ?.map((tv) => tv?.replace(ModifiedTableStateId, ""))
              ?.join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),
    columns: columns,
  };

  const customAppBarProps: CustomAppBarProps = {
    showRightIcon: true,
    open,
    setOpen,
    title: "Modified Transition Table",
  };

  const leftDrawerProps: CustomDrawerProps = {
    isLeft: true,
    open,
    setOpen,
    title: "Null Closure Table",
    transitionTableProps: {
      rows: GetDrawerTransitionTableRows(
        dataContext.nullClosureRows,
        NullClosureStateId
      ),
      columns: GetDrawerTransitionTableColumns(dataContext.columns, ["a", "b"]),
    },
  };

  const rightDrawerProps: CustomDrawerProps = {
    isLeft: false,
    open,
    setOpen,
    title: "Transition Table",
    transitionTableProps: {
      rows: GetDrawerTransitionTableRows(dataContext.rows, ""),
      columns: GetDrawerTransitionTableColumns(dataContext.columns, []),
    },
  };
  
  const animationControlsProps: AnimationControlsProps = {
    duration,
    isPlaying,
    isComplete,
    isReady,
    handleAnimation,
    showNextStep: showNextRow,
    handleDurationChange,
  };

  return (
    <>
      <Box sx={{ display: "flex", mt: 5 }}>
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
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <CustomAppBar {...customAppBarProps} />

        <CustomDrawer {...leftDrawerProps} />

        <MainContent open={open} sx={{ paddingBottom: 12 }}>
          <DrawerHeader />
          {/* Grid to incorporate Transition table and Playground */}
          <Grid
            container
            columnSpacing={{
              xs: 1,
              sm: 2,
              md: 3,
            }}
            pt={1.6}
          >
            {/* Transition table grid */}
            <Grid item xs={12} md={4}>
              <Grid container alignItems={"center"}>
                <Grid item xs={12}>
                  <AnimationControls {...animationControlsProps} />
                </Grid>
              </Grid>
              <ToolsTransitionTable {...transitionTableProps} />
            </Grid>
          </Grid>
        </MainContent>

        <CustomDrawer {...rightDrawerProps} />
      </Box>
      {/* {isComplete && <ResultantDfa {...resultantDfaProps} />} */}
    </>
  );
};
