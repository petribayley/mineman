import express from 'express'

import { router as Account } from './account.js'
import * as Database from './db.js'

// Initialise database with default user options
var userCount = Database.getUserCount()
if(userCount.data.UserTotal === 0) {
	console.log('Filling database with default admin credentials')
	Database.insertUser('admin', 'admin')
}

const router = express.Router()
router.use('/account', Account)

router.post('/isalive', (req, res) => {
	res.json({isAlive: true})
})

export { router }