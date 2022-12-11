import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../../models";
import { SelectedElementType } from "../../../props/SelectedElementType";

export type TopBarProps = {
  selected: SelectedElementType | null;
  setSelected: React.Dispatch<React.SetStateAction<SelectedElementType | null>>;
  handleSelect: (e: any) => void;
  actionState: string;
  setActionState: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteRow: (row: RowModel) => void;
  toggleInitialState: (row: RowModel) => void;
  toggleFinalState: (row: RowModel) => void;
};
