import { DraggableStateModel, RowModel, TransitionModel } from "../../models";
import { SelectedElementType } from "./SelectedElementType";

export type PlaygroundProps = {
  boxes: DraggableStateModel[];
  setBoxes: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  lines: TransitionModel[];
  setLines: React.Dispatch<React.SetStateAction<TransitionModel[]>>;
  selected: SelectedElementType | null;
  setSelected: React.Dispatch<React.SetStateAction<SelectedElementType | null>>;
  actionState: string;
  setActionState: React.Dispatch<React.SetStateAction<string>>;
  handleSelect: (e: any) => void;
  checkExsitence: (id: string) => boolean;
  handleDropDynamic: (e: any) => void;
  gridData: RowModel[];
  setGridData: React.Dispatch<React.SetStateAction<RowModel[]>>;
  handleDeleteRow: (node: string) => void;
  transitionValue: string;
  setTransitionValue: React.Dispatch<React.SetStateAction<string>>;
  oldTransitionValue: string;
  setOldTransitionValue: React.Dispatch<React.SetStateAction<string>>;
  toggleInitialState: (row: RowModel) => void;
  toggleFinalState: (row: RowModel) => void;
};
