import { LocationDTO } from "../../core/shared/Location"
import { ILocationRepository } from "./ILocationRepository"

export class InMemoryLocation implements ILocationRepository {
    private dbLocation: (LocationDTO & { patientId: string, userId: string })[] = []

    async update(data: LocationDTO, patientId: string): Promise<void> {
        const index = this.dbLocation.findIndex(location => {
            return location.patientId === patientId
        })
        this.dbLocation[index] = { ...data, patientId, userId: this.dbLocation[index].userId }
    }
    async getLocation(patientId: string): Promise<LocationDTO[]> {
        const selectedUser = await this.dbLocation.find(location => location.patientId === patientId)

        if (selectedUser) return [selectedUser]
        else return []
    }

    async save(location: LocationDTO, patientId: string, userId: string): Promise<void> {
        this.dbLocation.push({ ...location, patientId, userId })
    }

}