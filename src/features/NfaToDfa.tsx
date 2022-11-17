import {
  Box,
  Grid,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { GridColumns, GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Tools } from "../components/Tools";
import { AnimationDurationOptions } from "../consts/AnimationDurationOptions";
import { DraggableStateModel, RowModel, TransitionModel } from "../models";
import { NfaToDfaTransitionTableProps } from "./components/nfaToDfa/props/TransitionTableProps";
import { AnimationController } from "./components/tools/AnimationController";
import { AnimationControllerProps } from "./components/tools/props/AnimationControllerProps";
import Playground from "./Playground";
import { NfaToDfaProps } from "./props/NfaToDfaProps";
import { NfaToDfaTransitionTable } from "./components/nfaToDfa/TransitionTable";
import { MaxNumberOfStates } from "../consts/MaxNumberOfStates";
import { NfaToDfaPlaygroundProps } from "./components/nfaToDfa/props/PlaygroundProps";
import { NfaToDfaPlayground } from "./components/nfaToDfa/Playground";
import { NullClosure } from "./components/nfaToDfa/NullClosure";
import { NullClosureProps } from "./components/nfaToDfa/props/NullClosureProps";
import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";

export const NfaToDfa = (props: NfaToDfaProps) => {
  const [nullClosureRowId, setNullClosureRowId] = useState(0);
  const [nullClosureRows, setNullClosureRows] = useState<RowModel[]>([]);
  const [nullClosureStates, setNullClosureStates] = useState<
    DraggableStateModel[]
  >([]);
  const [nullClosureTransitions, setNullClosureTransitions] = useState<
    TransitionModel[]
  >([]);
  const [modifiedRowId, setModifiedRowId] = useState(0);
  const [modifiedRows, setModifiedRows] = useState<RowModel[]>([]);
  const [dfaRowId, setDfaRowId] = useState(0);
  const [dfaRows, setDfaRows] = useState<RowModel[]>([]);
  const [dfaStates, setDfaStates] = useState<DraggableStateModel[]>([]);
  const [dfaTransitions, setDfaTransitions] = useState<TransitionModel[]>([]);

  let isNullClosureTableComplete = false;
  let isModifiedTransitionTableComplete = false;
  let isDfaTableComplete = false;

  useEffect(() => {
    // change state name in each property of rows, states, transitions arrays to make it unique for Xarrow to work
    const nullClosureRowsUnique = props.rows.map((row) => {
      return {
        ...row,
        ...Object.fromEntries(
          PossibleTransitionValues.concat("state").map((key) => [
            key === "^" ? "nul" : key,
            row[key === "^" ? "nul" : key]
              .toString()
              .split(" ")
              .filter((key) => key !== "")
              .map((tv) => tv.replace(tv, tv + "nc"))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    });
    console.log("nullClosureRowsUnique", nullClosureRowsUnique);

    const nullClosureStatesUnique = props.states.map((state) => {
      return {
        ...state,
        id: `${state.id}nc`,
      };
    });
    console.log("nullClosureStatesUnique", nullClosureStatesUnique);

    const nullClosureTransitionsUnique = props.transitions.map((transition) => {
      return {
        ...transition,
        props: {
          ...transition.props,
          start: `${transition.props.start}nc`,
          end: `${transition.props.end}nc`,
        },
      };
    });
    console.log("nullClosureTransitionsUnique", nullClosureTransitionsUnique);

    setNullClosureRows(nullClosureRowsUnique);
    setNullClosureStates(nullClosureStatesUnique);
    setNullClosureTransitions(nullClosureTransitionsUnique);
  }, [props]);

  const nullClosureProps: NullClosureProps = {
    rows: nullClosureRows,
    states: nullClosureStates,
    transitions: nullClosureTransitions,
  };

  return <NullClosure {...nullClosureProps} />;
};
