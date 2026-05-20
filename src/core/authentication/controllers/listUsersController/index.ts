import { knexUserRepository } from "../../../../repositories/user/knexInstances";
import { ListUsersController } from "./ListUsersController";
import { ListUsersUseCase } from "../../useCases/listUsers/ListUsersUseCase";

const listUsersUseCase = new ListUsersUseCase(knexUserRepository);
const listUsersController = new ListUsersController(listUsersUseCase);

export { listUsersController };
