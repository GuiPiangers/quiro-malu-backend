import { db } from "../../database/knex";
import { AfterScheduleMessageRepository } from "./AfterScheduleMessageRepository";
import { BeforeScheduleMessageRepository } from "./BeforeScheduleMessageRepository";
import { BirthdayMessageRepository } from "./BirthdayMessageRepository";

export const birthdayMessageRepository = new BirthdayMessageRepository(db);
export const beforeScheduleMessageRepository =
  new BeforeScheduleMessageRepository(db);
export const afterScheduleMessageRepository =
  new AfterScheduleMessageRepository(db);
