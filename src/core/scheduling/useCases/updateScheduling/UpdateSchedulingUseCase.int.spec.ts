import { v4 as uuidv4 } from "uuid";
import type { Knex } from "knex";
import { ETableNames } from "../../../../database/ETableNames";
import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { createKnexForIntegrationTests } from "../../../../test/integration/knexTestConnection";
import { withRollbackTransaction } from "../../../../test/integration/transactionRollback";
import { appEventListener } from "../../../shared/observers/EventListener";
import { DateTime } from "../../../shared/Date";
import { BlockSchedule } from "../../models/BlockSchedule";
import { UpdateSchedulingUseCase } from "./UpdateSchedulingUseCase";

const integrationEnvReady = Boolean(
  process.env.DB_HOST &&
    process.env.MYSQL_ROOT_USER &&
    process.env.MYSQL_DATABASE,
);

const runIntegrationTests = ["1", "true", "yes"].includes(
  String(process.env.RUN_INTEGRATION_TESTS ?? "").toLowerCase(),
);

const shouldRunIntegrationSuite = integrationEnvReady && runIntegrationTests;

async function insertUserAndPatient(trx: Knex.Transaction) {
  const userId = uuidv4();
  const patientId = uuidv4();
  await trx(ETableNames.USERS).insert({
    id: userId,
    name: "Integration user",
    email: `${userId}@integration.test`,
    password: "not-used",
  });
  await trx(ETableNames.PATIENTS).insert({
    id: patientId,
    name: "Integration patient",
    userId,
  });
  return { userId, patientId };
}

async function insertSchedule(
  trx: Knex.Transaction,
  row: {
    id: string;
    userId: string;
    patientId: string;
    date: string;
    duration: number;
    status: string;
    service: string;
  },
) {
  await trx(ETableNames.SCHEDULES).insert({
    id: row.id,
    userId: row.userId,
    patientId: row.patientId,
    date: row.date,
    duration: row.duration,
    status: row.status,
    service: row.service,
  });
}

function createUpdateSchedulingUseCase(trx: Knex.Transaction) {
  return new UpdateSchedulingUseCase(
    new KnexSchedulingRepository(trx),
    new BlockScheduleRepository(trx),
  );
}

