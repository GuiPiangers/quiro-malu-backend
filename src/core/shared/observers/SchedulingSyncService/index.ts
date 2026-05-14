import { setProgressUseCaseFactory } from "../../factories/setProgressUseCaseFactory";
import { updateSchedulingUseCaseFactory } from "../../factories/updateSchedulingUseCaseFactory";
import {
  EIdentifierObserver,
  SchedulingSyncService,
} from "./SchedulingSyncService";

const schedulingSyncService = new SchedulingSyncService();

schedulingSyncService.addObserver(
  EIdentifierObserver.SCHEDULING,
  async ({ id, patientId, service, userId, clinicId }) => {
    return await updateSchedulingUseCaseFactory().execute({
      id,
      patientId,
      service,
      userId,
      clinicId,
    });
  },
);

schedulingSyncService.addObserver(
  EIdentifierObserver.PROGRESS,
  async ({ id, patientId, service, clinicId }) => {
    return await setProgressUseCaseFactory().execute({
      id,
      patientId,
      service,
      clinicId,
    });
  },
);

export { schedulingSyncService };
