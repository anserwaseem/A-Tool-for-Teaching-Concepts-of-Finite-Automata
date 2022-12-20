import { GridColumns } from "@mui/x-data-grid";
import { RowModel } from "../../models";

export type TransitionTableProps = {
  rows: RowModel[];
  columns: GridColumns;
};
