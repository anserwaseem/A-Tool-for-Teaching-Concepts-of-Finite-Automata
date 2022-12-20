import { DraggableStateModel } from "../../../../models";
import { SelectedElementType } from "../../../props/SelectedElementType";

export type StateCoreProps = {
  selected: SelectedElementType | null;
  handleSelect: (e: any) => void;
  actionState: string;
};

export type StateProps = {
  core: StateCoreProps;
  state: DraggableStateModel;
};
