FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

CMD [ "node", "/app/src/index.js" ]
