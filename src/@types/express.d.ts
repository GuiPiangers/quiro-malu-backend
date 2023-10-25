import { UserDTO } from "../patients/models/entities/User";

declare global {
    namespace Express {
        export interface Request {
            user: Partial<UserDTO>
        }
    }
}