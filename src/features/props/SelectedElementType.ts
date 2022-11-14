export type SelectedElementTypeId = {
  start: string;
  end: string;
  value: string;
};

export type SelectedElementType = {
  id: string | SelectedElementTypeId;
  type: "transition" | "state";
};
