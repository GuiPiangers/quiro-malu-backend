import { SchedulingDTO } from "../../../scheduling/models/Scheduling";

type ListenerParam = SchedulingDTO & { userId: string };
type Listener = (data: ListenerParam) => Promise<void>;

class SchedulingObserver {
  private listeners: Map<string, Array<Listener>> = new Map();

  on(identifier: string, callback: Listener) {
    if (!this.listeners.has(identifier)) this.listeners.set(identifier, []);

    this.listeners.get(identifier)?.push(callback);
  }

  emit(identifier: string, scheduling: ListenerParam) {
    if (this.listeners.has(identifier)) {
      this.listeners.get(identifier)?.forEach((listener) => {
        listener(scheduling);
      });
    }
  }
}

export const schedulingObserver = new SchedulingObserver();
