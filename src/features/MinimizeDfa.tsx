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
import { MergeTable } from "./components/minimzeDfa/MergeTable";
import { MergeTableProps } from "./components/minimzeDfa/props/MergeTableProps";
import { MinimizeDfaProps } from "./props/MinimizeDfaProps";
import { MergeTableRowModel } from "../models/minimizeDfa/MergeTableRowModel";
import { DataContext } from "../components/Editor";

export const MinimizeDfa = () => {
  console.log("re rendering MinimizeDfa");

  const dataContext = useContext(DataContext);

  const [isMergeTableComplete, setIsMergeTableComplete] = useState(false);
  const [mergeTableRows, setMergeTableRows] = useState<MergeTableRowModel[]>(
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

  let mergeTableProps: MergeTableProps = {
    // rows: dataContext.rows,
    // columns: dataContext.columns,
    setCompletedMergeTableRows: setMergeTableRows,
    setIsMergeTableComplete: setIsMergeTableComplete,
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
      <MergeTable {...mergeTableProps} />
      {isMergeTableComplete && <ResultantDfa {...resultantDfaProps} />}
    </>
  );
};
