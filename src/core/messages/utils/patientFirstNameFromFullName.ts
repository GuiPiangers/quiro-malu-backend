export function patientFirstNameFromFullName(fullName: string): string {
  const trimmed = `${fullName}`.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.split(/\s+/)[0] ?? "";
}
