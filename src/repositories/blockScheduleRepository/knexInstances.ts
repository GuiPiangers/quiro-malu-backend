import { db } from "../../database/knex";
import { BlockScheduleRepository } from "./BlockScheduleRepository";

export const blockScheduleRepository = new BlockScheduleRepository(db);
