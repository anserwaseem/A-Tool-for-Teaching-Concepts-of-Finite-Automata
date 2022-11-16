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
import { AnimationTimeOptions } from "../consts/AnimationTimeOptions";
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

export const NfaToDfa = (props: NfaToDfaProps) => {
  const [nullClosureRowId, setNullClosureRowId] = useState(0);
  const [nullClosureRows, setNullClosureRows] = useState<RowModel[]>([]);
  const [modifiedRowId, setModifiedRowId] = useState(0);
  const [modifiedRows, setModifiedRows] = useState<RowModel[]>([]);
  const [dfaRowId, setDfaRowId] = useState(0);
  const [dfaRows, setDfaRows] = useState<RowModel[]>([]);
  const [nullClosureStates, setNullClosureStates] = useState<
    DraggableStateModel[]
  >([]);
  const [nullClosureTransitions, setNullClosureTransitions] = useState<
    TransitionModel[]
  >([]);
  const [dfaStates, setDfaStates] = useState<DraggableStateModel[]>([]);
  const [dfaTransitions, setDfaTransitions] = useState<TransitionModel[]>([]);

  let isNullClosureTableComplete = false;
  let isModifiedTransitionTableComplete = false;
  let isDfaTableComplete = false;

  useEffect(() => {
    setNullClosureRows(props.rows);
    setNullClosureStates(props.states);
    setNullClosureTransitions(props.transitions);
  }, [props]);

  const handleAnimationPlay = () => {
    console.log("Play");
  };

  const nullClosureProps: NullClosureProps = {
    rows: nullClosureRows,
    states: nullClosureStates,
    transitions: nullClosureTransitions,
  };

  return <NullClosure {...nullClosureProps} />;
};
