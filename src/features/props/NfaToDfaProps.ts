import { PlaygroundSize } from "../../components/types/PlaygroundSize";
import { RowModel, DraggableStateModel, TransitionModel } from "../../models";

export type NfaToDfaProps = {
  rows: RowModel[];
  states: DraggableStateModel[];
  transitions: TransitionModel[];
  playgroundSize: PlaygroundSize;
};
