import { UserDTO } from "../../../models/User"
import { IUserRepository } from "../../../../../repositories/user/IUserRepository"
import { InMemoryUserRepository } from "../../../../../repositories/user/inMemory/InMemoryUserRepository"
import { CreateUserUseCase } from "../CreateUserUseCase"

describe("Create user", () => {

    let userRepository: IUserRepository
    let createUserUseCase: CreateUserUseCase

    beforeAll(() => {
        userRepository = new InMemoryUserRepository()
        createUserUseCase = new CreateUserUseCase(userRepository)
    })

    it("Should be able to create user", async () => {
        const userData: UserDTO = {
            email: 'guilherme@gmail.com',
            password: 'Senha123',
            name: 'Guilherme Eduardo',
            phone: '(51) 99999 9999'
        }

        const user = await createUserUseCase.execute(userData)
        expect(user).toHaveProperty("id")
    })

    it("The name should not have less than 3 caracteres", async () => {
        const user: UserDTO = {
            email: 'existingUser@gmail.com',
            password: 'Senha123',
            name: 'nm',
            phone: '(51) 99999 9999'
        }

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new Error('Deve ser informado no mínimo 3 caracteres')
        )
    })
    it("The name should not have more than 120 caracteres", async () => {
        const user: UserDTO = {
            email: 'existingUser@gmail.com',
            password: 'Senha123',
            name: 'nmqwertyuiopasdfghjklçzxcvbnmqwertyuiopasdfghjklzxcvbnm asdqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjkl asdqwertyuioqwrtypdsad asd',
            phone: '(51) 99999 9999'
        }

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new Error('Deve ser informado no máximo 120 caracteres')
        )
    })
    it("The email should not be invalid", async () => {
        const user: UserDTO = {
            email: 'existingUser',
            password: 'Senha123',
            name: 'Guilherme Piangers',
            phone: '(51) 99999 9999'
        }

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new Error('email inválido')
        )
    })
    it("The email should not be invalid", async () => {
        const user: UserDTO = {
            email: 'existingUser@gmail',
            password: 'Senha123',
            name: 'Guilherme Piangers',
            phone: '(51) 99999 9999'
        }

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new Error('email inválido')
        )
    })
    it("The phone should not be different than pattern", async () => {
        const user: UserDTO = {
            email: 'existingUser@gmail.com',
            password: 'Senha123',
            name: 'Guilherme Piangers',
            phone: '51 99999 9999'
        }

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new Error('Número de telefone fora do padrão esperado')
        )
    })
    it("The password should not contain only letters", async () => {
        const user: UserDTO = {
            email: 'existingUser@gmail.com',
            password: 'Senha',
            name: 'Guilherme Piangers',
            phone: '(51) 99999 9999'
        }

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new Error('A senha deve conter pelo menos um número ou carácter especial')
        )
    })
    it("The password should not be short than 5 caracteres", async () => {
        const user: UserDTO = {
            email: 'existingUser@gmail.com',
            password: 'Sen1',
            name: 'Guilherme Piangers',
            phone: '(51) 99999 9999'
        }

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new Error('A senha deve conter pelo menos 5 caracteres')
        )
    })
    it("The password should not contain only lowercase letters", async () => {
        const user: UserDTO = {
            email: 'existingUser@gmail.com',
            password: 'senha123',
            name: 'Guilherme Piangers',
            phone: '(51) 99999 9999'
        }

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new Error('A senha deve conter pelo menos uma letra maiúscula')
        )
    })
    it("Should not be able to create an existing user", async () => {
        const user: UserDTO = {
            email: 'existingUser@gmail.com',
            password: 'Senha123',
            name: 'Existing User Name',
            phone: '(51) 99999 9999'
        }

        await createUserUseCase.execute(user)
        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new Error('Usuário já cadastrado')
        )
    })
})

export { }