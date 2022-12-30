import { RowModel } from "../../../../models";

export type ModifiedTableProps = {
  rows: RowModel[];
  setRows: React.Dispatch<React.SetStateAction<RowModel[]>>;
  nullClosureRows: RowModel[];
  setIsModifiedTransitionTableComplete?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};
