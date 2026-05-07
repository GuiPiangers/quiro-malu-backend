/**
 * Antes hidratava o listener em memória na subida da API.
 * `AfterScheduleMessageEventHandlers` passa a consultar o repositório (`listByUserId`)
 * a cada evento de agendamento; este use case permanece como no-op para não quebrar imports.
 */
export class WatchAfterScheduleMessagesUseCase {
  async execute(): Promise<void> {}
}
