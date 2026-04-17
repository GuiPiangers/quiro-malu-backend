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
import { subscribeNotificationController } from "./core/notification/controllers/subscribeNotification";
import { sendPushNotificationUseCase } from "./core/notification/useCases/sendPushNotification";
import { unsubscribeNotificationController } from "./core/notification/controllers/unsubscribeNotification";
import { sendNotificationController } from "./core/notification/controllers/sendNotification";
import { listNotificationsController } from "./core/notification/controllers/listNotification";
import { sendAndSaveNotificationUseCase } from "./core/notification/useCases/sendAndSaveNotification";
import { PushNotification } from "./core/notification/models/PushNotification";
import { createBeforeScheduleMessageController } from "./core/messages/controllers/createBeforeScheduleMessageController";
import { listBeforeScheduleMessagesController } from "./core/messages/controllers/listBeforeScheduleMessagesController";
import { getBeforeScheduleMessageController } from "./core/messages/controllers/getBeforeScheduleMessageController";
import { updateBeforeScheduleMessageController } from "./core/messages/controllers/updateBeforeScheduleMessageController";
import { deleteBeforeScheduleMessageController } from "./core/messages/controllers/deleteBeforeScheduleMessageController";
import { createAfterScheduleMessageController } from "./core/messages/controllers/createAfterScheduleMessageController";
import { listAfterScheduleMessagesController } from "./core/messages/controllers/listAfterScheduleMessagesController";
import { getAfterScheduleMessageController } from "./core/messages/controllers/getAfterScheduleMessageController";
import { updateAfterScheduleMessageController } from "./core/messages/controllers/updateAfterScheduleMessageController";
import { deleteAfterScheduleMessageController } from "./core/messages/controllers/deleteAfterScheduleMessageController";
import { createBirthdayMessageController } from "./core/messages/controllers/createBirthdayMessageController";
import { listBirthdayMessagesController } from "./core/messages/controllers/listBirthdayMessagesController";
import { updateBirthdayMessageController } from "./core/messages/controllers/updateBirthdayMessageController";
import { getBirthdayMessageController } from "./core/messages/controllers/getBirthdayMessageController";
import { deleteBirthdayMessageController } from "./core/messages/controllers/deleteBirthdayMessageController";
import { listWhatsAppMessageLogsController } from "./core/messages/controllers/listWhatsAppMessageLogsController";
import { listWhatsAppMessageLogsByPatientController } from "./core/messages/controllers/listWhatsAppMessageLogsByPatientController";
import { getWhatsAppMessageLogsSummaryController } from "./core/messages/controllers/getWhatsAppMessageLogsSummaryController";
import { NotificationSendMessage } from "./core/notification/models/NotificationSendMessage";
import { Phone } from "./core/shared/Phone";
import { setReadNotificationsController } from "./core/notification/controllers/setReadNotifications";
import { setActionDoneNotificationController } from "./core/notification/controllers/setActionDoneNotifications";
import { deleteManyNotificationsController } from "./core/notification/controllers/deleteManyNotification";
import { addBlockSchedulingController } from "./core/scheduling/controllers/addBlockScheduleController";
import { listBlockSchedulingController } from "./core/scheduling/controllers/ListBlockScheduleController";
import { listEventsController } from "./core/scheduling/controllers/ListEventsController";
import { editBlockScheduleController } from "./core/scheduling/controllers/editBlockScheduleController";
import { deleteBlockScheduleController } from "./core/scheduling/controllers/deleteBlockScheduleController";
import { listEventSuggestionsController } from "./core/scheduling/controllers/listEventSuggestionsController";
import { saveCalendarConfigurationController } from "./core/calendarConfiguration/controllers/SaveCalendarConfigurationController";
import { getCalendarConfigurationController } from "./core/calendarConfiguration/controllers/GetCalendarConfigurationController";
import { createTranscriptionController } from "./core/transcriptions/controllers/createTranscriptionController";
import { registerWhatsAppController } from "./core/whatsapp/controllers/registerWhatsAppController";
import { getWhatsAppQrCodeController } from "./core/whatsapp/controllers/getWhatsAppQrCodeController";
import { getWhatsAppStatusController } from "./core/whatsapp/controllers/getWhatsAppStatusController";
import { disconnectWhatsAppController } from "./core/whatsapp/controllers/disconnectWhatsAppController";
import { whatsAppWebhookController } from "./core/whatsapp/controllers/whatsappWebhookController";

const router = Router();
const multerConfig = multer({
  fileFilter: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8",
    );
    cb(null, true);
  },
});

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // limita o tamanho do áudio a 25MB
  },
});

router.post("/transcription", upload.single("audio"), (req, res) =>
  createTranscriptionController.handle(req, res),
);

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

router.post("/blockSchedules", authMiddleware, (request, response) => {
  addBlockSchedulingController.handle(request, response);
});
router.get("/blockSchedules", authMiddleware, (request, response) => {
  listBlockSchedulingController.handle(request, response);
});

router.patch("/blockSchedules/:id", authMiddleware, (request, response) => {
  editBlockScheduleController.handle(request, response);
});

