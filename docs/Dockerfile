FROM node:14

VOLUME /deploy/node_health

COPY ./start-server.sh /usr/local/bin
RUN ln -s /usr/local/bin/start-server.sh /start-server.sh


CMD ["start-server.sh"]

