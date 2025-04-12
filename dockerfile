# Stage 1: Build
FROM node:22-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Run
FROM node:22-alpine AS prod

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=base /usr/src/app/package*.json ./
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/.env .env
COPY --from=base /usr/src/app/openapi.yaml openapi.yaml

EXPOSE 8000

CMD ["npm", "run", "start"]
