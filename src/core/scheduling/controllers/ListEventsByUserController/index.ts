import { ListEventsByUserController } from "./ListEventsByUserController";
import { listEventsUseCase } from "../ListEventsController";

const listEventsByUserController = new ListEventsByUserController(
  listEventsUseCase,
);

export { listEventsByUserController };
