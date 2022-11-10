import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";
import { TransitionValuesSeparator } from "../consts/TransitionValuesSeparator";
import { TransitionModel } from "../models";

export const promptNewTransitionValue = (
  lines: TransitionModel[],
  originalValue: string
) => {
  var newValue = prompt(
    `Enter new value: (separate values with "${
      TransitionValuesSeparator === "" ? "nothing" : TransitionValuesSeparator
    }")`,
    originalValue
  );
  while (
    newValue === null ||
    newValue === undefined ||
    (newValue &&
      !newValue
        .split(TransitionValuesSeparator)
        .every((r: string) => PossibleTransitionValues.includes(r)))
  ) {
    if (newValue === null || newValue === undefined)
      newValue = prompt("Invalid value. Enter new value:", originalValue);
    else if (
      !newValue
        .split(TransitionValuesSeparator)

        .every((r: string) => PossibleTransitionValues.includes(r))
    )
      newValue = prompt(
        `Please enter a valid transition value ${PossibleTransitionValues.join(
          ", "
        )}`
      );
    else if (newValue.length > 4)
      newValue = prompt(
        "Value cannot be longer than 4 characters: ",
        originalValue
      );
  }
  //return value after removing duplicates from it
  return Array.from(new Set(newValue.split(TransitionValuesSeparator))).join(
    ""
  );
};
