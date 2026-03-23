import { Knex } from "./index";

const SIMPLE_IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/;

function normalizeOrientation(orientation: string) {
  return `${orientation}`.toUpperCase() === "DESC" ? "DESC" : "ASC";
}

export function order({
  field,
  orientation,
}: {
  field: string;
  orientation: string;
}) {
  const direction = normalizeOrientation(orientation);

  const normalizedField = `${field}`.replace(/[\\]/g, "").trim();
  const orderTarget = SIMPLE_IDENTIFIER_REGEX.test(normalizedField)
    ? Knex.ref(normalizedField).toQuery()
    : normalizedField;

  return `${orderTarget} ${direction}`;
}
