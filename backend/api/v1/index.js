import express from 'express'

import { router as Account } from './account.js'
import * as Database from './db.js'

const router = express.Router()
router.use('/account', Account)

router.post('/isalive', (req, res) => {
	res.json({isAlive: true})
})

export { router }