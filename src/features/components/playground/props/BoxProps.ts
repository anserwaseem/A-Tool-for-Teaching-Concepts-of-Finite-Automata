import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../../models";
import { SelectedElementType } from "../../../props/SelectedElementType";

export type BoxProps = {
  boxes: DraggableStateModel[];
  setBoxes: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  lines: TransitionModel[];
  setLines: React.Dispatch<React.SetStateAction<TransitionModel[]>>;
  selected: SelectedElementType | null;
  handleSelect: (e: any) => void;
  actionState: string;
  gridData: RowModel[];
  setGridData: React.Dispatch<React.SetStateAction<RowModel[]>>;
  transitionValue: string;
  setTransitionValue: React.Dispatch<React.SetStateAction<string>>;
  oldTransitionValue: string;
  setOldTransitionValue: React.Dispatch<React.SetStateAction<string>>;
};
