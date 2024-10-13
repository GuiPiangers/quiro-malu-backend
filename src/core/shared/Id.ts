import { v4 as uuidV4, validate } from "uuid";
import { ApiError } from "../../utils/ApiError";

export class Id {
  constructor(readonly value: string = uuidV4()) {}
}
