cd /deploy/node_health

npm install

cd /deploy/node_health/src

npx sequelize db:create

cd /deploy/node_health

npm install pm2 -g

pm2-runtime start ecosystem.config.js --env production
