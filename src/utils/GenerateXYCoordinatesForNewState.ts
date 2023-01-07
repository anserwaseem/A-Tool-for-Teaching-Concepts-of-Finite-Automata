import { PlaygroundSize } from "../pages/types/PlaygroundSize";
import { StateDefaultSize } from "../consts/StateSizes";
import { DraggableStateModel } from "../models";

export const GenerateXYCoordinatesForNewState = (
  states: DraggableStateModel[],
  playgroundSize: PlaygroundSize
) => {
  return GenerateCYCoordinatesForNewStateHelper(states, playgroundSize, 0);
};

function GenerateCYCoordinatesForNewStateHelper(
  states: DraggableStateModel[],
  playgroundSize: PlaygroundSize,
  index: number
) {
  let x: number, y: number;

  x = Math.floor(Math.random() * playgroundSize.width);
  y = Math.floor(Math.random() * playgroundSize.height);

  const isOverlapping =
    index < 1000 &&
    states.some(
      (state) =>
        Math.abs(state.x - x) < StateDefaultSize &&
        Math.abs(state.y - y) < StateDefaultSize
    );

  if (isOverlapping) {
    return GenerateCYCoordinatesForNewStateHelper(
      states,
      playgroundSize,
      ++index
    );
  }
  return { x, y };
}
