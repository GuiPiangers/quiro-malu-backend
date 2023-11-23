import { ApiError } from "../../utils/ApiError";

type DateTimeConfig = {
    onlyPassDate?: boolean
    onlyFutureDate?: boolean
}

export class DateTime {
    constructor(readonly value: string, { onlyPassDate, onlyFutureDate }: DateTimeConfig = {}) {
        if (!this.isValidDate(value)) throw new ApiError('A data informada não é válida', 400, 'date')
        const date = new Date(value)
        const now = new Date()

        if (onlyPassDate && !onlyFutureDate) {
            if (date > now) throw new ApiError('A data informada precisa ser anterior a data atual', 400, 'date')
        }
        if (onlyFutureDate && !onlyPassDate) {
            if (date < now) throw new ApiError('A data informada precisa ser posterior a data atual', 400, 'date')
        }

        const dateValue = date.toLocaleDateString().split('/').reverse().join('-').substring(0, 10)
        const timeValue = date.toLocaleTimeString().substring(0, 5)

        this.value = `${dateValue}T${timeValue}`
    }

    private isValidDate(dateString: string) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    get date() {
        return this.value.substring(0, 10)
    }

    get time() {
        return this.value.substring(11, 5)
    }
}