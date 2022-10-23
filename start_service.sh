#!/bin/sh
su-exec postgres pg_ctl start -D /var/lib/postgresql/data; 
nginx; 
cd /srv/app; 
su-exec node npm start