/**
 * Side-effects: cada import registra rotas em `openApiRegistry`.
 * Ordem: Clinics → Auth → RBAC (Users + papéis) para alinhar ao fluxo no Swagger.
 * Ao adicionar documentação, crie `paths/fooPaths.ts` e importe aqui.
 */
import "./paths/clinicPaths";
import "./paths/authPaths";
import "./paths/healthPaths";
import "./paths/patientPaths";
import "./paths/schedulingPaths";
import "./paths/servicePaths";
import "./paths/financePaths";
import "./paths/messagesPaths";
import "./paths/rbacPaths";
import "./paths/clinicianPaths";
