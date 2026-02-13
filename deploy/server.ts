import express from "express";
import cors from "cors";
import { RequestWithRawBody } from "./types/RequestWithRawBody";
import { RunDeployUseCase } from "./useCases/RunDeployUseCase";
import { ProductionDeployController } from "./controllers/ProductionDeployController";
import { ReleaseDeployController } from "./controllers/ReleaseDeployController";
import { isDeployInProgress } from "./state/deployState";

const app = express();

app.use(cors());

app.use(
  express.json({
    verify: (req, _, buf) => {
      (req as RequestWithRawBody).rawBody = buf;
    },
  }),
);

const PORT = process.env.PORT ?? 3333;

const runDeployUseCase = new RunDeployUseCase();
const productionDeployController = new ProductionDeployController(
  runDeployUseCase,
);
const releaseDeployController = new ReleaseDeployController(runDeployUseCase);

app.post("/deploy", (req, res) => {
  return productionDeployController.handle(req as RequestWithRawBody, res);
});

app.post("/deploy/release", (req, res) => {
  return releaseDeployController.handle(req as RequestWithRawBody, res);
});

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    deployInProgress: isDeployInProgress(),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`✅ Webhook server running on port ${PORT}`);
  console.log(`📝 Deploy endpoint: POST http://localhost:${PORT}/deploy`);
  console.log(
    `📝 Release deploy endpoint: POST http://localhost:${PORT}/deploy/release`,
  );
  console.log(`🏥 Health check: GET http://localhost:${PORT}/health`);
});
