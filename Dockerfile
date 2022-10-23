# Setup env
FROM alpine:3.16 as base

ENV NODE_VERSION 19.0.0
ENV DISTRO linux-x64
ENV MUSL_VERSION 1.2.3

# Update APK
RUN \
	apk update && \
	apk add --no-cache python3 gcc g++ make wget linux-headers gpg gpg-agent libstdc++
# Download Node
RUN \
	mkdir -p mm_setup/node && \
	cd mm_setup/node && \
	wget https://unofficial-builds.nodejs.org/download/release/v${NODE_VERSION}/node-v${NODE_VERSION}-${DISTRO}-musl.tar.gz && \
	wget https://unofficial-builds.nodejs.org/download/release/v${NODE_VERSION}/SHASUMS256.txt && \
	grep node-v${NODE_VERSION}-${DISTRO}.tar.xz SHASUMS256.txt | sha256sum -c -
# Download Musl
RUN \
	mkdir -p mm_setup/musl && \
	cd mm_setup/musl && \
	wget https://musl.libc.org/releases/musl-${MUSL_VERSION}.tar.gz && \
	wget https://musl.libc.org/releases/musl-${MUSL_VERSION}.tar.gz.asc && \
	wget https://musl.libc.org/musl.pub && \
	gpg --import musl.pub && \
	gpg --verify musl-${MUSL_VERSION}.tar.gz.asc musl-${MUSL_VERSION}.tar.gz

# Setup musl
FROM base as base-musl
RUN \
	cd mm_setup/musl && \
	tar -xvf musl-${MUSL_VERSION}.tar.gz && \
	cd musl-${MUSL_VERSION} && \
	./configure && \
	make install

# Setup Node
FROM base-musl as base-node
RUN \
	cd mm_setup/node && \
	tar -xJvf node-v${NODE_VERSION}-${DISTRO}.tar.xz --strip-components=1 --no-same-owner && \
	ln -s bin/node /usr/local/bin/node && \
	ln -s bin/npm /usr/local/bin/npm && \
	ln -s bin/npx /usr/local/bin/npx

#CMD [ "/usr/local/bin/node", "-v" ]
CMD [ "ldd", "/mm_setup/node/bin/node" ]