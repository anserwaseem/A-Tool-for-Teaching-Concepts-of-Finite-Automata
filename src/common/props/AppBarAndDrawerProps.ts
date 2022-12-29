import { ToolsTransitionTableProps } from "../../features/components/tools/props/TransitionTableProps";

export type AppBarAndDrawerProps = {
  title: string;
  open: number;
  setOpen: React.Dispatch<React.SetStateAction<number>>;
  transitionTableProps: ToolsTransitionTableProps;
};
