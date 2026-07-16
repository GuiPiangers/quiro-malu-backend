import { IMailProvider } from '../../../../providers/mail/IMailProvider'
import { IMailTemplateRepository } from '../../../../repositories/mailTemplate/IMailTemplateRepository'
import { ApiError } from '../../../../utils/ApiError'
import { CreateChangePasswordTokenUseCase } from '../createChangePasswordToken/CreateChangePasswordTokenUseCase'

export type SendNewUserTokenDTO = {
  email: string
  name: string
}

export class SendNewUserTokenUseCase {
  constructor(
    private readonly createChangePasswordTokenUseCase: CreateChangePasswordTokenUseCase,
    private readonly mailProvider: IMailProvider,
    private readonly mailTemplateRepository: IMailTemplateRepository,
  ) {}

  async execute({ email, name }: SendNewUserTokenDTO): Promise<void> {
    const token = await this.createChangePasswordTokenUseCase.execute(email)

    if (!token) {
      throw new ApiError('Usuário não encontrado ao gerar token', 400)
    }

    const template = await this.mailTemplateRepository.getByName('newUser')

    if (!template) {
      throw new ApiError('Template de email "newUser" não encontrado', 500)
    }

    const appUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const loginUrl = `${appUrl}/redefinir-senha?token=${token}`

    const html = template.replaceVariables({
      name,
      email,
      loginUrl,
    })

    await this.mailProvider.send({
      from: `QuiroMalu <${process.env.MAIL_SENDER}>`,
      to: email,
      subject: 'Bem-vindo ao QuiroMalu',
      html,
    })
  }
}
