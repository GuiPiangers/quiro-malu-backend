import { v4 as uuidV4 } from "uuid";

export class Id {
  constructor(readonly value: string = uuidV4()) {}
}
