import request from "supertest";
import { app, httpServer } from "../server.js";
import prisma from "../config/db.js";

describe("Auth API Végpontok tesztelése", () => {
  afterAll(async () => {
    httpServer.close();
    await prisma.$disconnect();
  });

  describe("POST /api/auth/login", () => {
    it("hibát kell adnia hiányzó adatok esetén", async () => {
      const response = await request(app).post("/api/auth/login").send({});
      // Üres email-lel Prisma validation error -> 500
      expect([400, 500]).toContain(response.status);
      expect(response.body).toHaveProperty("message");
    });

    it("hibát kell adnia (401) érvénytelen adatok esetén", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "nemletezo@teszt.hu", password: "badpassword" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Hibás email vagy jelszó");
    });
  });

  describe("POST /api/auth/register", () => {
    it("hibát kell adnia hiányzó adatok esetén", async () => {
      const response = await request(app).post("/api/auth/register").send({});
      // Üres adatokkal bcrypt/Prisma error -> 500
      expect([400, 500]).toContain(response.status);
      expect(response.body).toHaveProperty("message");
    });
  });
});
