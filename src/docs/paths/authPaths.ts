import { CreateUserBodySchema, CreateUserResponseSchema } from "../../core/authentication/controllers/createUserController/createUserSchemas";
import { LoginBodySchema, LoginResponseSchema } from "../../core/authentication/controllers/loginUserController/loginSchemas";
import { LogoutBodySchema, LogoutResponseSchema } from "../../core/authentication/controllers/logout/logoutSchemas";
import {
  RefreshTokenBodySchema,
  RefreshTokenResponseSchema,
} from "../../core/authentication/controllers/refreshTokenController/refreshTokenSchemas";
import { openApiRegistry } from "../registry";

openApiRegistry.registerPath({
  method: "post",
  path: "/register",
  tags: ["Auth"],
  summary: "Cadastro de usuário",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateUserBodySchema,
          example: {
            name: "Maria Silva",
            email: "maria@exemplo.com",
            phone: "(51) 99999 9999",
            password: "Senha123",
            clinicId: "00000000-0000-4000-8000-000000000001",
            roleId: "aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Usuário criado",
      content: {
        "application/json": { schema: CreateUserResponseSchema },
      },
    },
    400: { description: "Corpo inválido ou regra de negócio (ex.: email já cadastrado)" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/refresh-token",
  tags: ["Auth"],
  summary:
    "Renova access token (rotação de refresh). O fingerprint do dispositivo deve ser o mesmo do login (header x-device-id).",
  request: {
    body: {
      content: {
        "application/json": {
          schema: RefreshTokenBodySchema,
          example: {
            refreshTokenId: "00000000-0000-4000-8000-000000000001",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Novo access token e novo refresh token",
      content: {
        "application/json": { schema: RefreshTokenResponseSchema },
      },
    },
    400: { description: "Corpo inválido" },
    401: { description: "Refresh token inválido, expirado ou dispositivo incorreto" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  summary:
    "Login (access + refresh token). Envie o header x-device-id para identificar o dispositivo nas rotas de refresh e logout.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginBodySchema,
          example: {
            email: "eduardo@gmail.com",
            password: "Senha123",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Autenticado",
      content: {
        "application/json": { schema: LoginResponseSchema },
      },
    },
    400: { description: "Credenciais inválidas ou corpo inválido" },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/logout",
  tags: ["Auth"],
  summary:
    "Encerra sessão do dispositivo atual (invalida refresh token). O fingerprint deve ser o mesmo do login (header x-device-id).",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LogoutBodySchema,
          example: {
            refreshTokenId: "00000000-0000-4000-8000-000000000001",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Logout realizado",
      content: {
        "application/json": { schema: LogoutResponseSchema },
      },
    },
    400: { description: "Corpo inválido" },
  },
});
