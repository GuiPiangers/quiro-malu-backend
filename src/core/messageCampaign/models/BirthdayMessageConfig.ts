export interface BirthdayMessageConfigDTO {
  _id?: string;
  campaignId: string;
  sendHour: number; // 0–23
  sendMinute: number; // 0–59
}
