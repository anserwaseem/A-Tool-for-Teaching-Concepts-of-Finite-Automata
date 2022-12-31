import { ToolsTransitionTableProps } from "../../features/components/tools/props/TransitionTableProps";

export type CustomDrawerProps = {
  isLeft: boolean;
  open: number;
  setOpen: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  transitionTableProps: ToolsTransitionTableProps;
};
