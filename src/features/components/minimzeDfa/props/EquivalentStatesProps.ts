import { EquivalentStatesRowModel } from "../../../../models/minimizeDfa/EquivalentStatesRowModel";

export type EquivalentStatesProps = {
  setCompletedEquivalentStatesRows: React.Dispatch<
    React.SetStateAction<EquivalentStatesRowModel[]>
  >;
  setIsEquivalentStatesComplete: React.Dispatch<React.SetStateAction<boolean>>;
};
