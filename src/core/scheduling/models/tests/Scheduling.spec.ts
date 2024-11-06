import { Scheduling, SchedulingDTO } from "../Scheduling";

describe("Scheduling", () => {
  const validDate = "2024-11-01T10:00";

  it("should create an instance of Scheduling with valid data", () => {
    const schedulingData: SchedulingDTO = {
      patientId: "patient-1",
      date: validDate,
      duration: 60 * 30,
      service: "Consultation",
      status: "Atendido",
    };

    const scheduling = new Scheduling(schedulingData);

    expect(scheduling.id).toBeDefined();
    expect(scheduling.patientId).toBe(schedulingData.patientId);
    expect(scheduling.date.value).toBe(validDate);
    expect(scheduling.duration).toBe(schedulingData.duration);
    expect(scheduling.service).toBe(schedulingData.service);
  });

  // it("should calculate status using the strategy pattern", () => {
  //   const schedulingData: SchedulingDTO = {
  //     patientId: "patient-2",
  //     date: validDate,
  //     duration: 30,
  //     status: "Atendido",
  //   };

  //   const scheduling = new Scheduling(schedulingData);

  //   // Assuming ClientStatusStrategy returns the status based on certain logic
  //   if (scheduling.satusStategy) {
  //     jest
  //       .spyOn(scheduling.satusStategy, "calculateStatus")
  //       .mockReturnValue("Atendido");

  //     expect(scheduling.status).toBe("Atendido");
  //     expect(scheduling.satusStategy.calculateStatus).toHaveBeenCalled();
  //   }
  // });

  it("should return the correct DTO", () => {
    const schedulingData: SchedulingDTO = {
      id: "1",
      patientId: "patient-3",
      date: validDate,
      duration: 60 * 30, // 30 min
      status: "Atendido",
    };

    const scheduling = new Scheduling(schedulingData);
    const dto = scheduling.getDTO();

    expect(dto).toEqual({
      id: scheduling.id,
      patientId: scheduling.patientId,
      date: validDate,
      duration: scheduling.duration,
      status: "Atendido",
      createAt: undefined,
      updateAt: undefined,
      service: scheduling.service,
      patient: undefined,
      phone: undefined,
    });
  });

  it("should check if the date is available", () => {
    const schedulingData: SchedulingDTO = {
      patientId: "patient-4",
      date: "2024-11-01T09:30",
      duration: 60 * 60, // 60 minutes
      status: "Agendado",
    };

    const scheduling = new Scheduling(schedulingData);
    const existingSchedules: SchedulingDTO[] = [
      {
        patientId: "patient-5",
        duration: 60 * 60, // 60 minutes
        date: "2024-11-01T09:30",
      },
      {
        patientId: "patient-5",
        duration: 60 * 60, // 60 minutes,
        date: "2024-11-01T10:30",
      },
    ];

    expect(scheduling.notAvailableDate(existingSchedules)).toBe(true);

    const newSchedulingData: SchedulingDTO = {
      patientId: "patient-7",
      date: "2024-10-01T13:00",
      duration: 60 * 60, // 60 minutes,
      status: "Agendado",
    };

    const newScheduling = new Scheduling(newSchedulingData);
    expect(newScheduling.notAvailableDate(existingSchedules)).toBe(false); // This time does not overlap
  });
});
