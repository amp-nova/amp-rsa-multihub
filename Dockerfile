FROM node:14

ARG arm_branch
ARG arm_build_date
ARG arm_version

ENV arm_branch=${arm_branch}
ENV arm_build_date=${arm_build_date}
ENV arm_version=${arm_version}

# create app directory
WORKDIR /usr/src/app
RUN git clone -b $arm_branch https://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:x-oauth-basic@github.com/amp-nova/amp-rsa-multihub.git /usr/src/app
RUN git rev-parse --short HEAD >> /etc/arm_commit_hash

COPY ./config/settings.yaml /usr/src/app/config

RUN npm install
RUN npm run build
 
EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
