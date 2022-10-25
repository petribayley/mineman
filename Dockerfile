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

# Update APK
RUN \
	apk update && \
	apk add --no-cache python3 wget gpg gpg-agent libstdc++ nginx su-exec
# Download Node
RUN \
	mkdir -p mm_setup/node && \
	cd mm_setup/node && \
	wget https://unofficial-builds.nodejs.org/download/release/v${NODE_VERSION}/node-v${NODE_VERSION}-${DISTRO}-musl.tar.gz && \
	wget https://unofficial-builds.nodejs.org/download/release/v${NODE_VERSION}/SHASUMS256.txt && \
	grep node-v${NODE_VERSION}-${DISTRO}-musl.tar.gz SHASUMS256.txt | sha256sum -c -

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

COPY backend/nginx.conf /etc/nginx/nginx.conf
COPY backend/mineman_route.conf /etc/nginx/conf.d/mineman_route.conf
COPY backend/start_service.sh /start_service.sh
COPY backend/wait /wait
RUN chmod +x /wait

STOPSIGNAL SIGINT
CMD ["/bin/sh", "/start_service.sh"]