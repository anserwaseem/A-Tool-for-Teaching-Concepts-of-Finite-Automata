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
import { MergeTable } from "./components/minimzeDfa/MergeTable";
import { MergeTableProps } from "./components/minimzeDfa/props/MergeTableProps";
import { MinimizeDfaProps } from "./props/MinimizeDfaProps";
import { MergeTableRowModel } from "../models/minimizeDfa/MergeTableRowModel";

export const MinimizeDfa = (props: MinimizeDfaProps) => {
  console.log("re rendering MinimizeDfa, props", props);
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

  //   useEffect(() => {
  //     // change state name in each property of rows, states, transitions arrays to make it unique for Xarrow to work
  //     const mergeTableRowsUnique = props.rows.map((row) => {
  //       return {
  //         ...row,
  //         ...Object.fromEntries(
  //           PossibleTransitionValues.concat("state").map((key) => [
  //             key === "^" ? "nul" : key,
  //             row[key === "^" ? "nul" : key]
  //               .toString()
  //               .split(" ")
  //               .filter((key) => key !== "")
  //               .map((tv) => tv.replace(tv, tv + "mtt"))
  //               .join(" ") ?? row[key === "^" ? "nul" : key],
  //           ])
  //         ),
  //       };
  //     });
  //     console.log("mergeTableRowsUnique", mergeTableRowsUnique);

  //     const resultantDfaStatesUnique = props.states.map((state) => {
  //       return {
  //         ...state,
  //         id: `${state.id}nc`,
  //       };
  //     });
  //     console.log("resultantDfaStatesUnique", resultantDfaStatesUnique);

  //     const resultantDfaTransitionsUnique = props.transitions.map(
  //       (transition) => {
  //         return {
  //           ...transition,
  //           props: {
  //             ...transition.props,
  //             start: `${transition.props.start}nc`,
  //             end: `${transition.props.end}nc`,
  //           },
  //         };
  //       }
  //     );
  //     console.log("resultantDfaTransitionsUnique", resultantDfaTransitionsUnique);

  //     // setMergeTableRows(mergeTableRowsUnique);
  //     setResultantDfaStates(resultantDfaStatesUnique);
  //     setResultantDfaTransitions(resultantDfaTransitionsUnique);
  //   }, [props]);

  let mergeTableProps: MergeTableProps = {
    rows: props.rows,
    columns: props.columns,
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
              .map((tv) => tv.replace("mtt", "ntd"))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),
    setIsResultantDfaComplete: setIsResultantDfaComplete,
    editorPlaygroundSize: props.editorPlaygroundSize,
  };

  return (
    <>
      <MergeTable {...mergeTableProps} />
      {isMergeTableComplete && <ResultantDfa {...resultantDfaProps} />}
    </>
  );
};
