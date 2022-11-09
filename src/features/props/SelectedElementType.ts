export type selectedElementTypeId = {
  start: string;
  end: string;
  value: string;
};

export type selectedElementType = {
  id: string | selectedElementTypeId;
  type: "arrow" | "box";
};
