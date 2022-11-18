import { PlaygroundSize } from "../../../../components/types/PlaygroundSize";
import { DraggableStateModel, TransitionModel, RowModel } from "../../../../models";
import { SelectedElementType } from "../../../props/SelectedElementType";

export type NfaToDfaPlaygroundProps = {
  states: DraggableStateModel[];
  setStates: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  transitions: TransitionModel[];
  setTransitions: React.Dispatch<React.SetStateAction<TransitionModel[]>>;
  rows: RowModel[];
  setRows: React.Dispatch<React.SetStateAction<RowModel[]>>;
};
