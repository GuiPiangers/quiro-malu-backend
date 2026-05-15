import { UpdateRoleController } from "./UpdateRoleController";
import { UpdateRoleUseCase } from "../../useCases/updateRole/UpdateRoleUseCase";
import { knexRbacRepository } from "../../../../repositories/rbac/knexInstances";

const updateRoleUseCase = new UpdateRoleUseCase(knexRbacRepository);
const updateRoleController = new UpdateRoleController(updateRoleUseCase);

export { updateRoleController };
