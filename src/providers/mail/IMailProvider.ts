export interface SendMailDTO {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface IMailProvider {
  send(data: SendMailDTO): Promise<void>;
}
