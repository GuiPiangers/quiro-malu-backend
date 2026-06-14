import { Entity } from './Entity'

export type MailTemplateDTO = {
  id?: string
  content: string
}

export class MailTemplate extends Entity {
  readonly content: string

  constructor({ content, id }: MailTemplateDTO) {
    super(id)
    this.content = content
  }

  replaceVariables(variables: Record<string, string>): string {
    return this.content.replace(
      /\{\{([^}]+)\}\}/g,
      (fullMatch, rawName: string) => {
        const name = rawName.trim()
        if (Object.prototype.hasOwnProperty.call(variables, name)) {
          return variables[name]
        }
        return fullMatch
      },
    )
  }

  getDTO(): MailTemplateDTO {
    return {
      id: this.id,
      content: this.content,
    }
  }
}
