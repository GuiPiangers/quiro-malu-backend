import { AddressDTO } from "../../models/entities/Address";

export interface IGetAddressByCepProvider {
    execute(cep: string): AddressDTO
}