import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../../models";
import { SelectedElementType } from "../../../props/SelectedElementType";

export type StateProps = {
  states: DraggableStateModel[];
  setStates: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  transitions: TransitionModel[];
  setTransitions: React.Dispatch<React.SetStateAction<TransitionModel[]>>;
  selected: SelectedElementType | null;
  handleSelect: (e: any) => void;
  actionState: string;
  gridData: RowModel[];
  setGridData: React.Dispatch<React.SetStateAction<RowModel[]>>;
};