router.delete("/blockSchedules/:id", authMiddleware, (request, response) => {
  deleteBlockScheduleController.handle(request, response);
});

router.get("/events", authMiddleware, (request, response) => {
  listEventsController.handle(request, response);
});

router.get("/event-suggestions", authMiddleware, (request, response) => {
  listEventSuggestionsController.handle(request, response);
});

router.put("/calendar-configuration", authMiddleware, (request, response) => {
  saveCalendarConfigurationController.handle(request, response);
});

router.get("/calendar-configuration", authMiddleware, (request, response) => {
  getCalendarConfigurationController.handle(request, response);
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

router.post(
  "/notifications/setRead",
  authMiddleware,
  async (request, response) => {
    return await setReadNotificationsController.handle(request, response);
  },
);

router.post(
  "/notifications/setActionDone",
  authMiddleware,
  async (request, response) => {
    return await setActionDoneNotificationController.handle(request, response);
  },
);

router.delete(
  "/notifications/deleteMany",
  authMiddleware,
  async (request, response) => {
    return await deleteManyNotificationsController.handle(request, response);
  },
);

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

    const notification = new NotificationSendMessage({
      message: "Mensagem que será enviada para o front-end",
      title: "Mensagem teste",
      params: {
        patientId: "18dac10e-97be-403e-a716-b9ed10b0f58e",
        patientPhone: new Phone("(51) 98035 1927"),
        templateMessage: "Mensagem teste *Negrito*\nLinha nova",
      },
    });

    await sendAndSaveNotificationUseCase.execute({ userId, notification });

    await sendPushNotificationUseCase.execute({ notificationData, userId });

    res.json({ success: true });
  } catch (error: any) {
    res.send({ message: error.message });
  }
});

router.post("/beforeScheduleMessages", authMiddleware, async (request, response) => {
  return await createBeforeScheduleMessageController.handle(request, response);
});

router.get("/beforeScheduleMessages", authMiddleware, async (request, response) => {
  return await listBeforeScheduleMessagesController.handle(request, response);
});

router.get("/beforeScheduleMessages/:id", authMiddleware, async (request, response) => {
  return await getBeforeScheduleMessageController.handle(request, response);
});

router.patch("/beforeScheduleMessages/:id", authMiddleware, async (request, response) => {
  return await updateBeforeScheduleMessageController.handle(request, response);
});

router.delete("/beforeScheduleMessages/:id", authMiddleware, async (request, response) => {
  return await deleteBeforeScheduleMessageController.handle(request, response);
});

router.post("/afterScheduleMessages", authMiddleware, async (request, response) => {
  return await createAfterScheduleMessageController.handle(request, response);
});

router.get("/afterScheduleMessages", authMiddleware, async (request, response) => {
  return await listAfterScheduleMessagesController.handle(request, response);
});

router.get("/afterScheduleMessages/:id", authMiddleware, async (request, response) => {
  return await getAfterScheduleMessageController.handle(request, response);
});

router.patch("/afterScheduleMessages/:id", authMiddleware, async (request, response) => {
  return await updateAfterScheduleMessageController.handle(request, response);
});

router.delete("/afterScheduleMessages/:id", authMiddleware, async (request, response) => {
  return await deleteAfterScheduleMessageController.handle(request, response);
});

router.post("/birthdayMessages", authMiddleware, async (request, response) => {
  return await createBirthdayMessageController.handle(request, response);
});

router.get("/birthdayMessages", authMiddleware, async (request, response) => {
  return await listBirthdayMessagesController.handle(request, response);
});

router.get("/birthdayMessages/:id", authMiddleware, async (request, response) => {
  return await getBirthdayMessageController.handle(request, response);
});

router.patch("/birthdayMessages/:id", authMiddleware, async (request, response) => {
  return await updateBirthdayMessageController.handle(request, response);
});

router.delete("/birthdayMessages/:id", authMiddleware, async (request, response) => {
  return await deleteBirthdayMessageController.handle(request, response);
});

router.get("/messages/logs/summary", authMiddleware, async (request, response) => {
  return await getWhatsAppMessageLogsSummaryController.handle(request, response);
});

router.get(
  "/messages/logs/patient/:patientId",
  authMiddleware,
  async (request, response) => {
    return await listWhatsAppMessageLogsByPatientController.handle(
      request,
      response,
    );
  },
);

router.get("/messages/logs", authMiddleware, async (request, response) => {
  return await listWhatsAppMessageLogsController.handle(request, response);
});

router.post("/whatsapp/register", authMiddleware, async (request, response) => {
  return await registerWhatsAppController.handle(request, response);
});

router.get("/whatsapp/qrcode", authMiddleware, async (request, response) => {
  return await getWhatsAppQrCodeController.handle(request, response);
});

router.get("/whatsapp/status", authMiddleware, async (request, response) => {
  return await getWhatsAppStatusController.handle(request, response);
});

router.delete("/whatsapp/disconnect", authMiddleware, async (request, response) => {
  return await disconnectWhatsAppController.handle(request, response);
});

router.post("/webhooks/whatsapp", async (request, response) => {
  return await whatsAppWebhookController.handle(request, response);
});

export { router };
