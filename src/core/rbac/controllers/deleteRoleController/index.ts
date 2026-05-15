import { DeleteRoleController } from "./DeleteRoleController";
import { DeleteRoleUseCase } from "../../useCases/deleteRole/DeleteRoleUseCase";
import { knexRbacRepository } from "../../../../repositories/rbac/knexInstances";

const deleteRoleUseCase = new DeleteRoleUseCase(knexRbacRepository);
const deleteRoleController = new DeleteRoleController(deleteRoleUseCase);

export { deleteRoleController };
