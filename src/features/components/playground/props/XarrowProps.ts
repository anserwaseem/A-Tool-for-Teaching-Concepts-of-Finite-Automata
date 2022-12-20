import { TransitionModel } from "../../../../models";
import { SelectedElementType } from "../../../props/SelectedElementType";

export type XarrowCoreProps = {
  selected: SelectedElementType | null;
  setSelected: React.Dispatch<React.SetStateAction<SelectedElementType | null>>;
};

export type XarrowProps = {
  core: XarrowCoreProps;
  transition: TransitionModel;
};
