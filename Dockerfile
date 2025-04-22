FROM node:18.14.2

WORKDIR /app

COPY package*.json ./

RUN npm install && npm update

COPY . .

EXPOSE 3000

ARG MODE=local

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

CMD [ "npx", "serve", ".output/public" ]