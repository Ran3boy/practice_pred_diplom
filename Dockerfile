FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
COPY apps/main-app/package*.json apps/main-app/
COPY apps/angular-demo/package*.json apps/angular-demo/
COPY packages/shared-data/package.json packages/shared-data/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/benchmark-utils/package.json packages/benchmark-utils/package.json
RUN npm install --prefix apps/main-app
RUN npm install --prefix apps/angular-demo

COPY . .
RUN npm run build
RUN npm run build:angular
RUN npm run experiment

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80
ENV PUBLIC_DIR=/app/public-runtime

COPY server/server.mjs server/server.mjs
COPY --from=build /app/apps/main-app/dist public-runtime/
COPY --from=build /app/dist/angular-demo/browser public-runtime/angular-demo/
COPY --from=build /app/docs/experiment-results public-runtime/experiment-results/

EXPOSE 80
CMD ["node", "server/server.mjs"]
