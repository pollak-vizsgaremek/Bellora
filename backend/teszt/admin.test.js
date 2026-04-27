import request from "supertest";
import { app, httpServer } from "../server.js";
import prisma from "../config/db.js";

describe("Admin API Végpontok tesztelése", () => {
  afterAll(async () => {
    httpServer.close();
    await prisma.$disconnect();
  });

  describe("GET /api/admin/stats", () => {
    it("401-et ad token nélkül", async () => {
      const response = await request(app).get("/api/admin/stats");
      expect(response.status).toBe(401);
    });

    it("403-at ad nem admin felhasználónak érvénytelen tokennel", async () => {
      const response = await request(app)
        .get("/api/admin/stats")
        .set("Authorization", "Bearer invalidtoken123");
      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/admin/users", () => {
    it("401-et ad autentikáció nélkül", async () => {
      const response = await request(app).get("/api/admin/users");
      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/admin/users/:userId", () => {
    it("401-et ad autentikáció nélkül", async () => {
      const response = await request(app).delete("/api/admin/users/1");
      expect(response.status).toBe(401);
    });
  });
});
