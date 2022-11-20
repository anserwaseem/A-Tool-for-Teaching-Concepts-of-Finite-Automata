export default class RowModel {
  [key: string]: string | number | boolean;
  constructor(
    public id: number,
    public state: string,
    public a: string,
    public b: string,
    public nul: string,
    public isInitial: boolean,
    public isFinal: boolean
  ) {}
}
