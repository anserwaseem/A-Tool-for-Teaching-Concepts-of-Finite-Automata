import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../../models";

export type ModifiedTableProps = {
  rows: RowModel[];
  setIsModifiedTransitionTableComplete?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};
