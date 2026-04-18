import { SendStrategyKind } from "./sendStrategyKind";

export type SendStrategyContext = {
  userId: string;
  patientId: string;
};

export interface IMessageSendStrategy {
  readonly kind: SendStrategyKind;
  allowsSend(ctx: SendStrategyContext): Promise<boolean>;
}
