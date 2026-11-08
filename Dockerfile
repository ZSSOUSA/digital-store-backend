
FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

ENV NODE_ENV=development

EXPOSE 3000

USER node

CMD ["npm", "start"]
