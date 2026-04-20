import request from 'supertest';
import { app, httpServer } from '../server.js';
import prisma from '../config/db.js';

describe('Auth API Végpontok tesztelése', () => {
  afterAll(async () => {
    // Leállítjuk a szervert és lezárjuk az adatbázis kapcsolatot a tesztek végén
    httpServer.close();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/login', () => {
    it('hibát kell adnia (400) hiányzó adatok esetén', async () => {
      const response = await request(app).post('/api/auth/login').send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('hibát kell adnia (401) érvénytelen adatok esetén (üres DB-ben sosincs ilyen user)', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nemletezo@teszt.hu', password: 'badpassword' });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Érvénytelen email vagy jelszó');
    });
  });

  describe('POST /api/auth/register', () => {
    it('sikeres regisztráció vagy validációs hiba', async () => {
      // Sikertelen tesztet futtatunk szándékosan hiányzó adatokkal a validation ellenőrzésére
      const response = await request(app).post('/api/auth/register').send({});
      expect(response.status).toBe(400);
    });
  });
});
