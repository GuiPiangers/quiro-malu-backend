import { Router } from "express";
import { createUserController } from "./core/authentication/controllers/createUserController";
import { loginUserController } from "./core/authentication/controllers/loginUserController";
import { refreshTokenController } from "./core/authentication/controllers/refreshTokenController";
import { authMiddleware } from "./middlewares/auth";
import { getUserProfileController } from "./core/authentication/controllers/getUserProfile";
import { createPatientController } from "./core/patients/controllers/createPatientController";
import { listPatientsController } from "./core/patients/controllers/listPatientsController";
import { getPatientController } from "./core/patients/controllers/getPatientController";
import { updatePatientController } from "./core/patients/controllers/updatePatientContoller";

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
    getUserProfileController.handle(request, response)
})

router.post('/patients', authMiddleware, (request, response) => {
    createPatientController.handle(request, response)
})
router.get('/patients', authMiddleware, (request, response) => {
    listPatientsController.handle(request, response)
})
router.post('/patient', authMiddleware, (request, response) => {
    getPatientController.handle(request, response)
})
router.patch('/patient', authMiddleware, (request, response) => {
    updatePatientController.handle(request, response)
})

export { router }