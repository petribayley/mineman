import Database from 'better-sqlite3';

var database

function initilaiseDatabase() {
	try {
		// Create Database
		database = new Database('mineman_database')
		const createUserTable = database.prepare(`
			CREATE TABLE IF NOT EXISTS USER
			(
			username TEXT NOT NULL,
			password TEXT NOT NULL,
			PRIMARY KEY(username)
			)
		`)
		const createUserSessionTable = database.prepare(`
			CREATE TABLE IF NOT EXISTS USER_SESSION
			(
			uuid TEXT NOT NULL,
			username TEXT NOT NULL,
			timeCreated DATE NOT NULL,
			PRIMARY KEY(uuid),
			FOREIGN KEY(username) REFERENCES USER(username)
			)
		`)
		createUserTable.run()
		createUserSessionTable.run()
		}
	catch(err) {
		console.log(err)
	}
}

initilaiseDatabase()

// Queries
const getUserQuery = database.prepare(`
	SELECT username, password
	FROM USER
	WHERE username = ?
`)

const countUserQuery = database.prepare(`
	SELECT COUNT(username) as UserTotal
	FROM USER
`)

const getSessionQuery = database.prepare(`
	SELECT username, timeCreated
	FROM USER_SESSION
	WHERE uuid = ?
`)

const insertUserQuery = database.prepare(`
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
`)

const insertSessionQuery = database.prepare(`
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
`)

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