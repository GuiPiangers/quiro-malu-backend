import { UserDTO } from "../../../models/User"
import { IUserRepository } from "../../../../../repositories/user/IUserRepository"
import { InMemoryUserRepository } from "../../../../../repositories/user/inMemory/InMemoryUserRepository"
import { GetUserProfileUseCase } from "../GetUserProfileUseCase"

describe("get user", () => {

    let userRepository: IUserRepository
    let getUserProfileUseCase: GetUserProfileUseCase

    beforeAll(() => {
        userRepository = new InMemoryUserRepository()
        getUserProfileUseCase = new GetUserProfileUseCase(userRepository)
    })

    it("Should be able to create user", async () => {
        const userData: UserDTO = {
            id: 'fakeId',
            email: 'existingUser@gmail.com',
            password: 'Senha123',
            name: 'Existing User Name',
            phone: '(51) 99999 9999'
        }

        userRepository.save(userData)
        const user = await getUserProfileUseCase.execute('fakeId')

        expect(user).toEqual(userData)
    })

    it("Should not be get an user that not exist", async () => {
        await expect(getUserProfileUseCase.execute('notExistingId')).rejects.toEqual(
            new Error('Não foi possível encontrar o usuário')
        )
    })
})

export { }