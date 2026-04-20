FROM node:20-alpine

WORKDIR /app

# Csomagkezelő fájlok átmásolása
COPY package*.json ./

# Függőségek telepítése (kivéve a devDependencies hogy kisebb legyen a kép)
# Ha tesztelni is akarunk ezen beül, elhagyható a --production
RUN npm install --omit=dev

# TELJES kód átmásolása
COPY . .

# Prisma kliens generálása a schema-ból (ehhez még nem kell futó adatbázis)
RUN npx prisma generate

EXPOSE 5000

# Indítás (a backend környezeti változóit pl. DATABASE_URL, futtatáskor kapja majd a Docker Compose-tól / cloud-tól)
CMD ["npm", "start"]
