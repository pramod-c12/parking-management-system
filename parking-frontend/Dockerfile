# Stage 1: Use secure Node base image
FROM node:23-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Use secure Nginx image
FROM nginx:1.27-alpine-slim
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
