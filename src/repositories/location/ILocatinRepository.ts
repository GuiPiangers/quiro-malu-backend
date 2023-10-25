import { LocationDTO } from "../../models/shared/Location";

export interface ILocationRepository {
    save(location: LocationDTO, patientId: string, userId: string): Promise<void>;
    update(data: LocationDTO, patientId: string): Promise<void>
    getLocation(patientId: string): Promise<LocationDTO[]>
}
