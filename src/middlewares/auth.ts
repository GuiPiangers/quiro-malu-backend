import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

type JwtPayload = {
    id: string
}

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { authorization } = request.headers
        if (!authorization) throw new Error('Acesso não autorizado')

        const token = authorization.split(' ')[1]
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET)
        request.user = verifyToken as JwtPayload
        return next()

    } catch (err) {
        response.json({ message: err }).status(401)
    }


}