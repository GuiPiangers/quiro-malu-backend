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
import { setProgressController } from "./core/patients/controllers/progress/setProgressController";
import { getProgressController } from "./core/patients/controllers/progress/getProgressController";
import { listProgressController } from "./core/patients/controllers/progress/listProgressController";
import { deleteProgressController } from "./core/patients/controllers/progress/deleteProgressController";
import { listServiceController } from "./core/service/controllers/listServicesController";
import { getServiceController } from "./core/service/controllers/getServiceController";
import { createServiceController } from "./core/service/controllers/createServiceController";
import { deleteServiceController } from "./core/service/controllers/deleteServiceController";
import { updateServiceController } from "./core/service/controllers/updateServiceController";
import { listSchedulingController } from "./core/scheduling/controllers/listSchedulingController";
import { getSchedulingController } from "./core/scheduling/controllers/getSchedulingController";
import { createSchedulingController } from "./core/scheduling/controllers/createSchedulingController";
import { updateSchedulingController } from "./core/scheduling/controllers/updateSchedulingController";
import { deleteSchedulingController } from "./core/scheduling/controllers/deleteServiceController";
import { qtdSchedulesController } from "./core/scheduling/controllers/getQtdSchedulesByDayController";

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


router.get('/services', authMiddleware, (request, response) => {
    listServiceController.handle(request, response)
})
router.get('/services/:id', authMiddleware, (request, response) => {
    getServiceController.handle(request, response)
})
router.post('/services', authMiddleware, (request, response) => {
    createServiceController.handle(request, response)
})
router.patch('/services', authMiddleware, (request, response) => {
    updateServiceController.handle(request, response)
})
router.delete('/services', authMiddleware, (request, response) => {
    deleteServiceController.handle(request, response)
})

router.get('/schedules', authMiddleware, (request, response) => {
    listSchedulingController.handle(request, response)
})
router.get('/schedules/qtd', authMiddleware, (request, response) => {
    qtdSchedulesController.handle(request, response)
})
router.get('/schedules/:patientId/:id', authMiddleware, (request, response) => {
    getSchedulingController.handle(request, response)
})
router.post('/schedules', authMiddleware, (request, response) => {
    createSchedulingController.handle(request, response)
})
router.patch('/schedules', authMiddleware, (request, response) => {
    updateSchedulingController.handle(request, response)
})
router.delete('/schedules', authMiddleware, (request, response) => {
    deleteSchedulingController.handle(request, response)
})

export { router }