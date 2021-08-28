#!/bin/bash

cd /deploy/node_health

npm install

npx sequelize db:create

npm install pm2 -g

pm2-runtime start ecosystem.config.js --env production

#chmod +x ./start-server.sh