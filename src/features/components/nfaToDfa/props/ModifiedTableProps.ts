import { RowModel } from "../../../../models";

export type ModifiedTableProps = {
  rows: RowModel[];
  setIsModifiedTransitionTableComplete?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};
