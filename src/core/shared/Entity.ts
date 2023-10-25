import { Id } from "./Id";

export abstract class Entity {
  private _id: Id;

  constructor(id: string | undefined) {
    this._id = new Id(id);
  }

  get id() { return this._id.value }

}
