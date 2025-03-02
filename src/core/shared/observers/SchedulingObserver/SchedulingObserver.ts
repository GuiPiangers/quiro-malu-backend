import { SchedulingDTO } from "../../../scheduling/models/Scheduling";
import { Observer } from "../Observer";

type ListenerParam = SchedulingDTO & { userId: string };

class SchedulingObserver extends Observer<ListenerParam> {}

export const schedulingObserver = new SchedulingObserver();
