FROM node:20-alpine3.19

RUN adduser --disabled-password --home /home/container container

RUN echo https://dl-cdn.alpinelinux.org/alpine/v3.19/main > /etc/apk/repositories
RUN echo https://dl-cdn.alpinelinux.org/alpine/v3.19/community >> /etc/apk/repositories
RUN echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories
RUN echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories

RUN apk add --no-cache --update bash wget

ARG TARGETPLATFORM
RUN ["/bin/bash", "-c", "if [ \"$TARGETPLATFORM\" = \"linux/amd64\" ]; then \
      wget https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 -O /usr/local/bin/dumb-init; \
    elif [ \"$TARGETPLATFORM\" = \"linux/arm64\" ]; then \
      wget https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_aarch64 -O /usr/local/bin/dumb-init; \
    fi"]

RUN rm -rf /var/cache/apk/* /tmp/*
RUN chmod +x /usr/local/bin/dumb-init

ENTRYPOINT ["dumb-init", "--"]

COPY --chown=container:container ./docker /home/container/notbot-legacy
WORKDIR /home/container/notbot-legacy

RUN npm ci

USER container
ENV USER=container 
ENV HOME=/home/container 

COPY ./entrypoint.sh /entrypoint.sh
EXPOSE 8001
CMD ["/bin/bash", "/entrypoint.sh"]