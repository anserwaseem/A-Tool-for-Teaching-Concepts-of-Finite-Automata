import { GridColumns } from "@mui/x-data-grid";
import { RowModel } from "../../../../models";
import { MergeTableRowModel } from "../../../../models/minimizeDfa/MergeTableRowModel";

export type MergeTableProps = {
  // rows: RowModel[];
  // columns: GridColumns;
  setCompletedMergeTableRows: React.Dispatch<
    React.SetStateAction<MergeTableRowModel[]>
  >;
  setIsMergeTableComplete: React.Dispatch<React.SetStateAction<boolean>>;
};
