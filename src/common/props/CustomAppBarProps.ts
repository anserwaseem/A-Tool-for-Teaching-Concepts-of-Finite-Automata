export type CustomAppBarProps = {
  showRightIcon: boolean;
  open: number;
  setOpen: React.Dispatch<React.SetStateAction<number>>;
  title: string;
};
