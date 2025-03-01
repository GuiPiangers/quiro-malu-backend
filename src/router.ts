import { Router } from "express";
import { createUserController } from "./core/authentication/controllers/createUserController";
import { loginUserController } from "./core/authentication/controllers/loginUserController";
import { refreshTokenController } from "./core/authentication/controllers/refreshTokenController";
import { authMiddleware } from "./middlewares/auth";
import { getUserProfileController } from "./core/authentication/controllers/getUserProfile";
import { createPatientController } from "./core/patients/controllers/createPatientController";
import { listPatientsController } from "./core/patients/controllers/listPatientsController";
import { getPatientController } from "./core/patients/controllers/getPatientController";
import { updatePatientController } from "./core/patients/controllers/updatePatientController";
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
import { deleteSchedulingController } from "./core/scheduling/controllers/deleteSchedulingController";
import { qtdSchedulesController } from "./core/scheduling/controllers/getQtdSchedulesByDayController";
import { realizeSchedulingController } from "./core/scheduling/controllers/realizeSchedulingController";
import multer from "multer";
import { getProgressBySchedulingController } from "./core/patients/controllers/progress/getProgressBySchedulingController";
import { uploadPatientsController } from "./core/patients/controllers/uploadPatientsController";
import { setFinanceController } from "./core/finances/controllers/setFinanceController";
import { getFinanceController } from "./core/finances/controllers/getFinanceController";
import { listFinanceController } from "./core/finances/controllers/listFinancesController";
import { updateFinanceController } from "./core/finances/controllers/updateFinanceController";
import { deleteFinanceController } from "./core/finances/controllers/deleteFinanceController";
import { getFinanceBySchedulingController } from "./core/finances/controllers/getFinanceBySchedulingController";
import { saveExamController } from "./core/exams/controllers/saveExamController";
import { deleteExamController } from "./core/exams/controllers/deleteExamController";
import { listExamController } from "./core/exams/controllers/listExamController";
import { restoreExamController } from "./core/exams/controllers/restoreExamController";
import { Notification } from "./core/notification/models/Notification";
import { subscribeNotificationController } from "./core/notification/controllers/subscribeNotification";
import { sendPushNotificationUseCase } from "./core/notification/useCases/sendPushNotification";
import { unsubscribeNotificationController } from "./core/notification/controllers/unsubscribeNotification";
import { sendNotificationController } from "./core/notification/controllers/sendNotification";
import { listNotificationsController } from "./core/notification/controllers/listNotification";
import { sendAndSaveNotificationUseCase } from "./core/notification/useCases/sendAndSaveNotification";
import { PushNotification } from "./core/notification/models/PushNotification";
import { createMessageCampaignController } from "./core/messageCampaign/controller/createMessageCampaign";

const router = Router();
const multerConfig = multer({
  fileFilter: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8",
    );
    cb(null, true);
  },
});

router.post("/register", (request, response) => {
  createUserController.handle(request, response);
});
router.post("/login", (request, response) => {
  loginUserController.handle(request, response);
});
router.post("/logout", (request, response) => {
  logoutController.handle(request, response);
});
router.post("/refresh-token", (request, response) => {
  refreshTokenController.handle(request, response);
});
router.get("/profile", authMiddleware, (request, response) => {
  getUserProfileController.handle(request, response);
});

router.post("/patients", authMiddleware, (request, response) => {
  createPatientController.handle(request, response);
});
router.get("/patients", authMiddleware, (request, response) => {
  listPatientsController.handle(request, response);
});
router.get("/patients/:id", authMiddleware, (request, response) => {
  getPatientController.handle(request, response);
});
router.patch("/patients", authMiddleware, (request, response) => {
  updatePatientController.handle(request, response);
});
router.delete("/patients", authMiddleware, (request, response) => {
  deletePatientController.handle(request, response);
});

router.get(
  "/patients/anamnesis/:patientId",
  authMiddleware,
  (request, response) => {
    getAnamnesisController.handle(request, response);
  },
);
router.put("/patients/anamnesis", authMiddleware, (request, response) => {
  setAnamnesisController.handle(request, response);
});

router.get(
  "/patients/diagnostic/:patientId",
  authMiddleware,
  (request, response) => {
    getDiagnosticController.handle(request, response);
  },
);
router.put("/patients/diagnostic", authMiddleware, (request, response) => {
  setDiagnosticController.handle(request, response);
});

router.put("/patients/progress", authMiddleware, (request, response) => {
  setProgressController.handle(request, response);
});
router.delete("/patients/progress", authMiddleware, (request, response) => {
  deleteProgressController.handle(request, response);
});

