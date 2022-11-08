import { DraggableStateModel } from "../../models";
import { selectedElementType } from "./SelectedElementType";

export type PlaygroundProps = {
  boxes: DraggableStateModel[];
  setBoxes: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  lines: any[];
  setLines: React.Dispatch<React.SetStateAction<any[]>>;
  selected: selectedElementType | null;
  setSelected: React.Dispatch<React.SetStateAction<selectedElementType | null>>;
  actionState: string;
  setActionState: React.Dispatch<React.SetStateAction<string>>;
  handleSelect: (e: any) => void;
  checkExsitence: (id: string) => boolean;
  handleDropDynamic: (e: any) => void;
};
