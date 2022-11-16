import { DraggableStateModel, RowModel, TransitionModel } from "../../models";
import {
  NFA_TO_DFA,
  DFA_TO_MINIMIZED_DFA,
  TEST_A_STRING,
} from "../types/AvailableTools";

export type ToolsProps = {
  rows: RowModel[];
  states: DraggableStateModel[];
  transitions: TransitionModel[];
  setToolSelected: React.Dispatch<
    React.SetStateAction<
      | typeof NFA_TO_DFA
      | typeof DFA_TO_MINIMIZED_DFA
      | typeof TEST_A_STRING
      | null
    >
  >;
};
