FROM node:14

ARG arm_branch
ARG arm_build_date
ARG arm_version
ARG arm_host
ARG build_mode

ENV arm_branch=${arm_branch}
ENV arm_build_date=cachebust14
ENV arm_version=${arm_version}
ENV arm_host=${arm_host}

# create app directory
WORKDIR /usr/src/app

# RUN git clone -b $arm_branch https://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:x-oauth-basic@github.com/amp-nova/amp-rsa-multihub.git /usr/src/app
# RUN git clone -b dev https://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:x-oauth-basic@github.com/amp-nova/amp-rsa-multihub.git /usr/src/app
# RUN git config --global user.email "amp-rsa-multihub@amplience.com"
# RUN git config --global user.name "Multihub User"
# RUN git rev-parse --short HEAD >> /etc/arm_commit_hash

# DAVE don't forget to comment this line out for prod builds
COPY package.json .

# COPY ./config/settings.yaml /usr/src/app/config

RUN npm install -g ts-node
RUN npm install

COPY . .

EXPOSE 6393

# ENTRYPOINT [ "npm", "run", "dev" ]
# ENTRYPOINT [ "ts-node", "./start-server.ts" ]
ENTRYPOINT [ "npm", "run", "start" ]