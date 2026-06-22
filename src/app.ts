/* eslint-disable no-restricted-syntax */
import 'express-async-errors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { generateOpenApiDocument } from './docs/swagger'
import {
  expressJsonVerifyStripUtf8Bom,
  parseAuthRoutesJsonBody,
  shouldExpressJsonParse,
} from './middlewares/authJsonBody'
import { requestLoggerMiddleware } from './middlewares/requestLogger'
import { router } from './router'
import cors from 'cors'
import { httpRequestDurationMiddleware } from './metrics/httpRequestDuration'
import { register } from './metrics'
import { httpRequestCounterMiddleware } from './metrics/requestCounter'
import { mongoConnect } from './database/mongoose'
import { httpRequestsInProgressMiddleware } from './metrics/httpRequestsInProgress'
import { httpResponseSizeMiddleware } from './metrics/httpResponseSize'
import { httpErrorsCounterMiddleware } from './metrics/httpErrorsCounter'

const app = express()

const openApiDocument = generateOpenApiDocument()

app.use(
  express.json({
    type: shouldExpressJsonParse,
    verify: expressJsonVerifyStripUtf8Bom,
  }),
)
app.use(parseAuthRoutesJsonBody)

app.use(requestLoggerMiddleware)

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PATCH,PUT,DELETE',
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Request-With, Content-Type, Accept, Authorization',
  )

  app.use(cors())
  next()
})

app.use(httpRequestsInProgressMiddleware)
app.use(httpRequestDurationMiddleware)
app.use(httpRequestCounterMiddleware)
app.use(httpErrorsCounterMiddleware)
app.use(httpResponseSizeMiddleware)

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/openapi.json', (_req, res) => {
  res.json(openApiDocument)
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))

app.get('/debug/ip', (req, res) => {
  res.json({
    'req.ip': req.ip,
    'req.socket.remoteAddress': req.socket?.remoteAddress,
    'cf-connecting-ip': req.headers['cf-connecting-ip'],
    'x-forwarded-for': req.headers['x-forwarded-for'],
    'x-real-ip': req.headers['x-real-ip'],
  })
})

app.use(router)

mongoConnect()

export { app }
