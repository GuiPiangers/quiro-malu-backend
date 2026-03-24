import { MessageCampaign, MessageCampaignDTO } from "../MessageCampaign";
import { appEventListener } from "../../../shared/observers/EventListener";
import { DateTime } from "../../../shared/Date";

jest.mock("../../../shared/observers/EventListener", () => ({
  appEventListener: {
    on: jest.fn(),
    emit: jest.fn(),
  },
}));

describe("MessageCampaign", () => {
  let messageCampaignDTO: MessageCampaignDTO;

  beforeEach(() => {
    jest.clearAllMocks();

    messageCampaignDTO = {
      id: "1",
      userId: "user-1",
      name: "Campaign Test",
      templateMessage: "Hello, this is a test message",
      active: true,
      initialDate: "2025-01-01",
      endDate: "2025-12-31",
      triggers: [
        {
          event: "createPatient",
          config: { delay: 0, delayUnit: "minutes" },
        } as any,
      ],
    };
  });

  it("should create an instance of MessageCampaign", () => {
    const campaign = new MessageCampaign(messageCampaignDTO);
    expect(campaign).toBeInstanceOf(MessageCampaign);
    expect(campaign.name).toBe("Campaign Test");
    expect(campaign.active).toBe(true);
    expect(campaign.triggers).toHaveLength(1);
  });

  it("should return DTO representation of MessageCampaign including new optional fields", () => {
    const campaign = new MessageCampaign(messageCampaignDTO);

    const dto = campaign.getDTO();

    expect(dto).toEqual(
      expect.objectContaining({
        id: "1",
        userId: "user-1",
        name: "Campaign Test",
        templateMessage: "Hello, this is a test message",
        active: true,
        initialDate: "2025-01-01",
        endDate: "2025-12-31",
        triggers: campaign.triggers.map((t) => t.getDTO()),
      }),
    );

    expect(dto).toHaveProperty("audienceType");
    expect(dto).toHaveProperty("audienceLimit");
    expect(dto).toHaveProperty("audienceOffsetMinutes");
    expect(dto).toHaveProperty("audiencePatientIds");
    expect(dto).toHaveProperty("status");
    expect(dto).toHaveProperty("scheduledAt");
    expect(dto).toHaveProperty("lastDispatchAt");
    expect(dto).toHaveProperty("lastDispatchCount");
    expect(dto).toHaveProperty("repeatEveryDays");
  });

  it("should correctly register event listeners in watchTriggers", () => {
    const campaign = new MessageCampaign(messageCampaignDTO);
    campaign.watchTriggers();
    expect(appEventListener.on).toHaveBeenCalledWith(
      "createPatient",
      expect.any(Function),
    );
  });

  it("should not register listeners when campaign is inactive", () => {
    const campaign = new MessageCampaign({ ...messageCampaignDTO, active: false });
    campaign.watchTriggers();
    expect(appEventListener.on).not.toHaveBeenCalled();
  });

  it("should emit event when a trigger event occurs", () => {
    const campaign = new MessageCampaign(messageCampaignDTO);
    campaign.watchTriggers();

    const triggerEventHandler = (appEventListener.on as jest.Mock).mock.calls[0][1];

    triggerEventHandler({ patientId: "123", userId: "456" });
    expect(appEventListener.emit).toHaveBeenCalledWith(
      "watchTriggers",
      expect.objectContaining({
        messageCampaign: campaign.getDTO(),
        patientId: "123",
        userId: "456",
        trigger: expect.objectContaining({ event: "createPatient" }),
      }),
    );
  });

  it("should emit watchTriggers event with patientId, userId, scheduleId and date when Schedule events emitted", () => {
    const campaign = new MessageCampaign({
      ...messageCampaignDTO,
      triggers: [
        {
          event: "createSchedule",
          config: { delay: 0, delayUnit: "minutes" },
        } as any,
      ],
    });
    campaign.watchTriggers();

    const triggerEventHandler = (appEventListener.on as jest.Mock).mock.calls[0][1];
    triggerEventHandler({
      patientId: "patientId",
      scheduleId: "scheduleId",
      userId: "userId",
      date: "2025-01-01T10:00",
    });

    expect(appEventListener.emit).toHaveBeenCalledWith(
      "watchTriggers",
      expect.objectContaining({
        messageCampaign: campaign.getDTO(),
        patientId: "patientId",
        userId: "userId",
        schedulingId: "scheduleId",
        date: new DateTime("2025-01-01T10:00"),
        trigger: expect.objectContaining({ event: "createSchedule" }),
      }),
    );
  });
});
