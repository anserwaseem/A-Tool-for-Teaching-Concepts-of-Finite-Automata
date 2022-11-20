import { PlaygroundSize } from "../../../../components/types/PlaygroundSize";
import { RowModel } from "../../../../models";

export type ResultantDfaProps = {
  rows: RowModel[];
  setIsResultantDfaComplete: React.Dispatch<React.SetStateAction<boolean>>;
  editorPlaygroundSize: PlaygroundSize;
};
