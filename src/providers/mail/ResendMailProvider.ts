import { Resend } from 'resend'
import { IMailProvider, SendMailDTO } from './IMailProvider'
import { ApiError } from '../../utils/ApiError'

export class ResendMailProvider implements IMailProvider {
  private client: Resend

  constructor() {
    const apiKey = process.env.MAIL_API_KEY
    if (!apiKey) {
      throw new ApiError('MAIL_API_KEY environment variable is not defined', 500)
    }
    this.client = new Resend(apiKey)
  }

  async send({ from, to, subject, html }: SendMailDTO): Promise<void> {
    const { error } = await this.client.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      throw new ApiError(`Failed to send email: ${error.message}`, 500)
    }
  }
}

export const resendMailProvider = new ResendMailProvider()
