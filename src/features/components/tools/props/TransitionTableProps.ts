import { GridColumns } from "@mui/x-data-grid";
import { RowModel } from "../../../../models";

export type ToolsTransitionTableProps = {
  rows: RowModel[];
  columns: GridColumns;
  row1ToHighlight?: RowModel;
  row2ToHighlight?: RowModel;
  statesToHighlight?: string[];
  columnName?: string;
};
