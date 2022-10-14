import express              from 'express'
import helmet               from 'helmet'
import morgan               from 'morgan'
import bodyParser           from 'body-parser'
import cors                 from 'cors'

import { router as v1 } from './api/v1/index.js'

const API_VERSION = '1.0.0'

const app = express()
app.use(
    helmet()
    )
app.use(
    bodyParser.json()
    )
app.use(
    cors()
    )

app.use('/api/v1', v1)

const server = app.listen(process.env.NODE_PORT || 3001, () => {
  console.log('Listening on port ' + server.address().port)
})