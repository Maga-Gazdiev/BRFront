FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:1.28-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh
ENV PORT=80
EXPOSE 80
CMD ["/app/start.sh"]
