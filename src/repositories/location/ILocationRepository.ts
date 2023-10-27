import { LocationDTO } from "../../core/shared/Location";

export interface ILocationRepository {
    save(location: LocationDTO, patientId: string, userId: string): Promise<void>;
    update(data: LocationDTO, patientId: string, userId: string): Promise<void>
    getLocation(patientId: string, userId: string): Promise<LocationDTO[]>
}
