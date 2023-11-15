export class ApiError extends Error {
    public readonly statusCode: number
    public readonly type: string | undefined

    constructor(message: string, statusCode?: number, type?: string) {
        super(message)
        this.statusCode = statusCode || 400
        this.type = type
    }
} 