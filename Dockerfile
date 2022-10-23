FROM alpine:3.16 as base
EXPOSE 80

# Environment Variables
ENV NODE_VERSION 19.0.0
ENV DISTRO linux-x64

# Node Users
RUN \
	addgroup -g 1000 node && \
    adduser -u 1000 -G node -s /bin/sh -D node
# Nginx user
RUN \
	addgroup -g 101 -S nginx && \
	adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx
# PostgresSQL user
RUN \
	addgroup -g 70 -S postgres && \
	adduser -u 70 -S -D -G postgres -H -h /var/lib/postgresql -s /bin/sh postgres && \
	mkdir -p /var/lib/postgresql && \
	chown -R postgres:postgres /var/lib/postgresql

# Update APK
RUN \
	apk update && \
	apk add --no-cache python3 gcc g++ make wget linux-headers gpg gpg-agent libstdc++ postgresql nginx su-exec

# Download Node
RUN \
	mkdir -p mm_setup/node && \
	cd mm_setup/node && \
	wget https://unofficial-builds.nodejs.org/download/release/v${NODE_VERSION}/node-v${NODE_VERSION}-${DISTRO}-musl.tar.gz && \
	wget https://unofficial-builds.nodejs.org/download/release/v${NODE_VERSION}/SHASUMS256.txt && \
	grep node-v${NODE_VERSION}-${DISTRO}-musl.tar.gz SHASUMS256.txt | sha256sum -c -

# Setup PostgreSQL
VOLUME /var/lib/postgresql/data
RUN \
	mkdir /run/postgresql && \
	chown -R postgres:postgres /run/postgresql
USER postgres
RUN initdb -D /var/lib/postgresql/data
USER root

# Setup Node
FROM base as base-node
RUN \
	cd mm_setup/node && \
	tar -xvf node-v${NODE_VERSION}-${DISTRO}-musl.tar.gz -C /usr/local --strip-components=1 --no-same-owner && \
	ln -s /usr/local/bin/node /usr/local/bin/nodejs && \
	mkdir -p /root/.npm && \
	chown -R 1000:1000 /root/.npm

# Build react client
FROM base-node as base-react
RUN mkdir -p /home/node/react-app
RUN mkdir -p /var/www/ && chown nginx:nginx /var/www
WORKDIR /home/node/react-app
COPY frontend/. .
RUN npm ci
RUN npm run build
RUN cp -R build/* /var/www/
RUN chown -R nginx:nginx /var/www
WORKDIR /

# Build backend 
FROM base-react as base-backend
RUN mkdir -p /srv/app && chown -R node:node /srv/app
USER node
WORKDIR /srv/app
COPY --chown=<node>:<node> backend/. .
RUN npm ci
USER root
WORKDIR /

COPY nginx.conf /etc/nginx/nginx.conf
COPY mineman_route.conf /etc/nginx/conf.d/mineman_route.conf
COPY ./start_service.sh /start_service.sh
CMD ["/bin/sh", "/start_service.sh"]