import { PatientDTO } from "../../../models/Patient"
import { IPatientRepository } from "../../../../../repositories/patient/IPatientRepository"
import { InMemoryPatientRepository } from "../../../../../repositories/patient/inMemory/InMemoryPatientRepository"
import { CreatePatientUseCase } from "../CreatePatientUseCase"
import { ILocationRepository } from "../../../../../repositories/location/ILocationRepository"
import { InMemoryLocation } from "../../../../../repositories/location/InMemoryLocation"

describe("Create patients", () => {

    let patientRepository: IPatientRepository
    let createPatientUseCase: CreatePatientUseCase
    let locationRepository: ILocationRepository

    beforeAll(() => {
        patientRepository = new InMemoryPatientRepository()
        locationRepository = new InMemoryLocation()
        createPatientUseCase = new CreatePatientUseCase(patientRepository, locationRepository)
    })

    it("Should not be able to cadastre a patient with an existing CPF", async () => {
        const patientData: PatientDTO = {
            name: 'Guilherme Eduardo',
            phone: '(51) 99999 9999',
            cpf: '036.638.470-80'
        }
        await createPatientUseCase.execute(patientData, 'id')
        await expect(createPatientUseCase.execute(patientData, 'id')).rejects.toEqual(
            new Error('Já existe um usuário cadastrado com esse CPF')
        )

    })
    it("Should be able to cadastre patient", async () => {
        const patientData: PatientDTO = {
            name: 'Guilherme Eduardo',
            phone: '(51) 99999 9999',
            cpf: '036.638.400-00',
            dateOfBirth: '03/06/2002',
            gender: 'feminino',
            location: {
                address: 'Rua Maranhão',
                city: 'novo hamburgo',
                cep: '11111-111',
                state: {
                    name: 'Rio Grande do Sul',
                    acronym: "SC"
                },
                neighborhood: 'São Jacó'
            }
        }

        const patient = await createPatientUseCase.execute(patientData, 'id')
        expect(patient).toHaveProperty("id")
    })
})

export { }