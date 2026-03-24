import { Entity } from "../../shared/Entity";

export type MessageTemplateDTO = {
  id?: string;
  textTemplate: string;
};

export class MessageTemplate extends Entity {
  readonly textTemplate: string;

  constructor({ textTemplate, id }: MessageTemplateDTO) {
    super(id);
    this.textTemplate = textTemplate;
  }

  replaceVariables(objectMap: Record<string, string>): string {
    return this.textTemplate.replace(
      /\{\{([^}]+)\}\}/g,
      (fullMatch, rawName: string) => {
        const name = rawName.trim();
        if (Object.prototype.hasOwnProperty.call(objectMap, name)) {
          return objectMap[name];
        }
        return fullMatch;
      },
    );
  }

  getDTO(): MessageTemplateDTO {
    return {
      id: this.id,
      textTemplate: this.textTemplate,
    };
  }
}
