export enum EIdentifierObserver {
  SCHEDULING = "scheduling",
  PROGRESS = "progress",
}

export type observerParams = {
  id: string;
  patientId: string;
  service: string;
  userId: string;
};

export class SchedulingSyncService {
  private observers: Map<string, (data: observerParams) => Promise<unknown>> =
    new Map();

  addObserver<T>(
    identifier: string,
    observer: (data: observerParams) => Promise<T>,
  ) {
    this.observers.set(identifier, observer);
  }

  list() {
    return Array.from(this.observers);
  }

  async synchronizeSchedulingService({
    id: schedulingId,
    patientId,
    service,
    userId,
  }: observerParams) {
    const syncItens = this.list()
      .filter(([key]) => key !== EIdentifierObserver.SCHEDULING)
      .map(([_, values]) =>
        values({ id: schedulingId, patientId, service, userId }),
      );

    return Promise.all(syncItens);
  }

  async synchronizeProgressService({
    id: progressId,
    patientId,
    service,
    userId,
  }: observerParams) {
    const syncItens = this.list()
      .filter(([key]) => key !== EIdentifierObserver.PROGRESS)
      .map(([_, values]) =>
        values({ id: progressId, patientId, service, userId }),
      );

    return Promise.all(syncItens);
  }
}
