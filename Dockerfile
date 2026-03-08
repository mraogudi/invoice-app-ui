# Use a Node image to build the app
FROM node:20-alpine AS build
WORKDIR /app

# 1. Define ARGs (These must match the --build-arg names in cloudbuild.yaml)
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_MICROSOFT_CLIENT_ID
ARG VITE_GITHUB_CLIENT_ID

# 2. Make them available as ENVs during the build process
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_MICROSOFT_CLIENT_ID=$VITE_MICROSOFT_CLIENT_ID
ENV VITE_GITHUB_CLIENT_ID=$VITE_GITHUB_CLIENT_ID

COPY package*.json ./
RUN npm install
COPY . .

# 3. Build the app (Vite will now see the variables and bake them in)
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run needs the container to listen on 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
