import { DraggableStateModel } from "../../../models";
import { selectedElementType } from "../../props/SelectedElementType";

export type TopBarProps = {
  boxes: DraggableStateModel[];
  setBoxes: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  lines: any[];
  setLines: React.Dispatch<React.SetStateAction<any[]>>;
  selected: selectedElementType | null;
  handleSelect: (e: any) => void;
  actionState: string;
  setActionState: React.Dispatch<React.SetStateAction<string>>;
};
