FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --silent
COPY . .
CMD ["node", "index.js"]