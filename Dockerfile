FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# RUN BUILD

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json .

RUN npm install --omit=dev

CMD ["npm", "start"]
