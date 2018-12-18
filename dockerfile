FROM node:9.11.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY ./package.json /usr/src/app/

RUN npm i yarn -g \
&& yarn install \
&& yarn add @types/react-router-dom \
&& yarn add @types/react-router

# Bundle app source
COPY . /usr/src/app

ENV EGG_SERVER_ENV=prod


# MONGO_URL: mongodb url
ENV MONGO_URL=

# EOS_POINT: Eoe node point
ENV EOS_POINT=
# Eos access account private key

RUN yarn build

CMD ["node", "index.js"]

EXPOSE 4000
~       