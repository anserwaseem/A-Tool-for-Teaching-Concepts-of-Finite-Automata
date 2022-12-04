import { GridColumns } from "@mui/x-data-grid";
import { DraggableStateModel, RowModel, TransitionModel } from "../../models";
import {
  NFA_TO_DFA,
  MINIMIZE_DFA,
  TEST_A_STRING,
} from "../types/AvailableTools";

export type ToolsProps = {
  // rows: RowModel[];
  // states: DraggableStateModel[];
  // transitions: TransitionModel[];
  // columns: GridColumns;
  setToolSelected: React.Dispatch<
    React.SetStateAction<
      typeof NFA_TO_DFA | typeof MINIMIZE_DFA | typeof TEST_A_STRING | null
    >
  >;
  setIsTestAStringDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
