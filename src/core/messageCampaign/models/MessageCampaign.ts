import { Entity } from "../../shared/Entity";

export type MessageCampaignDTO = {
  id?: string;
  name: string;
  templateMessage: string;
  active: boolean;
  initialDate?: string;
  endDate?: string;
};

export class MessageCampaign extends Entity {
  readonly name: string;
  readonly templateMessage: string;
  readonly active: boolean;
  readonly initialDate?: string;
  readonly endDate?: string;

  constructor({
    active,
    name,
    templateMessage,
    endDate,
    id,
    initialDate,
  }: MessageCampaignDTO) {
    super(id);

    this.name = name;
    this.templateMessage = templateMessage;
    this.active = active;
    this.initialDate = initialDate;
    this.endDate = endDate;
  }

  getDTO() {
    return {
      active: this.active,
      name: this.name,
      templateMessage: this.templateMessage,
      endDate: this.endDate,
      id: this.id,
      initialDate: this.initialDate,
    };
  }
}
