FROM node:18.12.1-alpine3.16

RUN mkdir -p /usr/app/

WORKDIR /usr/app

COPY ./ ./

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]