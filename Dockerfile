FROM node:14

ARG mode

# create app directory
WORKDIR /usr/src/app
RUN git clone -b $mode https://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:x-oauth-basic@github.com/amp-nova/amp-rsa-multihub.git /usr/src/app

COPY ./config/settings.yaml /usr/src/app/config

RUN npm install
RUN npm run build
 
EXPOSE 3000

CMD [ "npm", "start" ]
