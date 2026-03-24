import { Entity } from "../../shared/Entity";
import {
  appEventListener,
  AvailableAppEvents,
} from "../../shared/observers/EventListener";
import { DateTime } from "../../shared/Date";
import { Trigger, TriggerDTO } from "./Trigger";
import { triggerFactory } from "./TriggerFactor";

export type CampaignAudienceType =
  | "MOST_RECENT"
  | "MOST_FREQUENT"
  | "SPECIFIC_PATIENTS";

export type MessageCampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "PROCESSING"
  | "DONE"
  | "FAILED";

export type MessageCampaignDTO = {
  id?: string;
  userId?: string;
  name: string;
  templateMessage: string;
  active: boolean;
  initialDate?: string;
  endDate?: string;
  triggers: TriggerDTO<any>[];

  audienceType?: CampaignAudienceType;
  audienceLimit?: number;
  audienceOffsetMinutes?: number;
  audiencePatientIds?: string;

  status?: MessageCampaignStatus;
  scheduledAt?: Date;
  lastDispatchAt?: Date;
  lastDispatchCount?: number;};

export class MessageCampaign extends Entity {
  readonly userId?: string;
  readonly name: string;
  readonly templateMessage: string;
  readonly active: boolean;
  readonly initialDate?: string;
  readonly endDate?: string;
  readonly triggers: Trigger[];

  readonly audienceType?: CampaignAudienceType;
  readonly audienceLimit?: number;
  readonly audienceOffsetMinutes?: number;
  readonly audiencePatientIds?: string;

  readonly status?: MessageCampaignStatus;
  readonly scheduledAt?: Date;
  readonly lastDispatchAt?: Date;
  readonly lastDispatchCount?: number;
  constructor({
    active,
    name,
    templateMessage,
    endDate,
    id,
    initialDate,
    triggers,
    userId,
    audienceType,
    audienceLimit,
    audienceOffsetMinutes,
    audiencePatientIds,
    status,
    scheduledAt,
    lastDispatchAt,
    lastDispatchCount,  }: MessageCampaignDTO) {
    super(id);

    this.userId = userId;
    this.name = name;
    this.templateMessage = templateMessage;
    this.active = active;
    this.initialDate = initialDate;
    this.endDate = endDate;
    this.triggers = triggers.map((trigger) => triggerFactory(trigger));

    this.audienceType = audienceType;
    this.audienceLimit = audienceLimit;
    this.audienceOffsetMinutes = audienceOffsetMinutes;
    this.audiencePatientIds = audiencePatientIds;

    this.status = status;
    this.scheduledAt = scheduledAt;
    this.lastDispatchAt = lastDispatchAt;
    this.lastDispatchCount = lastDispatchCount;  }

  watchTriggers() {
    if (this.active === false) return;
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

  getDTO(): MessageCampaignDTO {
    return {
      active: this.active,
      name: this.name,
      templateMessage: this.templateMessage,
      endDate: this.endDate,
      id: this.id,
      initialDate: this.initialDate,
      userId: this.userId,
      triggers: this.triggers.map((trigger) => trigger.getDTO()),

      audienceType: this.audienceType,
      audienceLimit: this.audienceLimit,
      audienceOffsetMinutes: this.audienceOffsetMinutes,
      audiencePatientIds: this.audiencePatientIds,

      status: this.status,
      scheduledAt: this.scheduledAt,
      lastDispatchAt: this.lastDispatchAt,
      lastDispatchCount: this.lastDispatchCount,    };
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
