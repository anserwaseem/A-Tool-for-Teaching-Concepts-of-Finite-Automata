import { TransitionModel } from "../../../../models";
import { SelectedElementType } from "../../../props/SelectedElementType";

export type XarrowProps = {
  selected: SelectedElementType | null;
  setSelected: React.Dispatch<React.SetStateAction<SelectedElementType | null>>;
};
