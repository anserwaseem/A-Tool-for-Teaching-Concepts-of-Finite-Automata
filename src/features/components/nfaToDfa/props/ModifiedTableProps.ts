import { RowModel } from "../../../../models";

export type ModifiedTableProps = {
  rows: RowModel[];
  setRows: React.Dispatch<React.SetStateAction<RowModel[]>>;
  setIsModifiedTransitionTableComplete?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};
