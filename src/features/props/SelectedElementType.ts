export type selectedElementTypeId = {
  start: string;
  end: string;
};

export type selectedElementType = {
  id: string | selectedElementTypeId;
  type: "arrow" | "box";
};
