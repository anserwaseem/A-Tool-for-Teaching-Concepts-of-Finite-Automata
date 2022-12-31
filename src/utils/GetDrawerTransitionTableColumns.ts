import { GridColumns } from "@mui/x-data-grid";

export const GetDrawerTransitionTableColumns = (
  columns: GridColumns<any>,
  columnsToHide: string[]
): GridColumns<any> => {
  return columns
    ?.filter((col) => col.field !== "action" && col.field !== "id")
    ?.map((col) => {
      return {
        ...col,
        editable: false,
        hide: columnsToHide?.includes(col.field),
      };
    });
};
