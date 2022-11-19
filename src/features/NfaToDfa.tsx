import { useEffect, useState } from "react";
import { DraggableStateModel, RowModel, TransitionModel } from "../models";
import { NfaToDfaProps } from "./props/NfaToDfaProps";
import { NullClosure } from "./components/nfaToDfa/NullClosure";
import { NullClosureProps } from "./components/nfaToDfa/props/NullClosureProps";
import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";
import { ModifiedTable } from "./components/nfaToDfa/ModifiedTable";
import { ModifiedTableProps } from "./components/nfaToDfa/props/ModifiedTableProps";
import { ResultantDfa } from "./components/nfaToDfa/ResultantDfa";
import { ResultantDfaProps } from "./components/nfaToDfa/props/ResultantDfaProps";

export const NfaToDfa = (props: NfaToDfaProps) => {
  const [isNullClosureTableComplete, setIsNullClosureTableComplete] =
    useState(false);
  // const [nullClosureRowId, setNullClosureRowId] = useState(0);
  const [nullClosureRows, setNullClosureRows] = useState<RowModel[]>([]);
  const [nullClosureStates, setNullClosureStates] = useState<
    DraggableStateModel[]
  >([]);
  const [nullClosureTransitions, setNullClosureTransitions] = useState<
    TransitionModel[]
  >([]);

  // const [modifiedRowId, setModifiedRowId] = useState(0);
  const [
    isModifiedTransitionTableComplete,
    setIsModifiedTransitionTableComplete,
  ] = useState(false);
  const [modifiedRows, setModifiedRows] = useState<RowModel[]>([]);

  const [isResultantDfaComplete, setIsResultantDfaComplete] = useState(false);
  // const [dfaRowId, setDfaRowId] = useState(0);
  const [dfaRows, setDfaRows] = useState<RowModel[]>([]);
  const [dfaStates, setDfaStates] = useState<DraggableStateModel[]>([]);
  const [dfaTransitions, setDfaTransitions] = useState<TransitionModel[]>([]);

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
    setRows: setNullClosureRows,
    states: nullClosureStates,
    setStates: setNullClosureStates,
    transitions: nullClosureTransitions,
    setTransitions: setNullClosureTransitions,
    setIsNullClosureTableComplete: setIsNullClosureTableComplete,
  };

  let modifiedTableProps: ModifiedTableProps = {
    rows: nullClosureRows.map((row) => {
      return {
        ...row,
        ...Object.fromEntries(
          PossibleTransitionValues.concat("state").map((key) => [
            key === "^" ? "nul" : key,
            row[key === "^" ? "nul" : key]
              .toString()
              .split(" ")
              .filter((key) => key !== "")
              .map((tv) => tv.replace("nc", "mt"))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),
    setRows: setModifiedRows,
    setIsModifiedTransitionTableComplete: setIsModifiedTransitionTableComplete,
  };

  let resultantDfaProps: ResultantDfaProps = {
    rows: modifiedRows.map((row) => {
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
    states: props.states,
    transitions: props.transitions,
    setIsResultantDfaComplete: setIsResultantDfaComplete,
    editorPlaygroundSize: props.editorPlaygroundSize,
  };

  // useEffect(() => {
  //   if (isModifiedTransitionTableComplete)
  //     constructResultantDfaTable(resultantDfaProps);
  // }, [isModifiedTransitionTableComplete]);

  return (
    <>
      <NullClosure {...nullClosureProps} />
      {isNullClosureTableComplete && <ModifiedTable {...modifiedTableProps} />}
      {isModifiedTransitionTableComplete && (
        <ResultantDfa {...resultantDfaProps} />
      )}
    </>
  );
};
