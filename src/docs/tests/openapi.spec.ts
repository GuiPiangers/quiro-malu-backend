import { describe, expect, it } from "vitest";
import { generateOpenApiDocument } from "../swagger";

describe("OpenAPI (Zod)", () => {
  it("gera documento com health e security bearer", () => {
    const doc = generateOpenApiDocument();

    expect(doc.openapi).toBe("3.1.0");
    expect(doc.paths?.["/health"]?.get?.summary).toBeDefined();
    expect(
      doc.components?.securitySchemes?.bearerAuth,
    ).toMatchObject({
      type: "http",
      scheme: "bearer",
    });
  });
});
