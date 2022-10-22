# Setup env
FROM alpine:3.16.2 as base
# Update APK
RUN apk update
RUN apk add python3 py3-pip gcc g++ make curl

FROM base as base-node
# Setup Node
RUN mkdir /mine_man_build/
RUN cd /mine_man_build
RUN curl https://github.com/nodejs/node/archive/refs/tags/v19.0.0.tar.gz --output node-v19.0.0.tar.gz
RUN tar -xzf node-v19.0.0.tar.gz
RUN cd node-v19.0.0
RUN ./configure
RUN make -j4
