interface IRowModel {
  [key: string]: string | number | boolean;
}

export default class RowModel implements IRowModel {
  constructor(
    public id: number,
    public state: string,
    public a: string,
    public b: string,
    public nul: string,
    public isInitial: boolean,
    public isFinal: boolean
  ) {}
  [key: string]: string | number | boolean;
}
