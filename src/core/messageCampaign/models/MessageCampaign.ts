import { Entity } from "../../shared/Entity";
import {
  appEventListener,
  AvailableAppEvents,
} from "../../shared/observers/EventListener";

export type MessageCampaignDTO = {
  id?: string;
  name: string;
  templateMessage: string;
  active: boolean;
  initialDate?: string;
  endDate?: string;
  triggers: AvailableAppEvents[];
};

export class MessageCampaign extends Entity {
  readonly name: string;
  readonly templateMessage: string;
  readonly active: boolean;
  readonly initialDate?: string;
  readonly endDate?: string;
  readonly triggers: AvailableAppEvents[];

  constructor({
    active,
    name,
    templateMessage,
    endDate,
    id,
    initialDate,
    triggers,
  }: MessageCampaignDTO) {
    super(id);

    this.name = name;
    this.templateMessage = templateMessage;
    this.active = active;
    this.initialDate = initialDate;
    this.endDate = endDate;
    this.triggers = triggers;
  }

  watchTriggers() {
    this.triggers.forEach((trigger) => {
      if (this.isPatientTrigger(trigger)) {
        appEventListener.on(trigger, async (data) => {
          appEventListener.emit("sendMessage", {
            messageCampaign: this.getDTO(),
            patientId: data.patientId,
            userId: data.userId,
          });
        });
      }
      if (this.isScheduleTrigger(trigger)) {
        appEventListener.on(trigger, async (data) => {
          appEventListener.emit("sendMessage", {
            messageCampaign: this.getDTO(),
            patientId: data.patientId,
            userId: data.userId,
            schedulingId: data.scheduleId,
          });
        });
      }
    });
  }

  getDTO() {
    return {
      active: this.active,
      name: this.name,
      templateMessage: this.templateMessage,
      endDate: this.endDate,
      id: this.id,
      initialDate: this.initialDate,
      triggers: this.triggers,
    };
  }

  private isPatientTrigger(
    trigger: AvailableAppEvents,
  ): trigger is "createPatient" | "patientBirthDay" | "updatePatient" {
    const sendMessageTriggers = [
      "createPatient",
      "patientBirthDay",
      "updatePatient",
    ];

    if (
      sendMessageTriggers.some((messageTrigger) => messageTrigger === trigger)
    )
      return true;
    return false;
  }

  private isScheduleTrigger(
    trigger: AvailableAppEvents,
  ): trigger is "createSchedule" | "updateSchedule" {
    const sendMessageTriggers = ["createSchedule", "updateSchedule"];

    if (
      sendMessageTriggers.some((messageTrigger) => messageTrigger === trigger)
    )
      return true;
    return false;
  }
}
