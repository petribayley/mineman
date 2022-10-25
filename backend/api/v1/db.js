import * as mysql from 'mysql2/promise'

var database

async function initilaiseDatabase() {
	try {
		// Create Database
		database = await mysql.createConnection({
		  host     : process.env.MYSQL_HOST,
		  user     : process.env.MYSQL_USER,
		  password : process.env.MYSQL_PASSWORD,
		  database : process.env.MYSQL_DATABASE
		});
	}
	catch(err) {
		console.log(err)
	}
}

await initilaiseDatabase()

// Queries
const getUserQuery = `
	SELECT id, username, password
	FROM USER
	WHERE username = ?
`

const countUserQuery = `
	SELECT COUNT(username) as UserTotal
	FROM USER
`

const getSessionQuery = `
	SELECT u.username, us.timeCreated
	FROM USER_SESSION as us, USER as u
	WHERE uuid = ? AND u.id = us.user_id
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
		user_id,
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

export async function getUser(username) {
	const [rows, fields] = await database.execute(getUserQuery, [username])
	return rows
}

export async function insertUser(username, password) {
	const [rows, fields] = await database.execute(insertUserQuery, [username, password])
	return rows
}

export async function getUserCount() {
	const [rows, fields] = await database.execute(countUserQuery)
	return rows
}

export async function insertSession(username, uuid) {
	const [rows, fields] = await database.execute(insertSessionQuery, [username, uuid])
	return rows
}

export async function getSession(uuid) {
	const [rows, fields] = await database.execute(getSessionQuery, [uuid])
	return rows
}