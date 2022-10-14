import express from 'express'
import * as Crypto from 'crypto'
import * as Database from './db.js'

const router = express.Router()
router.post('/login', (req, res, next) => {
	
	// Get data from request
	const username = req.body.username
	const password = req.body.password

	const user = Database.getUser(username)
	if(user.success === false) { 
		res.status(500).json(JSON.stringify({data: 'Internal Server Error', success: false}))
		console.log(user)
		return
	}

	if(user.data !== undefined && user.data.password === password) {

		var cookieUUID = Crypto.randomUUID().toString();

		var insertSession = Database.insertSession(username, cookieUUID)

		if(insertSession.success === false) {
			res.status(500).json(JSON.stringify({data: 'Internal Server Error', success: false}))
			console.log(insertSession)
			return
		}

		res.json(JSON.stringify(
			{
				data: {cookieUUID: cookieUUID},
				success: true
			}
		))
		return
	}

	res.status(401).json(JSON.stringify(
		{
			data: 'Incorrect Password',
			success: false
		}
	))
})

router.post('/session', (req, res) => {
	// Get data from request
	const cookieUUID = req.body.cookieUUID

	var checkSession = Database.getSession(cookieUUID)
	if(checkSession.success === false) {
		rres.status(500).json(JSON.stringify({data: 'Internal Server Error', success: false}))
		console.log(checkSession)
		return
	}
	if(checkSession.data !== undefined) {
		res.json(JSON.stringify(
			{
				data: {cookieUUID: cookieUUID, valid: true},
				success: true
			}
		))
		return
	}

	res.status(401).json(JSON.stringify(
	{
		data: 'Session Invalid',
		success: false
	}
	))
})

export { router }