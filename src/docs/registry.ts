import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const openApiRegistry = new OpenAPIRegistry();

openApiRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "JWT no header Authorization (scheme Bearer)",
});
