import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { openApiRegistry } from "./registry";
import "./registerOpenApiPaths";

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(openApiRegistry.definitions);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "QuiroMalu API",
      description:
        "OpenAPI gerada a partir de schemas Zod (`src/schemas`) e paths (`src/docs/paths`).",
      version: "1.0.0",
    },
    servers: [{ url: "/" }],
    tags: [
      { name: "Clinics", description: "Cadastro de clínica (onboarding)" },
      { name: "Auth", description: "Sessão, tokens e perfil" },
      { name: "Users", description: "Usuários da clínica (lista, papel, exclusão)" },
      { name: "RBAC", description: "Catálogo de permissões e papéis" },
    ],
  });
}
