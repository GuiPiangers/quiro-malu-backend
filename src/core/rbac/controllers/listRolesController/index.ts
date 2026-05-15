import { ListRolesController } from "./ListRolesController";
import { ListRolesUseCase } from "../../useCases/listRoles/ListRolesUseCase";
import { knexRbacRepository } from "../../../../repositories/rbac/knexInstances";

const listRolesUseCase = new ListRolesUseCase(knexRbacRepository);
const listRolesController = new ListRolesController(listRolesUseCase);

export { listRolesController };
