import { Request, Response, Router } from "express";
import { createUserController } from "./useCases/createUser";
import { loginUserController } from "./useCases/loginUser";
import { refreshTokenController } from "./useCases/refreshToken";
import { authMiddleware } from "./middlewares/auth";
import { getProfileController } from "./useCases/getUserProfile";

const router = Router()

router.post('/register', (request, response) => {
    createUserController.handle(request, response)
})
router.post('/login', (request, response) => {
    loginUserController.handle(request, response)
})
router.post('/refresh-token', authMiddleware, (request, response) => {
    refreshTokenController.handle(request, response)
})

router.get('/profile', authMiddleware, (request, response) => {
    getProfileController.handle(request, response)
})

export { router }