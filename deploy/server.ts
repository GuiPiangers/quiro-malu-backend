import express, { Request, Response } from "express";
import cors from "cors";
import { verifySignature } from "./utils/verifySignature";
import { runDeploy } from "./utils/runDeploy";
import path from "path";

const app = express();

interface RequestWithRawBody extends Request {
    rawBody: Buffer;
}

app.use(cors());

app.use(express.json({
    verify: (req: any, _, buf) => {
        req.rawBody = buf;
    }
}));

const PORT = process.env.PORT ?? 3333;

let deployInProgress = false;

app.post('/deploy', async (req: Request, res: Response) => {
    const request = req as RequestWithRawBody;
    
    if (!request.rawBody) {
        return res.status(400).json({ error: 'Raw body missing' });
    }

    const signature = request.header('X-Deploy-Signature');
    const valid = verifySignature(
        request.rawBody,
        signature,
        process.env.DEPLOY_SECRET!
    );

    if (!valid) {
        console.error('[SECURITY] Invalid signature attempt');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const { image, tag, services, composeFile } = request.body;

    if (!image || !tag || !services || !composeFile) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['image', 'tag', 'services', 'composeFile']
        });
    }

    if (!Array.isArray(services) || services.length === 0) {
        return res.status(400).json({ error: 'services must be a non-empty array' });
    }

    const imageRegex = /^[a-zA-Z0-9\/_-]+$/;
    const tagRegex = /^[a-zA-Z0-9\._-]+$/;
    const serviceRegex = /^[a-zA-Z0-9_-]+$/;

    if (!imageRegex.test(image)) {
        return res.status(400).json({ error: 'Invalid image name format' });
    }

    if (!tagRegex.test(tag)) {
        return res.status(400).json({ error: 'Invalid tag format' });
    }

    if (services.some((svc: string) => !serviceRegex.test(svc))) {
        return res.status(400).json({ error: 'Invalid service name format' });
    }

    const normalizedPath = path.normalize(composeFile);
    if (normalizedPath.includes('..') || !normalizedPath.startsWith('/')) {
        return res.status(400).json({ error: 'Invalid compose file path' });
    }

    if (deployInProgress) {
        return res.status(409).json({ 
            error: 'Deploy already in progress',
            message: 'Please wait for the current deployment to finish'
        });
    }

    console.log('[DEPLOY] Starting deployment:', {
        image,
        tag,
        services,
        composeFile,
        timestamp: new Date().toISOString()
    });

    deployInProgress = true;

    res.status(202).json({ 
        message: 'Deploy accepted and started',
        image: `${image}:${tag}`,
        services
    });

    runDeploy(
        { image, tag, services, composeFile },
        {
            onError: (err) => {
                console.error('[DEPLOY] Failed:', err.message);
                deployInProgress = false;
            },
            onSuccess: (stdout) => {
                console.log('[DEPLOY] Success:', stdout);
                deployInProgress = false;
            }
        }
    );
});

app.get('/health', (_, res) => {
    res.json({ 
        status: 'ok',
        deployInProgress,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`✅ Webhook server running on port ${PORT}`);
    console.log(`📝 Deploy endpoint: POST http://localhost:${PORT}/deploy`);
    console.log(`🏥 Health check: GET http://localhost:${PORT}/health`);
});