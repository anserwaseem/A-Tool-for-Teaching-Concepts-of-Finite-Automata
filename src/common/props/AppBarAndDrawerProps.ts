import { ToolsTransitionTableProps } from "../../features/components/tools/props/TransitionTableProps";

export type AppBarAndDrawerProps = {
  headerTitle: string;
  open: number;
  setOpen: React.Dispatch<React.SetStateAction<number>>;
  transitionTableProps: ToolsTransitionTableProps;
  drawerTitle?: string;
};
