# Production stage
FROM nginx:alpine

# Ensure the config exists in your repo at this path
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build artifacts to nginx html folder
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]