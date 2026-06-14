import fs from 'fs/promises'
import path from 'path'
import { IMailTemplateRepository } from '../IMailTemplateRepository'
import { MailTemplate } from '../../../core/shared/MailTemplate'
import { logger } from '../../../utils/logger'

export class FsMailTemplateRepository implements IMailTemplateRepository {
  private readonly templatesDir: string

  constructor() {
    this.templatesDir = path.resolve(
      process.cwd(),
      'src',
      'database',
      'mail',
      'templates',
    )
  }

  async getByName(templateName: string): Promise<MailTemplate | null> {
    try {
      const fileName = templateName.endsWith('.html')
        ? templateName
        : `${templateName}.html`
      const filePath = path.resolve(this.templatesDir, fileName)

      const content = await fs.readFile(filePath, 'utf-8')

      return new MailTemplate({ content })
    } catch (error) {
      logger.error({ msg: error })
      return null
    }
  }
}
