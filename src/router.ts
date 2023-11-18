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
import { logoutController } from "./core/authentication/controllers/logout";
import { deletePatientController } from "./core/patients/controllers/deletePatientsController";
import { setAnamnesisController } from "./core/patients/controllers/setAnamnesisController";
import { setDiagnosticController } from "./core/patients/controllers/setDiagnosticController";
import { getDiagnosticController } from "./core/patients/controllers/getDiagnosticController";
import { getAnamnesisController } from "./core/patients/controllers/getAnamnesisController";
import { setProgressController } from "./core/patients/controllers/setProgressController";
import { getProgressController } from "./core/patients/controllers/getProgressController";
import { listProgressController } from "./core/patients/controllers/listProgressController";
import { deleteProgressController } from "./core/patients/controllers/deleteProgressController";

const router = Router()

router.post('/register', (request, response) => {
    createUserController.handle(request, response)
})
router.post('/login', (request, response) => {
    loginUserController.handle(request, response)
})
router.post('/logout', (request, response) => {
    logoutController.handle(request, response)
})
router.post('/refresh-token', (request, response) => {
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
router.get('/patients/:id', authMiddleware, (request, response) => {
    getPatientController.handle(request, response)
})
router.patch('/patients', authMiddleware, (request, response) => {
    updatePatientController.handle(request, response)
})
router.delete('/patients', authMiddleware, (request, response) => {
    deletePatientController.handle(request, response)
})

router.get('/patients/anamnesis/:patientId', authMiddleware, (request, response) => {
    getAnamnesisController.handle(request, response)
})
router.put('/patients/anamnesis', authMiddleware, (request, response) => {
    setAnamnesisController.handle(request, response)
})

router.get('/patients/diagnostic/:patientId', authMiddleware, (request, response) => {
    getDiagnosticController.handle(request, response)
})
router.put('/patients/diagnostic', authMiddleware, (request, response) => {
    setDiagnosticController.handle(request, response)
})

router.put('/patients/progress', authMiddleware, (request, response) => {
    setProgressController.handle(request, response)
})
router.delete('/patients/progress', authMiddleware, (request, response) => {
    deleteProgressController.handle(request, response)
})

router.get('/patients/progress/:patientId', authMiddleware, (request, response) => {
    listProgressController.handle(request, response)
})
router.get('/patients/progress/:patientId/:id', authMiddleware, (request, response) => {
    getProgressController.handle(request, response)
})

export { router }