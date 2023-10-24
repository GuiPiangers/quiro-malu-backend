import { url } from "inspector";
import { StateDTO } from "../../models/entities/State";
import { IAdressProvider } from "./IAddressProvider";
import axios from "axios";

export class AddressProvider implements IAdressProvider {
    async getStates(): Promise<any> {
        try {
            const { data } = await axios('http://www.geonames.org/childrenJSON?geonameId=3469034')
            console.log(data)
            return data
        }
        catch (err) {
            throw new Error(err.message)
        }
    }
    async getCityByUF(state: string): Promise<string[]> {
        throw new Error("Method not implemented.");
    }

}