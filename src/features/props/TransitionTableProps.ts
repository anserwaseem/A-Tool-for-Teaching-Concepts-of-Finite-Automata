import { GridColumns } from "@mui/x-data-grid";
import { RowModel } from "../../models";

export type TransitionTableProps = {
  gridData: RowModel[];
  setGridData: React.Dispatch<React.SetStateAction<RowModel[]>>;
  gridColumns: GridColumns;
  gridRowId: number;
  setGridRowId: React.Dispatch<React.SetStateAction<number>>;
  handleAddRow: (row: RowModel) => void;
};
