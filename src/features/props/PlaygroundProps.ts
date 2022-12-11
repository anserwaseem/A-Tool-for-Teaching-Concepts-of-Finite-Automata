import { PlaygroundSize } from "../../components/types/PlaygroundSize";
import { DraggableStateModel, RowModel, TransitionModel } from "../../models";
import { SelectedElementType } from "./SelectedElementType";

export type PlaygroundProps = {
  states: DraggableStateModel[];
  setStates: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  transitions: TransitionModel[];
  setTransitions: React.Dispatch<React.SetStateAction<TransitionModel[]>>;
  selected: SelectedElementType | null;
  setSelected: React.Dispatch<React.SetStateAction<SelectedElementType | null>>;
  actionState: string;
  setActionState: React.Dispatch<React.SetStateAction<string>>;
  handleSelect: (e: any) => void;
  checkExsitence: (id: string) => boolean;
  handleDropDynamic: (e: any) => void;
  rows: RowModel[];
  setRows: React.Dispatch<React.SetStateAction<RowModel[]>>;
  handleDeleteRow: (row: RowModel) => void;
  toggleInitialState: (row: RowModel) => void;
  toggleFinalState: (row: RowModel) => void;
  setPlaygroundSize: React.Dispatch<React.SetStateAction<PlaygroundSize>>;
};
