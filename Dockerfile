FROM node:10.15.0-alpine
LABEL Mantainer="Julio Jimenez <juliofrancisj@gmail.com>"
LABEL Author="Julio Jimenez <juliofrancisj@gmail.com>"

EXPOSE 3000

COPY . .
RUN npm install

CMD ["npm", "start"]

