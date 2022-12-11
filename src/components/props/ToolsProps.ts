import * as AvailableTools from "../types/AvailableTools";

export type ToolsProps = {
  setToolSelected: React.Dispatch<
    React.SetStateAction<
      | typeof AvailableTools.IS_DFA
      | typeof AvailableTools.IS_NFA
      | typeof AvailableTools.NFA_TO_DFA
      | typeof AvailableTools.MINIMIZE_DFA
      | typeof AvailableTools.TEST_A_STRING
      | null
    >
  >;
  setIsTestAStringDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
