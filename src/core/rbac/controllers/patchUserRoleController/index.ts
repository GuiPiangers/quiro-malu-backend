import { PatchUserRoleController } from "./PatchUserRoleController";
import { PatchUserRoleUseCase } from "../../useCases/patchUserRole/PatchUserRoleUseCase";
import { knexRbacRepository } from "../../../../repositories/rbac/knexInstances";

const patchUserRoleUseCase = new PatchUserRoleUseCase(knexRbacRepository);
const patchUserRoleController = new PatchUserRoleController(patchUserRoleUseCase);

export { patchUserRoleController };
