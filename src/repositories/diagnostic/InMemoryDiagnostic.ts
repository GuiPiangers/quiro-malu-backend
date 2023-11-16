import { DiagnosticDTO } from "../../core/patients/models/Diagnostic"
import { IDiagnosticRepository } from "./IDiagnosticRepository"

export class InMemoryDiagnostic implements IDiagnosticRepository {
    private dbLocation: (DiagnosticDTO & { patientId: string, userId: string })[] = []
    async save({ patientId, ...data }: DiagnosticDTO, userId: string): Promise<void> {
        this.dbLocation.push({ ...data, patientId, userId })
    }

    async update({ patientId, ...data }: DiagnosticDTO): Promise<void> {
        const index = this.dbLocation.findIndex(location => {
            return location.patientId === patientId
        })
        this.dbLocation[index] = { ...data, patientId, userId: this.dbLocation[index].userId }
    }

    async get(patientId: string): Promise<DiagnosticDTO[]> {
        const selectedUser = await this.dbLocation.find(location => location.patientId === patientId)

        if (selectedUser) return [selectedUser]
        else return []
    }
}