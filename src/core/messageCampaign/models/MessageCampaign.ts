import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";
import {
  appEventListener,
  AvailableAppEvents,
} from "../../shared/observers/EventListener";
import { Trigger, TriggerDTO } from "./Trigger";

export type MessageCampaignDTO = {
  id?: string;
  name: string;
  templateMessage: string;
  active: boolean;
  initialDate?: string;
  endDate?: string;
  triggers: TriggerDTO[];
};

export class MessageCampaign extends Entity {
  readonly name: string;
  readonly templateMessage: string;
  readonly active: boolean;
  readonly initialDate?: string;
  readonly endDate?: string;
  readonly triggers: Trigger[];

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
    this.triggers = triggers.map((trigger) => new Trigger(trigger));
  }

  watchTriggers() {
    this.triggers.forEach((trigger) => {
      if (this.isPatientTrigger(trigger.event)) {
        appEventListener.on(trigger.event, async (data) => {
          appEventListener.emit("watchTriggers", {
            messageCampaign: this.getDTO(),
            patientId: data.patientId,
            userId: data.userId,
            trigger,
          });
        });
      }
      if (this.isScheduleTrigger(trigger.event)) {
        appEventListener.on(trigger.event, async (data) => {
          appEventListener.emit("watchTriggers", {
            messageCampaign: this.getDTO(),
            patientId: data.patientId,
            userId: data.userId,
            schedulingId: data.scheduleId,
            trigger,
            date: data.date ? new DateTime(data.date) : undefined,
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
