export function toInternationalPhone(phone: string): string {
  const onlyNumbers = String(phone).replace(/\D/g, "");
  if (onlyNumbers.startsWith("55")) return onlyNumbers;
  return `55${onlyNumbers}`;
}
