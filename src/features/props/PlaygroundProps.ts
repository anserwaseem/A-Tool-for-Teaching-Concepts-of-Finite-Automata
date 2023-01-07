import { PlaygroundSize } from "../../common/types/PlaygroundSize";
import { DraggableStateModel, RowModel, TransitionModel } from "../../models";
import { SelectedElementType } from "./SelectedElementType";

export type PlaygroundProps = {
  selected: SelectedElementType | null;
  setSelected: React.Dispatch<React.SetStateAction<SelectedElementType | null>>;
  actionState: string;
  setActionState: React.Dispatch<React.SetStateAction<string>>;
  handleSelect: (e: any) => void;
  checkExsitence: (id: string) => boolean;
  handleDropDynamic: (e: any) => void;
  handleDeleteRow: (row: RowModel) => void;
  toggleInitialState: (row: RowModel) => void;
  toggleFinalState: (row: RowModel) => void;
  setPlaygroundSize: React.Dispatch<React.SetStateAction<PlaygroundSize>>;
};
