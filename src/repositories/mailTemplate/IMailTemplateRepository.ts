import { MailTemplate } from '../../core/shared/MailTemplate'

export interface IMailTemplateRepository {
  /**
   * Retorna o template carregado com base no nome ou caminho relativo
   * Ex: getByName('newUser') ou getByName('newUser.html')
   */
  getByName(templateName: string): Promise<MailTemplate | null>
}
