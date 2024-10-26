import { UserDTO } from "../src/core/authentication/models/User";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<UserDTO>;
    }
  }
}
