import 'express-async-errors'
import express from 'express'
import { router } from './router'

const app = express()

app.use(express.json())
app.use(router)

export { app }