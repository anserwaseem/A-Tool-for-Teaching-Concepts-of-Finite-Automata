import { GridColumns } from "@mui/x-data-grid";
import { RowModel } from "../../../../models";

export type ToolsTransitionTableProps = {
  rows: RowModel[];
  columns: GridColumns;
  statesToHighlight?: string[];
  columnName?: string;
};
