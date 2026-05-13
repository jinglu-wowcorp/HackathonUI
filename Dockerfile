# Step 1: The Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: The Production Stage
FROM nginx:alpine

# REMOVE the default config that forces port 80
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built assets
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Expose port 8080 (good practice documentation)
EXPOSE 8080

# Start Nginx and ensure it stays in the foreground
CMD ["nginx", "-g", "daemon off;"]