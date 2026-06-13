import { User, UserDTO } from '../User'
import { ApiError } from '../../../../utils/ApiError'

describe('User (integration)', () => {
  test('should create User with valid values', async () => {
    const userData: UserDTO = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(51) 98765 4321',
      password: 'plainPassword!',
      clinicId: 'clinic-id',
    }

    const user = new User(userData)

    expect(user.name.value).toBe('John Doe')
    expect(user.email).toBe('john.doe@example.com')
    expect(user.phone).toBe('(51) 98765 4321')

    const passwordHash = await user.password!.getHash()
    expect(passwordHash).not.toBe('plainPassword!')
    expect(passwordHash).toMatch(/^\$2[aby]\$.{56}$/) // Verificação básica de hash bcrypt
  })

  test('should return correct UserDTO from getUserDTO', async () => {
    const userData: UserDTO = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '(51) 98765 4321',
      password: 'securePassword!',
      clinicId: 'clinic-id',
    }

    const user = new User(userData)
    const userDTO = await user.getUserDTO()

    expect(userDTO).toEqual({
      id: user.id,
      email: 'jane.doe@example.com',
      password: expect.any(String),
      name: 'Jane Doe',
      phone: '(51) 98765 4321',
      clinicId: 'clinic-id',
      status: 'pending',
      roleId: undefined,
    })

    expect(userDTO.password).not.toBe('securePassword!')
    expect(userDTO.password).toMatch(/^\$2[aby]\$.{56}$/) // Confirma o formato de um hash bcrypt
  })

  test('should throw error with invalid email', () => {
    const userData: UserDTO = {
      name: 'Invalid User',
      email: 'invalid-email',
      phone: '(51) 98765 4321',
      password: 'password',
      clinicId: 'clinic-id',
    }

    expect(() => new User(userData)).toThrow('email inválido')
  })

  test('should throw error with invalid phone number', () => {
    const userData: UserDTO = {
      name: 'Invalid User',
      email: 'user@example.com',
      phone: 'invalid-phone',
      password: 'password',
      clinicId: 'clinic-id',
    }

    expect(() => new User(userData)).toThrow(
      'Número de telefone fora do padrão esperado',
    )
  })

  test('should return a new active user when changing password', async () => {
    const user = new User({
      name: 'Pending User',
      email: 'pending@example.com',
      phone: '(51) 98765 4321',
      password: null,
      clinicId: 'clinic-id',
      status: 'pending',
    })

    const changedUser = user.changePassword('NovaSenha1')
    const dto = await changedUser.getUserDTO()

    expect(user.status).toBe('pending')
    expect(user.password).toBeNull()
    expect(changedUser.status).toBe('active')
    expect(dto.password).not.toBe('NovaSenha1')
    expect(dto.password).toMatch(/^\$2[aby]\$.{56}$/)
  })

  test('should reject password change for inactive user', () => {
    const user = new User({
      name: 'Inactive User',
      email: 'inactive@example.com',
      phone: '(51) 98765 4321',
      password: null,
      clinicId: 'clinic-id',
      status: 'inactive',
    })

    expect(() => user.changePassword('NovaSenha1')).toThrow(ApiError)
    expect(() => user.changePassword('NovaSenha1')).toThrow(
      'Conta desativada. Entre em contato com o suporte.',
    )
  })
})
