import { Scheduling, SchedulingDTO } from "../Scheduling";
import { ApiError } from "../../../../utils/ApiError";
import { DateTime } from "../../../shared/Date";
import ClientStatusStrategy from "../status/ClientSatusStrayegy";

describe("Scheduling", () => {
  const validDate = "2024-11-01T10:00:00"; // Example valid date

  it("should create an instance of Scheduling with valid data", () => {
    const schedulingData: SchedulingDTO = {
      patientId: "patient-1",
      date: validDate,
      duration: 30,
      service: "Consultation",
      status: "Agendado",
    };

    const scheduling = new Scheduling(schedulingData);

    expect(scheduling.id).toBeDefined();
    expect(scheduling.patientId).toBe(schedulingData.patientId);
    expect(scheduling.date.value).toBe(validDate);
    expect(scheduling.duration).toBe(schedulingData.duration);
    expect(scheduling.service).toBe(schedulingData.service);
    expect(scheduling._status).toBe(schedulingData.status);
  });

  it("should calculate status using the strategy pattern", () => {
    const schedulingData: SchedulingDTO = {
      patientId: "patient-2",
      date: validDate,
      duration: 30,
      status: "Atendido",
    };

    const scheduling = new Scheduling(schedulingData);

    // Assuming ClientStatusStrategy returns the status based on certain logic
    if (scheduling.satusStategy) {
      jest
        .spyOn(scheduling.satusStategy, "calculateStatus")
        .mockReturnValue("Atendido");

      expect(scheduling.status).toBe("Atendido");
      expect(scheduling.satusStategy.calculateStatus).toHaveBeenCalled();
    }
  });

  it("should return the correct DTO", () => {
    const schedulingData: SchedulingDTO = {
      patientId: "patient-3",
      date: validDate,
      duration: 30,
      status: "Agendado",
    };

    const scheduling = new Scheduling(schedulingData);

    const dto = scheduling.getDTO();

    expect(dto).toEqual({
      id: scheduling.id,
      patientId: scheduling.patientId,
      date: validDate,
      duration: scheduling.duration,
      status: "Agendado", // Assuming status has been calculated to 'Agendado'
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
      date: validDate,
      duration: 30,
      status: "Agendado",
    };

    const scheduling = new Scheduling(schedulingData);

    // Mock previous scheduled dates
    const existingSchedules: SchedulingDTO[] = [
      {
        patientId: "patient-5",
        date: "2024-11-01T09:30:00",
        duration: 60,
      },
      {
        patientId: "patient-6",
        date: "2024-11-01T10:30:00",
        duration: 60,
      },
    ];

    expect(scheduling.isAvailableDate(existingSchedules)).toBe(false); // This time overlaps with existing schedules

    const newSchedulingData: SchedulingDTO = {
      patientId: "patient-7",
      date: "2024-11-01T11:00:00",
      duration: 30,
      status: "Agendado",
    };

    const newScheduling = new Scheduling(newSchedulingData);
    expect(newScheduling.isAvailableDate(existingSchedules)).toBe(true); // This time does not overlap
  });
});
