# Build Stage
FROM node:18.14.2 AS builder

WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Install dependencies and updates
RUN npm install && npm update

# Copy the source code
COPY . .

# Build the application depending on the mode
ARG MODE=production

RUN if [ "$MODE" = "production" ]; then \
    echo "Building for production..."; \
    npm run build:prod; \
elif [ "$MODE" = "development" ]; then \
    echo "Building for development..."; \
    npm run build:dev; \
else \
    echo "Local MODE: $MODE. local build."; \
    npm run generate:local; \
fi

# Production Stage - Using Nginx to Serve the Application
FROM nginx:alpine AS production

# Copy the built files from the builder stage to Nginx's public directory
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80

# Nginx configuration can be customized if necessary
# COPY nginx.conf /etc/nginx/nginx.conf  # Uncomment to add your custom Nginx config

# CMD is not needed because Nginx is the default command in the nginx image
# So we just rely on the default entrypoint of Nginx