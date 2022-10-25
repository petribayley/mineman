#!/bin/sh
./wait &&
	nginx &&
	cd /srv/app &&
	su-exec node npm start