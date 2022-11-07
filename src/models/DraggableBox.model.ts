export default class DraggableBoxModel {
  constructor(
    public id: string,
    public x: number,
    public y: number,
    public ref: React.RefObject<HTMLDivElement>
  ) {}
}
