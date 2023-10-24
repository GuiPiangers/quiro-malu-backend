import { Id } from "./Id";

export abstract class Entity {
  readonly id: Id;

  constructor(id: string) {
    this.id = new Id(id);
  }

  equal(entity: Entity): boolean {
    return this.id.value === entity.id.value;
  }
}
