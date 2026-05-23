import { z } from '../../../schemas/zodOpenApi'
import { PainScaleItemSchema } from './progress/progressBodySchemas'
import { PatientWriteBodySchema } from './patientSharedSchemas'

/**
 * Paciente como retornado pelo repositório (`select *`) + `getPatientDTO` após save.
 * `.passthrough()` reflete colunas extras do banco (ex.: `userId`, `created_at`) no OpenAPI.
 */
export const PatientSavedSchema = PatientWriteBodySchema.extend({
  id: z.string().optional(),
  hashData: z.string().optional(),
  createAt: z.string().optional(),
}).passthrough().openapi('PatientSavedDTO')

export const ListPatientsResponseSchema = z
  .object({
    patients: z.array(PatientSavedSchema),
    total: z.number(),
    limit: z.number(),
  })
  .openapi('ListPatientsResponse')

export const AnamnesisResponseSchema = z
  .object({
    patientId: z.string().optional(),
    mainProblem: z.string().optional(),
    currentIllness: z.string().optional(),
    history: z.string().optional(),
    familiarHistory: z.string().optional(),
    activities: z.string().optional(),
    smoke: z.enum(['yes', 'no', 'passive']).optional(),
    useMedicine: z.boolean().optional(),
    medicines: z.string().optional(),
    underwentSurgery: z.boolean().optional(),
    surgeries: z.string().optional(),
  })
  .openapi('AnamnesisResponse')

export const GetDiagnosticResponseSchema = z
  .object({
    patientId: z.string(),
    diagnostic: z.string().optional(),
    treatmentPlan: z.string().optional(),
  })
  .openapi('GetDiagnosticResponse')

/** Item de lista ou persistência de evolução (`ProgressDTO` / `Progress.getDTO`). */
export const ProgressDTOSchema = z
  .object({
    id: z.string().optional(),
    userId: z.string(),
    patientId: z.string(),
    schedulingId: z.string().optional(),
    service: z.string().optional(),
    actualProblem: z.string().optional(),
    procedures: z.string().optional(),
    date: z.string().optional(),
    createAt: z.string().optional(),
    updateAt: z.string().optional(),
    painScales: z.array(PainScaleItemSchema).optional(),
  })
  .openapi('ProgressDTO')

export const ListProgressResponseSchema = z
  .object({
    progress: z.array(ProgressDTOSchema),
    total: z.number(),
    limit: z.number(),
  })
  .openapi('ListProgressResponse')

export const UploadPatientErrorRowSchema = z
  .object({
    error: z.string(),
    patient: z.record(z.string(), z.unknown()),
  })
  .openapi('UploadPatientErrorRow')

export const UploadPatientsResponseSchema = z
  .object({
    fatalError: z.string().optional(),
    errors: z.array(UploadPatientErrorRowSchema),
    erroCounter: z.number(),
    successCounter: z.number(),
    duplicateCounter: z.number(),
  })
  .openapi('UploadPatientsResult')
