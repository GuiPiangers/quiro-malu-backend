import { AvailableAppEvents } from "../../shared/observers/EventListener";
import {
  TriggerWithDelay,
  TriggerWithDynamicDate,
  TriggerWithStaticDate,
} from "./Trigger";

export function triggerFactor({
  config,
  event,
}: {
  event: AvailableAppEvents;
  config: any;
}) {
  const withDelayTriggers: AvailableAppEvents[] = [
    "createPatient",
    "createSchedule",
  ];
  const withDynamicDate: AvailableAppEvents[] = ["patientBirthDay"];

  if (withDelayTriggers.some((trigger) => trigger === event))
    return new TriggerWithDelay({ event, config });

  if (withDynamicDate.some((trigger) => trigger === event))
    return new TriggerWithDynamicDate({ event });

  return new TriggerWithStaticDate({ event, config });
}
