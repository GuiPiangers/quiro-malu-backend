import { ProgressDTO } from "../../core/patients/models/Progress"
import { IProgressRepository } from "./IProgressRepository"

export class InMemoryLocation implements IProgressRepository {
    private dbLocation: (ProgressDTO & { patientId: string, userId: string })[] = []

    async save({ patientId, userId, ...data }: ProgressDTO & { userId: string }): Promise<void> {
        this.dbLocation.push({ ...data, patientId, userId })
    }

    async update({ id, patientId, userId, ...data }: ProgressDTO & { userId: string }): Promise<void> {
        const index = this.dbLocation.findIndex(progress => {
            return progress.patientId === patientId && progress.userId === userId && progress.id === id
        })
        this.dbLocation[index] = { ...data, patientId, userId: this.dbLocation[index].userId }
    }

    async get({ id, patientId, userId }: { id: string, patientId: string, userId: string }): Promise<ProgressDTO[]> {
        const selectedUser = await this.dbLocation.find(progress =>
            progress.id === id && progress.patientId === patientId && progress.userId === userId
        )

        if (selectedUser) return [selectedUser]
        else return []
    }
    async list({ patientId, userId }: { id: string, patientId: string, userId: string }): Promise<ProgressDTO[]> {
        const selectedUser = await this.dbLocation.filter(progress =>
            progress.patientId === patientId && progress.userId === userId
        )

        if (selectedUser) return selectedUser
        else return []
    }
    async delete({ id, patientId, userId }: { id: string, patientId: string, userId: string }): Promise<void> {
        await this.dbLocation.find(progress =>
            progress.id === id && progress.patientId === patientId && progress.userId === userId
        )
    }
}