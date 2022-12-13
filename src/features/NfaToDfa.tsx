import { useContext, useEffect, useState } from "react";
import { DraggableStateModel, RowModel, TransitionModel } from "../models";
import { NfaToDfaProps } from "./props/NfaToDfaProps";
import { NullClosure } from "./components/nfaToDfa/NullClosure";
import { NullClosureProps } from "./components/nfaToDfa/props/NullClosureProps";
import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";
import { ModifiedTable } from "./components/nfaToDfa/ModifiedTable";
import { ModifiedTableProps } from "./components/nfaToDfa/props/ModifiedTableProps";
import { ResultantDfa } from "./components/nfaToDfa/ResultantDfa";
import { ResultantDfaProps } from "./components/nfaToDfa/props/ResultantDfaProps";
import { DataContext } from "../components/Editor";

export const NfaToDfa = () => {
  console.log("re rendering NfaToDfa");

  const dataContext = useContext(DataContext);

  const [isNullClosureTableComplete, setIsNullClosureTableComplete] =
    useState(false);
  const [nullClosureRows, setNullClosureRows] = useState<RowModel[]>([]);
  const [nullClosureStates, setNullClosureStates] = useState<
    DraggableStateModel[]
  >([]);
  const [nullClosureTransitions, setNullClosureTransitions] = useState<
    TransitionModel[]
  >([]);

  const [
    isModifiedTransitionTableComplete,
    setIsModifiedTransitionTableComplete,
  ] = useState(false);
  const [modifiedRows, setModifiedRows] = useState<RowModel[]>([]);

  const [isResultantDfaComplete, setIsResultantDfaComplete] = useState(false);

  useEffect(() => {
    // change state name in each property of rows, states, transitions arrays to make it unique for Xarrow to work
    const nullClosureRowsUnique = dataContext.rows.map((row) => {
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

    const nullClosureStatesUnique = dataContext.states.map((state) => {
      return {
        ...state,
        id: `${state.id}nc`,
      };
    });
    console.log("nullClosureStatesUnique", nullClosureStatesUnique);

    const nullClosureTransitionsUnique = dataContext.transitions.map(
      (transition) => {
        return {
          ...transition,
          start: `${transition.start}nc`,
          end: `${transition.end}nc`,
        };
      }
    );
    console.log("nullClosureTransitionsUnique", nullClosureTransitionsUnique);

    setNullClosureRows(nullClosureRowsUnique);
    setNullClosureStates(nullClosureStatesUnique);
    setNullClosureTransitions(nullClosureTransitionsUnique);
  }, [dataContext]);

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
              .map((tv) => tv.replace("nc", "mtt"))
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
              .map((tv) => tv.replace("mtt", "ntd"))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),
    setIsResultantDfaComplete: setIsResultantDfaComplete,
    playgroundSize: dataContext.playgroundSize,
  };

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
