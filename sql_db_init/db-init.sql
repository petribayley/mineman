CREATE DATABASE IF NOT EXISTS mineman;

USE mineman;

CREATE TABLE USER
(
	id INT NOT NULL AUTO_INCREMENT,
	username TEXT NOT NULL,
	password TEXT NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE USER_SESSION
(
	uuid CHAR(36) NOT NULL,
	user_id INT NOT NULL,
	timeCreated DATE NOT NULL,
	PRIMARY KEY(uuid),
	FOREIGN KEY(user_id) REFERENCES USER(id)
);

INSERT INTO USER
(
	username,
	password
)
VALUES
(
	'admin',
	'admin'
) 