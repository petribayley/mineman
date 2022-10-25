import express from 'express'
import * as Crypto from 'crypto'
import * as Database from './db.js'

const router = express.Router()
router.post('/login', async (req, res, next) => {
	
	// Get data from request
	const username = req.body.username
	const password = req.body.password

	const user = await Database.getUser(username)
	if(user === undefined) { 
		res.status(500).json(JSON.stringify({data: 'Internal Server Error', success: false}))
		console.log(user)
		return
	}
	if(user[0].password === password) {

		var cookieUUID = Crypto.randomUUID().toString();

		var insertSession = Database.insertSession(user[0].id, cookieUUID)

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

router.post('/session', async (req, res) => {
	// Get data from request
	const cookieUUID = req.body.cookieUUID

	var checkSession = await Database.getSession(cookieUUID)
	console.log(checkSession)
	if(checkSession === undefined) {
		rres.status(500).json(JSON.stringify({data: 'Internal Server Error', success: false}))
		return
	}
	if(checkSession.length > 0) {
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