import { DraggableStateModel } from "../models";
import { StateNameMaxLength } from "../consts/StateNameMaxLength";

export const promptNewStateName = (
  states: DraggableStateModel[],
  originalName: string
) => {
  var newName = prompt("Enter new name: ", originalName);
  while (
    !newName ||
    (newName && [...states].map((s) => s.id).includes(newName)) ||
    newName.length > StateNameMaxLength
  ) {
    if (!newName)
      newName = prompt(
        "Name cannot be empty, choose another one: ",
        originalName
      );
    else if (newName && [...states].map((s) => s.id).includes(newName))
      newName = prompt(
        "Name already taken, choose another one: ",
        originalName
      );
    else if (newName.length > StateNameMaxLength)
      newName = prompt(
        `State name cannot be more than ${StateNameMaxLength} characters.`,
        originalName
      );
  }
  return newName;
};
