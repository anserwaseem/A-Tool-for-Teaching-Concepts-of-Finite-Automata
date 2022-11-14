import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../../models";
import { SelectedElementType } from "../../../props/SelectedElementType";

export type TopBarProps = {
  states: DraggableStateModel[];
  setStates: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  transitions: TransitionModel[];
  setTransitions: React.Dispatch<React.SetStateAction<TransitionModel[]>>;
  selected: SelectedElementType | null;
  setSelected: React.Dispatch<React.SetStateAction<SelectedElementType | null>>;
  handleSelect: (e: any) => void;
  actionState: string;
  setActionState: React.Dispatch<React.SetStateAction<string>>;
  gridData: RowModel[];
  setGridData: React.Dispatch<React.SetStateAction<RowModel[]>>;
  handleDeleteRow: (row: RowModel) => void;
  toggleInitialState: (row: RowModel) => void;
  toggleFinalState: (row: RowModel) => void;
};
