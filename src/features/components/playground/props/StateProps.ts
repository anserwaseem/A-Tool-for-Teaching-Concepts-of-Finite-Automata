import { DraggableStateModel } from "../../../../models";
import { SelectedElementType } from "../../../props/SelectedElementType";

export type StateProps = {
  selected: SelectedElementType | null;
  handleSelect: (e: any) => void;
  actionState: string;
};

export type StateAllProps = {
  stateProps: StateProps;
  state: DraggableStateModel;
};