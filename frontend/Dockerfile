FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Beolvassuk az argumentumokat a GitHub Actions-ből
ARG VITE_API_URL
ARG VITE_BASE_URL

# Környezeti változóként beállítjuk őket a buildelés idejére
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# React/Vite alkalmazás lefordítása
RUN npm run build

# Második (könnyű) réteg a futtatáshoz NGINX-szel
FROM nginx:alpine

# Másoljuk át a lefordított fájlokat a build fázisból
COPY --from=build /app/dist /usr/share/nginx/html

# Egy alapvető nginx konfiguráció az SPA (React Router) miatt, 
# hogy a /valami útvonal frissítésnél is működjön.
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
