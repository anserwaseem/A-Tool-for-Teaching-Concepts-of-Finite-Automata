import { RowModel } from "../models";
import { IsDFA } from "./IsDFA";

export const IsNFA = (rows: RowModel[]) => {
  let alertMessage = "";

  if (rows === undefined || rows?.length === 0)
    return [false, "There is no automaton."];

  if (rows.filter((row) => row.isInitial).length === 0)
    alertMessage += "There is no initial state.\n";

  if (rows.filter((row) => row.isFinal).length === 0)
    alertMessage += "There is no final state.\n";

  const isDFA = IsDFA(rows);
  if (isDFA?.[0]) alertMessage += isDFA?.[1];

  return alertMessage === ""
    ? [true, "The automaton is a NFA."]
    : [false, alertMessage];
};
