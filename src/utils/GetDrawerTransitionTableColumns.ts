import { GridColumns } from "@mui/x-data-grid";
import { AutomataData } from "../components/types/AutomataData";

export const GetDrawerTransitionTableColumns = (
  dataContext: AutomataData,
  isNullColumnHidden: boolean
): GridColumns<any> => {
  return dataContext.columns
    .filter((col) => col.field !== "action" && col.field !== "id")
    .map((col) => {
      return {
        ...col,
        editable: false,
        hide: col.field === "nul" && isNullColumnHidden,
      };
    });
  // .filter((col) => col.field !== "action" && col.field !== "nul")
  // .map((col) => {
  //   return {
  //     ...col,
  //     editable: false,
  //   };
  // });
};
