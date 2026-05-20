import type { ResolvedPermission } from "../../types/permissions";

export type GenerateTokenInput = {
  userId: string;
  clinicId: string;
  permissions: ResolvedPermission[];
};

export interface IGenerateTokenProvider {
  execute(data: GenerateTokenInput): Promise<string>;
}
