FROM node:20-alpine

WORKDIR /app

# Csomagkezelő fájlok átmásolása
COPY package*.json ./

# Függőségek telepítése (kivéve a devDependencies hogy kisebb legyen a kép)
# Ha tesztelni is akarunk ezen beül, elhagyható a --production
RUN npm install --omit=dev

# TELJES kód átmásolása
COPY . .

# Argumentumok fogadása a GitHub Actions `build-args` részéből
ARG DATABASE_URL
ARG PORT
ARG JWT_SECRET

# Környezeti változókká alakítjuk őket a build idején, hogy a Prisma generate láthassa a DATABASE_URL-t
ENV DATABASE_URL=$DATABASE_URL
ENV PORT=$PORT
ENV JWT_SECRET=$JWT_SECRET

# Prisma kliens generálása a schema-ból (ehhez még nem kell futó adatbázis)
RUN npx prisma generate

EXPOSE 5000

# Indítás (a backend környezeti változóit pl. DATABASE_URL, futtatáskor kapja majd a Docker Compose-tól / cloud-tól)
CMD ["npm", "start"]
