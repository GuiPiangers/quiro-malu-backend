import { ListClinicUsersResponseSchema } from "../../core/authentication/controllers/listClinicUsersController/listClinicUsersSchemas";
import {
  CreateRoleBodySchema,
  ListPermissionCatalogResponseSchema,
  ListRolePermissionsResponseSchema,
  ListRolesResponseSchema,
  PatchUserRoleBodySchema,
  ReplaceRolePermissionsBodySchema,
  RoleIdParamsSchema,
  RoleRowResponseSchema,
  UpdateRoleBodySchema,
  UserIdParamsSchema,
} from "../../core/rbac/schemas/rbacSchemas";
import { openApiRegistry } from "../registry";

const bearer = [{ bearerAuth: [] }];

/** Usuários da clínica (agrupado para teste no Swagger, logo após Auth). */
openApiRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["Users"],
  summary:
    "Lista usuários da clínica do token (sem senha). Requer permissão `users:read`.",
  security: bearer,
  responses: {
    200: {
      description: "Lista de usuários",
      content: {
        "application/json": { schema: ListClinicUsersResponseSchema },
      },
    },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão `users:read`" },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/users/{id}/role",
  tags: ["Users"],
  summary: "Define o papel do usuário na clínica",
  description: "O usuário alvo deve pertencer à mesma clínica do token.",
  security: bearer,
  request: {
    params: UserIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: PatchUserRoleBodySchema,
          example: {
            roleId: "bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb",
          },
        },
      },
    },
  },
  responses: {
    204: { description: "Papel atualizado" },
    400: { description: "Corpo inválido ou usuário de outra clínica" },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão `users:write`" },
    404: { description: "Usuário ou papel não encontrado" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/users/{id}",
  tags: ["Users"],
  summary: "Remove usuário da clínica",
  description:
    "Exclui o registro do usuário na clínica do token. Agendamentos ligados a esse usuário mantêm a linha com `userId` nulo (FK `schedules.userId` ON DELETE SET NULL). Requer `users:write`.",
  security: bearer,
  request: {
    params: UserIdParamsSchema,
  },
  responses: {
    204: { description: "Usuário removido" },
    400: { description: "Tentativa de remover a si mesmo ou usuário de outra clínica" },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão `users:write`" },
    404: { description: "Usuário não encontrado" },
  },
});

/** Catálogo de permissões e papéis (RBAC). */
openApiRegistry.registerPath({
  method: "get",
  path: "/permissions",
  tags: ["RBAC"],
  summary: "Lista permissões fixas do sistema",
  description:
    "Catálogo para montar formulários de papéis. Requer permissão `users:read`.",
  security: bearer,
  responses: {
    200: {
      description: "Lista ordenada por módulo e ação",
      content: {
        "application/json": { schema: ListPermissionCatalogResponseSchema },
      },
    },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão `users:read`" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/roles",
  tags: ["RBAC"],
  summary: "Lista papéis da clínica do usuário",
  security: bearer,
  responses: {
    200: {
      description: "Papéis da clínica",
      content: {
        "application/json": { schema: ListRolesResponseSchema },
      },
    },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão `users:read`" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/roles",
  tags: ["RBAC"],
  summary: "Cria papel na clínica",
  security: bearer,
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateRoleBodySchema,
          example: { name: "Recepcionista", description: "Acesso restrito" },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Papel criado",
      content: {
        "application/json": { schema: RoleRowResponseSchema },
      },
    },
    400: { description: "Corpo inválido ou nome duplicado" },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão `users:write`" },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/roles/{id}",
  tags: ["RBAC"],
  summary: "Atualiza nome ou descrição do papel",
  security: bearer,
  request: {
    params: RoleIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateRoleBodySchema,
          example: { name: "Recepcionista (noite)" },
        },
      },
    },
  },
  responses: {
    204: { description: "Atualizado" },
    400: { description: "Corpo ou parâmetros inválidos" },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão `users:write`" },
    404: { description: "Papel não encontrado" },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/roles/{id}",
  tags: ["RBAC"],
  summary: "Remove papel (não permite excluir papel de sistema)",
  security: bearer,
  request: { params: RoleIdParamsSchema },
  responses: {
    204: { description: "Removido" },
    400: { description: "Regra de negócio (ex.: papel de sistema)" },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão `users:write`" },
    404: { description: "Papel não encontrado" },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/roles/{id}/permissions",
  tags: ["RBAC"],
  summary: "Lista permissões e escopos do papel",
  security: bearer,
  request: { params: RoleIdParamsSchema },
  responses: {
    200: {
      description: "Permissões do papel",
      content: {
        "application/json": { schema: ListRolePermissionsResponseSchema },
      },
    },
    400: { description: "Parâmetros inválidos" },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão `users:read`" },
    404: { description: "Papel não encontrado" },
  },
});

openApiRegistry.registerPath({
  method: "put",
  path: "/roles/{id}/permissions",
  tags: ["RBAC"],
  summary: "Substitui permissões do papel (corpo completo)",
  description:
    "Não permite alterar permissões de um papel de sistema (`isSystem`). `scope` é JSON opcional (ex.: `{ \"type\": \"all\" }`).",
  security: bearer,
  request: {
    params: RoleIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: ReplaceRolePermissionsBodySchema,
          example: [
            { permissionKey: "patients:read", scope: null },
            { permissionKey: "schedules:read", scope: { type: "own" } },
          ],
        },
      },
    },
  },
  responses: {
    204: { description: "Permissões atualizadas" },
    400: { description: "Corpo inválido ou papel de sistema" },
    401: { description: "Não autenticado" },
    403: { description: "Sem permissão `users:write`" },
    404: { description: "Papel não encontrado" },
  },
});
