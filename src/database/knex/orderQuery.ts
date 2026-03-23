import { Knex } from "./index";

export function order({
  field,
  orientation,
}: {
  field: string;
  orientation: string;
}) {
  const direction = `${orientation}`.toUpperCase() === "DESC" ? "DESC" : "ASC";
  const columnRef = Knex.ref(field).toQuery();

  return `${columnRef} ${direction}`;
}
