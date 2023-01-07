import { PlaygroundSize } from "../../../../common/types/PlaygroundSize";
import { RowModel } from "../../../../models";

export type ResultantDfaProps = {
  rows: RowModel[];
  setIsResultantDfaComplete: React.Dispatch<React.SetStateAction<boolean>>;
  playgroundSize: PlaygroundSize;
  stateSize: number;
};
