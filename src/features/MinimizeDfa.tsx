import { useContext, useState } from "react";
import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";
import { EquivalentStates } from "./components/minimzeDfa/EquivalentStates";
import { EquivalentStatesProps } from "./components/minimzeDfa/props/EquivalentStatesProps";
import { DataContext } from "../components/Editor";
import { EquivalentStatesRowModel } from "../models/minimizeDfa/EquivalentStatesRowModel";
import { MinimizedDfaProps } from "./components/minimzeDfa/props/MinimizedDfaProps";
import { MinimizedDfa } from "./components/minimzeDfa/MinimizedDfa";
import { MinimizedDfaStateId } from "../consts/StateIdsExtensions";

export const MinimizeDfa = () => {
  console.log("re rendering MinimizeDfa");

  const dataContext = useContext(DataContext);

  const [isEquivalentStatesFilled, setIsEquivalentStatesFilled] =
    useState(false);
  const [equivalentStatesRows, setEquivalentStatesRows] = useState<
    EquivalentStatesRowModel[]
  >([]);

  const [isMinimizedDfaComplete, setIsMinimizedDfaComplete] = useState(false);

  let equivalentStatesProps: EquivalentStatesProps = {
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
              .map((tv) => tv.replace(tv, tv + MinimizedDfaStateId))
              .join(" ") ?? row[key === "^" ? "nul" : key],
          ])
        ),
      };
    }),
    states: dataContext.states.map((state) => {
      return {
        ...state,
        id: state.id + MinimizedDfaStateId,
      };
    }),
    transitions: dataContext.transitions.map((transition) => {
      return {
        ...transition,
        start: transition.start + MinimizedDfaStateId,
        end: transition.end + MinimizedDfaStateId,
      };
    }),
    equivalentStatesRows: equivalentStatesRows,
    setIsMinimizedDfaComplete: setIsMinimizedDfaComplete,
    stateSize: dataContext.stateSize,
  };

  return (
    <>
      <EquivalentStates {...equivalentStatesProps} />
      {isEquivalentStatesFilled && <MinimizedDfa {...minimizedDfaProps} />}
    </>
  );
};
