import { Response } from "express";

export const responseError = (response: Response, err: any) => {
    const statusCode = err.statusCode ?? 500
    return response.status(statusCode).json({
        message: err.message || 'Unexpected error.',
        statusCode: statusCode,
        type: err.type,
        error: true
    })
}