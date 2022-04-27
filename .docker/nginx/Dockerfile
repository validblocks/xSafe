FROM ubuntu/nginx:latest

RUN mkdir -p /var/log/nginx/ && \
  chown -R nginx:nginx /var/log/nginx

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update -y
RUN apt install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get install -y libudev-dev libusb-1.0 gcc make g++ autoconf automake libtool nasm wget python3 git curl vim mc nodejs

ENV NVM_DIR /usr/local/.nvm
ENV NODE_VERSION 12.22.12

RUN git clone https://github.com/creationix/nvm.git $NVM_DIR && \
  cd $NVM_DIR && \
  git checkout `git describe --abbrev=0 --tags`

RUN source $NVM_DIR/nvm.sh && \
  nvm install $NODE_VERSION && \
  nvm install lts/boron && \
  nvm install lts/carbon && \
  nvm install lts/dubnium && \
  nvm install lts/erbium && \
  nvm alias default $NODE_VERSION && \
  nvm use default

RUN echo "source ${NVM_DIR}/nvm.sh" > $HOME/.bashrc && \
  source $HOME/.bashrc

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules

RUN apt install -y npm

EXPOSE ${DOCKER_NGINX_PORT}

WORKDIR /var/www/

VOLUME /var/www/node_modules

CMD ["nginx", "-g", "daemon off;"]
