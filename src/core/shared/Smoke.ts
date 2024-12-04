export abstract class Smoke {
  static convertSmoke(smoke?: string): "yes" | "no" | "passive" | undefined {
    if (!smoke) return undefined;
    const validYes = ["sim", "s", "yes"];
    const validNo = ["não", "n", "no"];
    const validPassive = ["passive", "passivo"];

    const yes = validYes.includes(smoke.toLowerCase()) ? "yes" : undefined;
    const no = validNo.includes(smoke.toLowerCase()) ? "no" : undefined;
    const passive = validPassive.includes(smoke.toLowerCase())
      ? "passive"
      : undefined;

    return yes ?? no ?? passive;
  }
}