describe.skipIf(!shouldRunIntegrationSuite)(
  "UpdateSchedulingUseCase (integration)",
  () => {
    let knex: Knex;

    beforeAll(() => {
      knex = createKnexForIntegrationTests();
    });

    afterAll(async () => {
      await knex.destroy();
    });

    afterEach(() => {
      appEventListener.clearAllListeners();
      vi.restoreAllMocks();
    });

    it("persiste alterações do agendamento no banco", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const scheduleId = uuidv4();
        await insertSchedule(trx, {
          id: scheduleId,
          userId,
          patientId,
          date: "2030-07-01T09:00:00",
          duration: 3600,
          status: "Agendado",
          service: "Quiropraxia",
        });

        const useCase = createUpdateSchedulingUseCase(trx);

        await useCase.execute({
          userId,
          id: scheduleId,
          patientId,
          date: "2030-07-01T09:00",
          duration: 3600,
          status: "Agendado",
          service: "Massagem",
        });

        const row = await trx(ETableNames.SCHEDULES)
          .where({ id: scheduleId, userId })
          .first();

        expect(row?.service).toBe("Massagem");
      });
    });

    it("retorna 404 quando o agendamento não existe para o usuário", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const useCase = createUpdateSchedulingUseCase(trx);

        await expect(
          useCase.execute({
            userId,
            id: uuidv4(),
            patientId,
            date: "2030-07-02T10:00",
            duration: 3600,
            status: "Agendado",
            service: "Quiropraxia",
          }),
        ).rejects.toMatchObject({
          message: "Agendamento não encontrado",
          statusCode: 404,
        });
      });
    });

    it("exige id do agendamento", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const useCase = createUpdateSchedulingUseCase(trx);

        await expect(
          useCase.execute({
            userId,
            id: "",
            patientId,
            date: "2030-07-02T10:00",
            duration: 3600,
            status: "Agendado",
            service: "Quiropraxia",
          }),
        ).rejects.toMatchObject({
          message: "O id deve ser informado",
          statusCode: 400,
        });
      });
    });

    it("rejeita atualização que sobrepõe outro agendamento em status bloqueante", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const idA = uuidv4();
        const idB = uuidv4();
        await insertSchedule(trx, {
          id: idA,
          userId,
          patientId,
          date: "2030-07-10T09:00:00",
          duration: 3600,
          status: "Agendado",
          service: "A",
        });
        await insertSchedule(trx, {
          id: idB,
          userId,
          patientId,
          date: "2030-07-10T10:30:00",
          duration: 3600,
          status: "Agendado",
          service: "B",
        });

        const useCase = createUpdateSchedulingUseCase(trx);

        await expect(
          useCase.execute({
            userId,
            id: idA,
            patientId,
            date: "2030-07-10T10:00",
            duration: 3600,
            status: "Agendado",
            service: "A",
          }),
        ).rejects.toMatchObject({
          message: "Horário indisponível",
          statusCode: 400,
        });
      });
    });

    it("permite sobrepor agendamento Atendido ou Cancelado", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const idA = uuidv4();
        const idB = uuidv4();
        await insertSchedule(trx, {
          id: idA,
          userId,
          patientId,
          date: "2030-07-11T09:00:00",
          duration: 3600,
          status: "Agendado",
          service: "A",
        });
        await insertSchedule(trx, {
          id: idB,
          userId,
          patientId,
          date: "2030-07-11T10:30:00",
          duration: 3600,
          status: "Atendido",
          service: "B",
        });

        const useCase = createUpdateSchedulingUseCase(trx);

        await useCase.execute({
          userId,
          id: idA,
          patientId,
          date: "2030-07-11T10:00",
          duration: 3600,
          status: "Agendado",
          service: "A",
        });

        const rowA = await trx(ETableNames.SCHEDULES).where({ id: idA }).first();
        expect(rowA?.date).toBeDefined();

        const idC = uuidv4();
        const idD = uuidv4();
        await insertSchedule(trx, {
          id: idC,
          userId,
          patientId,
          date: "2030-07-12T09:00:00",
          duration: 3600,
          status: "Agendado",
          service: "C",
        });
        await insertSchedule(trx, {
          id: idD,
          userId,
          patientId,
          date: "2030-07-12T10:30:00",
          duration: 3600,
          status: "Cancelado",
          service: "D",
        });

        await useCase.execute({
          userId,
          id: idC,
          patientId,
          date: "2030-07-12T10:00",
          duration: 3600,
          status: "Agendado",
          service: "C",
        });
      });
    });

    it("rejeita atualização sobreposta a um evento (bloqueio)", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const blockRepo = new BlockScheduleRepository(trx);
        const block = new BlockSchedule({
          id: uuidv4(),
          date: new DateTime("2030-07-18T08:00"),
          endDate: new DateTime("2030-07-18T18:00"),
          description: "Feriado teste",
        });
        await blockRepo.save(block, userId);

        const scheduleId = uuidv4();
        await insertSchedule(trx, {
          id: scheduleId,
          userId,
          patientId,
          date: "2030-07-18T07:00:00",
          duration: 3600,
          status: "Agendado",
          service: "Fora do bloco",
        });

        const useCase = createUpdateSchedulingUseCase(trx);

        await expect(
          useCase.execute({
            userId,
            id: scheduleId,
            patientId,
            date: "2030-07-18T10:00",
            duration: 3600,
            status: "Agendado",
            service: "Dentro do bloco",
          }),
        ).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(ApiError);
          expect((err as ApiError).message).toMatch(/bloqueado por um evento/);
          return true;
        });
      });
    });

    it("emite updateSchedule no appEventListener e executa listeners", async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx);
        const scheduleId = uuidv4();
        await insertSchedule(trx, {
          id: scheduleId,
          userId,
          patientId,
          date: "2030-07-20T08:00:00",
          duration: 1800,
          status: "Agendado",
          service: "Sessão",
        });

        const listener = vi.fn().mockResolvedValue(undefined);
        appEventListener.on("updateSchedule", listener);
        const emitSpy = vi.spyOn(appEventListener, "emit");

        const useCase = createUpdateSchedulingUseCase(trx);

        await useCase.execute({
          userId,
          id: scheduleId,
          patientId,
          date: "2030-07-20T08:00",
          duration: 1800,
          status: "Agendado",
          service: "Sessão revisada",
        });

        expect(emitSpy).toHaveBeenCalledWith(
          "updateSchedule",
          expect.objectContaining({
            userId,
            patientId,
            scheduleId,
            service: "Sessão revisada",
          }),
        );
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(
          expect.objectContaining({
            userId,
            scheduleId,
            service: "Sessão revisada",
          }),
        );
      });
    });
  },
);
