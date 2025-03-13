import { MessageCampaign, MessageCampaignDTO } from "../MessageCampaign";
import { Trigger, TriggerDTO } from "../Trigger";
import { appEventListener } from "../../../shared/observers/EventListener";

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
      name: "Campaign Test",
      templateMessage: "Hello, this is a test message",
      active: true,
      initialDate: "2025-01-01",
      endDate: "2025-12-31",
      triggers: [
        { event: "createPatient", condition: "someCondition" } as TriggerDTO,
      ],
    };
  });

  it("should create an instance of MessageCampaign", () => {
    const campaign = new MessageCampaign(messageCampaignDTO);
    expect(campaign).toBeInstanceOf(MessageCampaign);
    expect(campaign.name).toBe("Campaign Test");
    expect(campaign.active).toBe(true);
    expect(campaign.triggers).toHaveLength(1);
    expect(campaign.triggers[0]).toBeInstanceOf(Trigger);
  });

  it("should return DTO representation of MessageCampaign", () => {
    const campaign = new MessageCampaign(messageCampaignDTO);
    expect(campaign.getDTO()).toEqual({
      id: "1",
      name: "Campaign Test",
      templateMessage: "Hello, this is a test message",
      active: true,
      initialDate: "2025-01-01",
      endDate: "2025-12-31",
      triggers: campaign.triggers,
    });
  });

  it("should correctly register event listeners in watchTriggers", () => {
    const campaign = new MessageCampaign(messageCampaignDTO);
    campaign.watchTriggers();
    expect(appEventListener.on).toHaveBeenCalledWith(
      "createPatient",
      expect.any(Function),
    );
  });

  it("should emit event when a trigger event occurs", () => {
    const campaign = new MessageCampaign(messageCampaignDTO);
    campaign.watchTriggers();

    const triggerEventHandler = (appEventListener.on as jest.Mock).mock
      .calls[0][1];

    triggerEventHandler({ patientId: "123", userId: "456" });
    expect(appEventListener.emit).toHaveBeenCalledWith("watchTriggers", {
      messageCampaign: campaign.getDTO(),
      patientId: "123",
      userId: "456",
      trigger: expect.any(Object),
    });
  });

  // it("should correctly identify patient-related triggers", () => {
  //   const campaign = new MessageCampaign(messageCampaignDTO);
  //   expect(campaign.isPatientTrigger("createPatient")).toBe(true);
  //   expect(campaign.isPatientTrigger("updateSchedule")).toBe(false);
  // });

  // it("should correctly identify schedule-related triggers", () => {
  //   const campaign = new MessageCampaign(messageCampaignDTO);
  //   expect(campaign.isScheduleTrigger("createSchedule")).toBe(true);
  //   expect(campaign.isScheduleTrigger("patientBirthDay")).toBe(false);
  // });
});
