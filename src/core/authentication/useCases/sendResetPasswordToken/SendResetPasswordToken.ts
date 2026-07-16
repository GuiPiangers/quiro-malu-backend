import { IMailProvider } from '../../../../providers/mail/IMailProvider'
import { IMailTemplateRepository } from '../../../../repositories/mailTemplate/IMailTemplateRepository'
import { IUserRepository } from '../../../../repositories/user/IUserRepository'
import { ApiError } from '../../../../utils/ApiError'
import { CreateChangePasswordTokenUseCase } from '../createChangePasswordToken/CreateChangePasswordTokenUseCase'

export type SendResetPasswordTokenDTO = {
  email: string
  name: string
}

export class SendResetPasswordTokenUseCase {
  constructor(
    private readonly createChangePasswordTokenUseCase: CreateChangePasswordTokenUseCase,
    private readonly userRepository: IUserRepository,
    private readonly mailProvider: IMailProvider,
    private readonly mailTemplateRepository: IMailTemplateRepository,
  ) {}

  async execute({ email }: SendResetPasswordTokenDTO): Promise<void> {
    const ttlMinutes = 30
    const [user] = await this.userRepository.getByEmail(email)

    if (!user?.id) {
      throw new ApiError('Usuário não encontrado ao gerar token', 400)
    }

    const token = await this.createChangePasswordTokenUseCase.execute(email, ttlMinutes)

    if (!token) {
      throw new ApiError('Usuário não encontrado ao gerar token', 400)
    }

    const template = await this.mailTemplateRepository.getByName('passwordRecover')

    if (!template) {
      throw new ApiError('Template de email "passwordRecover" não encontrado', 500)
    }

    const appUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const resetUrl = `${appUrl}/redefinir-senha?token=${token}`

    const html = template.replaceVariables({
      name: user.name,
      expiresIn: `${ttlMinutes} minutos`,
      resetUrl,
    })

    await this.mailProvider.send({
      from: `QuiroMalu <${process.env.MAIL_SENDER}>`,
      to: email,
      subject: 'QuiroMalu - Redefinir senha',
      html,
    })
  }
}
