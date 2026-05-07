/**
 * Antes hidratava o listener em memória na subida da API.
 * `BeforeScheduleMessageEventHandlers` consulta o repositório (`listByUserId`)
 * a cada evento de agendamento; este use case permanece como no-op para não quebrar imports.
 */
export class WatchBeforeScheduleMessagesUseCase {
  async execute(): Promise<void> {}
}
