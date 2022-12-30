import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";
import { RowModel } from "../models";

export const GetDrawerTransitionTableRows = (
  rows: RowModel[],
  stateIdExtension: string
): RowModel[] => {
  return rows.map((row) => {
    return {
      ...row,
      ...Object.fromEntries(
        PossibleTransitionValues.concat("state").map((key) => [
          key === "^" ? "nul" : key,
          row[key === "^" ? "nul" : key]
            .toString()
            .split(" ")
            .filter((key) => key !== "")
            .map((tv) => tv.replace(stateIdExtension, ""))
            .join(" ") ?? row[key === "^" ? "nul" : key],
        ])
      ),
    };
  });
};
