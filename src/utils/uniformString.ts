export function uniformString(value: string) {
    return value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}