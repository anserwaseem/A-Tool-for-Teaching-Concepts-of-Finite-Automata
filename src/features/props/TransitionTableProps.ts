import { GridColumns } from "@mui/x-data-grid";
import { RowModel } from "../../models";

export type TransitionTableProps = {
  rows: RowModel[];
  setRows: React.Dispatch<React.SetStateAction<RowModel[]>>;
  columns: GridColumns;
  rowId: number;
  setRowId: React.Dispatch<React.SetStateAction<number>>;
  handleAddRow: (row: RowModel) => void;
};
