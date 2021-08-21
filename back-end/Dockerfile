FROM node:14

RUN mkdir -p /app

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

RUN npx sequelize db:create

RUN chown -R node /app
USER node

CMD ["npm", "run", "start"]
