import { useContext, useState } from "react";
import { DraggableStateModel, RowModel, TransitionModel } from "../models";
import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";
import { ResultantDfa } from "./components/nfaToDfa/ResultantDfa";
import { ResultantDfaProps } from "./components/nfaToDfa/props/ResultantDfaProps";
import { EquivalentStates } from "./components/minimzeDfa/EquivalentStates";
import { EquivalentStatesProps } from "./components/minimzeDfa/props/EquivalentStatesProps";
import { DataContext } from "../components/Editor";
import { EquivalentStatesRowModel } from "../models/minimizeDfa/EquivalentStatesRowModel";
import { MinimizedDfaProps } from "./components/minimzeDfa/props/MinimizedDfaProps";
import { MinimizedDfa } from "./components/minimzeDfa/MinimizedDfa";

export const MinimizeDfa = () => {
  console.log("re rendering MinimizeDfa");

  const dataContext = useContext(DataContext);

  const [isEquivalentStatesFilled, setIsEquivalentStatesFilled] =
    useState(false);
  const [equivalentStatesRows, setEquivalentStatesRows] = useState<
    EquivalentStatesRowModel[]
  >([]);

  const [isMinimizedDfaComplete, setIsMinimizedDfaComplete] = useState(false);
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
    setFilledEquivalentStatesRows: setEquivalentStatesRows,
    setIsEquivalentStatesFilled: setIsEquivalentStatesFilled,
  };

  let minimizedDfaProps: MinimizedDfaProps = {
    rows: dataContext?.rows?.map((row) => {
      return {
        ...row,
        ...Object.fromEntries(
          PossibleTransitionValues.concat("state").map((key) => [
            key === "^" ? "nul" : key,
            row[key === "^" ? "nul" : key]
              .toString()
              .split(" ")
              .filter((key) => key !== "")
              .map((tv) => tv.replace(tv, tv + "md"))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),
    states: dataContext.states.map((state) => {
      return {
        ...state,
        id: `${state.id}md`,
      };
    }),
    transitions: dataContext.transitions.map((transition) => {
      return {
        ...transition,
        start: `${transition.start}md`,
        end: `${transition.end}md`,
      };
    }),
    equivalentStatesRows: equivalentStatesRows,
    setIsMinimizedDfaComplete: setIsMinimizedDfaComplete,
  };

  return (
    <>
      <EquivalentStates {...equivalentStatesProps} />
      {isEquivalentStatesFilled && <MinimizedDfa {...minimizedDfaProps} />}
    </>
  );
};
