# Step 1: The Build Stage (Make sure "AS build" is exactly here)
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: The Production Stage
FROM nginx:alpine
# This line will now work because "build" was defined above
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/