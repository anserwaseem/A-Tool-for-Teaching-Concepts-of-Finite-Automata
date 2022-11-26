import { EquivalentStatesRowModel } from "../../../../models/minimizeDfa/EquivalentStatesRowModel";

export type EquivalentStatesProps = {
  setFilledEquivalentStatesRows: React.Dispatch<
    React.SetStateAction<EquivalentStatesRowModel[]>
  >;
  setIsEquivalentStatesFilled: React.Dispatch<React.SetStateAction<boolean>>;
};
