import * as pg from 'pg'

const { Pool } = pg.default

var database

function initilaiseDatabase() {
	try {
		// Create Database
		database = new Pool({
		  host: '127.0.0.1',
		  port: 5432,
		  user: 'node',
		  password: '',
		})
		database.connect()
		const createUserTable = database.query(`
			CREATE TABLE IF NOT EXISTS USER
			(
			username TEXT NOT NULL,
			password TEXT NOT NULL,
			PRIMARY KEY(username)
			)
		`)
		const createUserSessionTable = database.query(`
			CREATE TABLE IF NOT EXISTS USER_SESSION
			(
			uuid TEXT NOT NULL,
			username TEXT NOT NULL,
			timeCreated DATE NOT NULL,
			PRIMARY KEY(uuid),
			FOREIGN KEY(username) REFERENCES USER(username)
			)
		`)
		}
	catch(err) {
		console.log(err)
	}
}

initilaiseDatabase()

// Queries
const getUserQuery = `
	SELECT username, password
	FROM USER
	WHERE username = ?
`

const countUserQuery = `
	SELECT COUNT(username) as UserTotal
	FROM USER
`

const getSessionQuery = `
	SELECT username, timeCreated
	FROM USER_SESSION
	WHERE uuid = ?
`

const insertUserQuery = `
	INSERT INTO USER
	(
		username,
		password
	)
	VALUES
	(
		?,
		?
	)
`

const insertSessionQuery = `
	INSERT INTO USER_SESSION
	(
		username,
		uuid,
		timeCreated
	)
	VALUES
	(
		?,
		?,
		CURRENT_TIMESTAMP
	)
`

function getQuery(query, ...args) {
	var ret
	try {
		ret = query.get(...args)
	}
	catch(err) {
		return {data: err.message, success: false, query: query}
	}
	return {data: ret, success: true}
}

function runQuery(query, ...args) {
	var ret
	try {
		ret = query.run(...args)
	}
	catch(err) {
		return {data: err.message, success: false, query: query}
	}
	return {data: ret, success: true}
}

export function getUser(username) {
	return getQuery(getUserQuery, username)
}

export function insertUser(username, password) {
	return runQuery(insertUserQuery, username, password)
}

export function getUserCount() {
	return getQuery(countUserQuery)
}

export function insertSession(username, uuid) {
	return runQuery(insertSessionQuery, username, uuid)
}

export function getSession(uuid) {
	return getQuery(getSessionQuery, uuid)
}