# --- build the React client ---
FROM node:20-alpine AS build
WORKDIR /app/client
COPY client/package.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# --- run the Node/Express server ---
FROM node:20-alpine
WORKDIR /app
COPY server/package.json ./server/
RUN npm install --prefix server
COPY server/ ./server/
COPY --from=build /app/client/dist ./client/dist

ENV PORT=8080
EXPOSE 8080
CMD ["node", "server/server.js"]
