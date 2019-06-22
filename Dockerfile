FROM node:10.15.0-alpine
LABEL Mantainer="Julio Jimenez <juliofrancisj@gmail.com>"
LABEL Author="Julio Jimenez <juliofrancisj@gmail.com>"


ARG REDIS_HOST
ARG REDIS_PORT
ARG MONGO_URL
ARG AMQP_URL

ENV REDIS_HOST $REDIS_HOST
ENV REDIS_PORT $REDIS_PORT
ENV MONGO_URL $MONGO_URL
ENV AMQP_URL $AMQP_URL 



EXPOSE 3000

COPY . .
RUN npm install

CMD ["npm", "start"]

