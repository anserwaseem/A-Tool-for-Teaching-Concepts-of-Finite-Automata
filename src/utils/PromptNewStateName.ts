import { DraggableStateModel } from "../models";

export const promptNewStateName = (
  boxes: DraggableStateModel[],
  originalName: string
) => {
  var newName = prompt("Enter new name: ", originalName);
  while (
    !newName ||
    (newName && [...boxes].map((b) => b.id).includes(newName)) ||
    newName.length > 4
  ) {
    if (!newName)
      newName = prompt(
        "Name cannot be empty, choose another one: ",
        originalName
      );
    else if (newName && [...boxes].map((b) => b.id).includes(newName))
      newName = prompt(
        "Name already taken, choose another one: ",
        originalName
      );
    else if (newName.length > 4)
      newName = prompt(
        "Name cannot be longer than 4 characters: ",
        originalName
      );
  }
  return newName;
};
