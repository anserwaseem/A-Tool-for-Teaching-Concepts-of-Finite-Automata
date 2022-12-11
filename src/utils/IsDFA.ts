import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";
import { RowModel } from "../models";

export const IsDFA = (rows: RowModel[]) => {
  let missingTransitions = new Set<string>();
  let nullTransitions = new Set<string>();
  let multiPathTransitions = new Set<string>();
  const numberOfInitialStates = rows.filter((row) => row.isInitial).length;
  const numberOfFinalStates = rows.filter((row) => row.isFinal).length;

  rows.forEach((row) => {
    PossibleTransitionValues.forEach((key) => {
      let transitionValue = row[key === "^" ? "nul" : key]
        .toString()
        .split(" ")
        .filter((v) => v !== "");
      if (key === "^" && transitionValue.length > 0) {
        nullTransitions.add(row.state);
      } else if (key !== "^" && transitionValue.length === 0) {
        missingTransitions.add(row.state);
      }
      if (transitionValue.length > 1) {
        multiPathTransitions.add(row.state);
      }
    });
  });

  let alertMessage = "";

  if (rows === undefined || rows?.length === 0)
    return [false, "There is no automaton."];

  if (numberOfInitialStates === 0) {
    alertMessage += "There is no initial state.\n";
  }

  if (numberOfFinalStates === 0) {
    alertMessage += "There is no final state.\n";
  }

  if (numberOfInitialStates === 1 && numberOfFinalStates > 0) {
    const arrayOfMissingTransitions = Array.from(missingTransitions);
    const arrayOfNullTransitions = Array.from(nullTransitions);
    const arrayOfMultiPathTransitions = Array.from(multiPathTransitions);

    if (arrayOfMissingTransitions.length > 0) {
      alertMessage +=
        "There are missing transitions on state(s): " +
        arrayOfMissingTransitions.join(", ") +
        ".\n";
    }
    if (arrayOfNullTransitions.length > 0) {
      alertMessage +=
        "There are null transitions on state(s): " +
        arrayOfNullTransitions.join(", ") +
        ".\n";
    }
    if (arrayOfMultiPathTransitions.length > 0) {
      alertMessage +=
        "There are multi-path transitions on state(s): " +
        arrayOfMultiPathTransitions.join(", ") +
        ".\n";
    }
  }

  return alertMessage === ""
    ? [true, "The automaton is a DFA."]
    : [false, alertMessage];
  // alert(alertMessage !== "" ? alertMessage : "The automaton is a DFA.");
};
