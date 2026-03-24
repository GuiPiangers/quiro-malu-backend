import { AudienceResolverFactory } from "../../core/messageCampaign/audience/AudienceResolverFactory";
import { DispatchMessageCampaignUseCase } from "../../core/messageCampaign/useCases/dispatchMessageCampaign/dispatchMessageCampaignUseCase";
import { MessageCampaignRepository } from "../../repositories/messageCampaign/MessageCampaignRepository";
import { KnexPatientRepository } from "../../repositories/patient/KnexPatientRepository";
import { QueueProvider } from "../../repositories/queueProvider/queueProvider";
import { sendMessageQueue } from "../../repositories/queueProvider/sendMessageQueue";
import { KnexSchedulingRepository } from "../../repositories/scheduling/KnexSchedulingRepository";
import { CampaignDispatchJob, CampaignDispatchQueue } from "./CampaignDispatchQueue";

const queueProvider = new QueueProvider<CampaignDispatchJob>("campaignDispatchQueue");
const messageCampaignRepository = new MessageCampaignRepository();

const patientRepository = new KnexPatientRepository();
const schedulingRepository = new KnexSchedulingRepository();

const audienceResolverFactory = new AudienceResolverFactory(
  patientRepository,
  schedulingRepository,
);

const dispatchMessageCampaignUseCase = new DispatchMessageCampaignUseCase(
  messageCampaignRepository,
  audienceResolverFactory,
  sendMessageQueue,
);

const campaignDispatchQueue = new CampaignDispatchQueue(
  queueProvider,
  dispatchMessageCampaignUseCase,
);

export { campaignDispatchQueue };
