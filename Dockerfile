# Setup env
FROM alpine:3.16.2 as base
# Update APK
RUN apk update
RUN apk add python3 py3-pip gcc g++ make wget linux-headers
RUN wget https://nodejs.org/dist/v19.0.0/node-v19.0.0-linux-x64.tar.xz

FROM base as base-node
# Setup Node
RUN mkdir -p /usr/local/lib/nodejs /usr/local/include\
	VERSION=v19.0.0\
	DISTRO=linux-x64
RUN tar -xJvf node-v19.0.0-linux-x64.tar.xz -C /usr/local --strip-components=1 --no-same-owner
RUN rm node-v19.0.0-linux-x64.tar.xz
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs

CMD [ "node", "-v" ]