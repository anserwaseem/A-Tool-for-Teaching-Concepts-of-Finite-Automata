import { useContext, useState } from "react";
import { DraggableStateModel, RowModel, TransitionModel } from "../models";
import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";
import { ResultantDfa } from "./components/nfaToDfa/ResultantDfa";
import { ResultantDfaProps } from "./components/nfaToDfa/props/ResultantDfaProps";
import { EquivalentStates } from "./components/minimzeDfa/EquivalentStates";
import { EquivalentStatesProps } from "./components/minimzeDfa/props/EquivalentStatesProps";
import { DataContext } from "../components/Editor";
import { EquivalentStatesRowModel } from "../models/minimizeDfa/EquivalentStatesRowModel";

export const MinimizeDfa = () => {
  console.log("re rendering MinimizeDfa");

  const dataContext = useContext(DataContext);

  const [isEquivalentStatesComplete, setIsEquivalentStatesComplete] =
    useState(false);
  const [equivalentStatesRows, setEquivalentStatesRows] = useState<EquivalentStatesRowModel[]>(
    []
  );

  const [isResultantDfaComplete, setIsResultantDfaComplete] = useState(false);
  const [resultantDfaStates, setResultantDfaStates] = useState<
    DraggableStateModel[]
  >([]);
  const [resultantDfaTransitions, setResultantDfaTransitions] = useState<
    TransitionModel[]
  >([]);

  const [
    isModifiedTransitionTableComplete,
    setIsModifiedTransitionTableComplete,
  ] = useState(false); //no need
  const [modifiedRows, setModifiedRows] = useState<RowModel[]>([]); // no need

  let equivalentStatesProps: EquivalentStatesProps = {
    // rows: dataContext.rows,
    // columns: dataContext.columns,
    setCompletedEquivalentStatesRows: setEquivalentStatesRows,
    setIsEquivalentStatesComplete: setIsEquivalentStatesComplete,
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
              .map((tv) => tv.replace("mt", "md"))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),
    setIsResultantDfaComplete: setIsResultantDfaComplete,
    editorPlaygroundSize: dataContext.editorPlaygroundSize,
  };

  return (
    <>
      <EquivalentStates {...equivalentStatesProps} />
      {isEquivalentStatesComplete && <ResultantDfa {...resultantDfaProps} />}
    </>
  );
};
