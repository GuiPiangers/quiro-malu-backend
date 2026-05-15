import { CreateRoleController } from "./CreateRoleController";
import { CreateRoleUseCase } from "../../useCases/createRole/CreateRoleUseCase";
import { knexRbacRepository } from "../../../../repositories/rbac/knexInstances";

const createRoleUseCase = new CreateRoleUseCase(knexRbacRepository);
const createRoleController = new CreateRoleController(createRoleUseCase);

export { createRoleController };
