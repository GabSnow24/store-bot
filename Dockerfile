FROM node:16-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --production=false

RUN apk --no-cache add curl

COPY . .
RUN npx prisma generate
RUN yarn run build

FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk --no-cache add curl
RUN yarn install --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist
RUN npx prisma generate
EXPOSE 8080
CMD ["yarn", "start:prod"]
