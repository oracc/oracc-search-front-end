FROM node:14.17.0-alpine as build-step

WORKDIR /app

COPY ./ui/package.json /app

RUN npm install

COPY ./ui /app

RUN npm run buildProd

FROM nginx:stable-alpine

COPY --from=build-step /app/dist/oracc /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200:80

CMD ["nginx", "-g", "daemon off;"]