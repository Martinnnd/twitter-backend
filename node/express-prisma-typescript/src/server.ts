import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocs } from './swagger'
import { Constants, NodeEnv, Logger } from '@utils'
import { router } from './router'
import { ErrorHandling } from '@utils/errors'
import { createServer } from 'http'

export const app = express()
export const server = createServer(app)


// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')) // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()) // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()) // Parse cookies

app.use(
  cors({
    origin: Constants.CORS_WHITELIST,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use('/api', router)

app.use(ErrorHandling)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

import './utils/socket'

server.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`)
})
