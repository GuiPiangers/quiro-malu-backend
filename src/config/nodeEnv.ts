import { z } from "zod";

const NodeEnvSchema = z.enum(["development", "production", "test"]);

/**
 * `NODE_ENV` validado na subida do módulo.
 * Valores fora do enum (ou ausentes) caem em `development`, alinhado ao `.env.sample`.
 */
export const NODE_ENV = NodeEnvSchema.catch("development").parse(process.env.NODE_ENV);
