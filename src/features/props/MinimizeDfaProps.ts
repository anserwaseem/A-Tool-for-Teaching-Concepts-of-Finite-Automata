import { GridColumns } from "@mui/x-data-grid";
import { PlaygroundSize } from "../../components/types/PlaygroundSize";
import { RowModel, DraggableStateModel, TransitionModel } from "../../models";

export type MinimizeDfaProps = {
  rows: RowModel[];
  states: DraggableStateModel[];
  transitions: TransitionModel[];
  columns: GridColumns;
  editorPlaygroundSize: PlaygroundSize;
};