router.get(
  "/patients/progress/:patientId",
  authMiddleware,
  (request, response) => {
    listProgressController.handle(request, response);
  },
);
router.get(
  "/patients/progress/:patientId/:id",
  authMiddleware,
  (request, response) => {
    getProgressController.handle(request, response);
  },
);
router.get(
  "/patients/progress/scheduling/:patientId/:schedulingId",
  authMiddleware,
  (request, response) => {
    getProgressBySchedulingController.handle(request, response);
  },
);

router.get("/services", authMiddleware, (request, response) => {
  listServiceController.handle(request, response);
});
router.get("/services/:id", authMiddleware, (request, response) => {
  getServiceController.handle(request, response);
});
router.post("/services", authMiddleware, (request, response) => {
  createServiceController.handle(request, response);
});
router.patch("/services", authMiddleware, (request, response) => {
  updateServiceController.handle(request, response);
});
router.delete("/services", authMiddleware, (request, response) => {
  deleteServiceController.handle(request, response);
});

router.get("/schedules", authMiddleware, (request, response) => {
  listSchedulingController.handle(request, response);
});
router.get("/schedules/qtd", authMiddleware, (request, response) => {
  qtdSchedulesController.handle(request, response);
});
router.get("/schedules/:id", authMiddleware, (request, response) => {
  getSchedulingController.handle(request, response);
});
router.post("/schedules", authMiddleware, (request, response) => {
  createSchedulingController.handle(request, response);
});
router.patch("/schedules", authMiddleware, (request, response) => {
  updateSchedulingController.handle(request, response);
});
router.post("/realizeScheduling", authMiddleware, (request, response) => {
  realizeSchedulingController.handle(request, response);
});
router.delete("/schedules", authMiddleware, (request, response) => {
  deleteSchedulingController.handle(request, response);
});

router.post(
  "/uploadPatients",
  authMiddleware,
  multerConfig.single("file"),
  (request, response) => {
    uploadPatientsController.handle(request, response);
  },
);

router.post("/finance", authMiddleware, (request, response) => {
  setFinanceController.handle(request, response);
});
router.get("/finance/:id", authMiddleware, (request, response) => {
  getFinanceController.handle(request, response);
});
router.get("/finance", authMiddleware, (request, response) => {
  listFinanceController.handle(request, response);
});
router.get(
  "/finance/scheduling/:schedulingId",
  authMiddleware,
  (request, response) => {
    getFinanceBySchedulingController.handle(request, response);
  },
);
router.patch("/finance", authMiddleware, (request, response) => {
  updateFinanceController.handle(request, response);
});
router.delete("/finance", authMiddleware, (request, response) => {
  deleteFinanceController.handle(request, response);
});

router.post(
  "/exams/:patientId",
  authMiddleware,
  multerConfig.single("file"),
  (request, response) => {
    saveExamController.handle(request, response);
  },
);

router.delete("/exams/:patientId/:id", authMiddleware, (request, response) => {
  deleteExamController.handle(request, response);
});

router.post("/exams/:patientId/:id", authMiddleware, (request, response) => {
  restoreExamController.handle(request, response);
});
router.get("/exams/:patientId", authMiddleware, (request, response) => {
  listExamController.handle(request, response);
});

router.post("/subscribe", authMiddleware, async (request, response) => {
  return await subscribeNotificationController.handle(request, response);
});

router.post("/unsubscribe", authMiddleware, async (request, response) => {
  return await unsubscribeNotificationController.handle(request, response);
});

router.get("/notifications", authMiddleware, async (request, response) => {
  return await listNotificationsController.handle(request, response);
});

router.get(
  "/notifications/connect",
  authMiddleware,
  async (request, response) => {
    return await sendNotificationController.handle(request, response);
  },
);

router.post("/notify", authMiddleware, async (req, res) => {
  try {
    const { title, message } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.send({ message: "O usuário deve estar logado" });

    const notificationData = new PushNotification({
      title,
      type: "type",
      message,
    });

    const notification = new Notification({
      message: "Mensagem que será enviada para o front-end",
      title: "Mensagem teste",
      type: "default",
    });

    await sendAndSaveNotificationUseCase.execute({ userId, notification });

    await sendPushNotificationUseCase.execute({ notificationData, userId });

    res.json({ success: true });
  } catch (error: any) {
    res.send({ message: error.message });
  }
});

router.post("/messageCampaigns", authMiddleware, async (request, response) => {
  return await createMessageCampaignController.handle(request, response);
});

export { router };
