import { StateDTO } from "../../models/entities/State";

export interface IAdressProvider {
    getStates(): Promise<StateDTO[]>
    getCityByUF(state: string): Promise<string[]>
}