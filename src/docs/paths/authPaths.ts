import { CreateUserBodySchema, CreateUserResponseSchema } from "../../core/authentication/controllers/createUserController/createUserSchemas";
import { LoginBodySchema, LoginResponseSchema } from "../../core/authentication/controllers/loginUserController/loginSchemas";
import { LogoutBodySchema, LogoutResponseSchema } from "../../core/authentication/controllers/logout/logoutSchemas";
import { openApiRegistry } from "../registry";

openApiRegistry.registerPath({
  method: "post",
  path: "/register",
  tags: ["Auth"],
  summary: "Cadastro de usuário",
  request: {
    body: {
      content: { "application/json": { schema: CreateUserBodySchema } },
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
  path: "/login",
  tags: ["Auth"],
  summary: "Login (access + refresh token)",
  request: {
    body: {
      content: { "application/json": { schema: LoginBodySchema } },
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
  summary: "Encerra sessão (invalida refresh token)",
  request: {
    body: {
      content: { "application/json": { schema: LogoutBodySchema } },
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
