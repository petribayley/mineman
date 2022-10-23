# Setup env
FROM alpine:3.16.2 as base

ENV NODE_VERSION 19.0.0
ENV DISTRO linux-x64

# Update APK
RUN apk update
RUN apk add --no-cache --virtual .build-deps-full python3 gcc g++ make wget linux-headers gcompat
RUN wget https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-${DISTRO}.tar.xz

FROM base as base-node
# Setup Node
RUN mkdir -p /usr/local/lib/nodejs /usr/local/include
RUN tar -xJvf node-v${NODE_VERSION}-${DISTRO}.tar.xz -C /usr/local --strip-components=1 --no-same-owner
RUN rm node-v${NODE_VERSION}-${DISTRO}.tar.xz
RUN chmod a+x /usr/local/bin/node /usr/local/bin/npm /usr/local/bin/npx

CMD [ "/usr/local/bin/node", "-v" ]
#CMD [ "ldd", "/usr/local/bin/node" ]