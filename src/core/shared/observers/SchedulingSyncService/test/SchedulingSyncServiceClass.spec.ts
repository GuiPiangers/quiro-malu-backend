import {
  EIdentifierObserver,
  observerParams,
  SchedulingSyncService,
} from "../SchedulingSyncService";

describe("Service sync class observer", () => {
  let schedulingSyncService: SchedulingSyncService;

  beforeEach(() => {
    schedulingSyncService = new SchedulingSyncService();
  });

  it("should be able to addObservers", () => {
    const mockObserver = jest.fn();
    schedulingSyncService.addObserver(
      EIdentifierObserver.SCHEDULING,
      mockObserver,
    );

    expect(schedulingSyncService.list()).toEqual([
      [EIdentifierObserver.SCHEDULING, mockObserver],
    ]);
  });

  it("Should call all relevant observer on synchronizeSchedulingService", async () => {
    const mockObserver = jest.fn().mockResolvedValue("Success");
    const irrelevantObserver = jest.fn().mockResolvedValue("Irrelevant");

    schedulingSyncService.addObserver(
      EIdentifierObserver.SCHEDULING,
      irrelevantObserver,
    );
    schedulingSyncService.addObserver("customObserver", mockObserver);

    const params: observerParams = {
      id: "123",
      patientId: "456",
      service: "testService",
      userId: "789",
    };

    const results =
      await schedulingSyncService.synchronizeSchedulingService(params);

    expect(mockObserver).toHaveBeenCalledWith(params);
    expect(mockObserver).toHaveBeenCalledTimes(1);

    expect(irrelevantObserver).not.toHaveBeenCalled();

    expect(results).toEqual(["Success"]);
  });

  it("Should call all relevant observer on synchronizeProgressService", async () => {
    const mockObserver = jest.fn().mockResolvedValue("Success");
    const irrelevantObserver = jest.fn().mockResolvedValue("Irrelevant");

    schedulingSyncService.addObserver(
      EIdentifierObserver.PROGRESS,
      irrelevantObserver,
    );
    schedulingSyncService.addObserver("customObserver", mockObserver);

    const params: observerParams = {
      id: "123",
      patientId: "456",
      service: "testService",
      userId: "789",
    };

    const results =
      await schedulingSyncService.synchronizeProgressService(params);

    expect(mockObserver).toHaveBeenCalledWith(params);
    expect(mockObserver).toHaveBeenCalledTimes(1);

    expect(irrelevantObserver).not.toHaveBeenCalled();

    expect(results).toEqual(["Success"]);
  });
});
