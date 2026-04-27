import request from "supertest";
import { app, httpServer } from "../server.js";
import prisma from "../config/db.js";

describe("Users API Végpontok tesztelése", () => {
  afterAll(async () => {
    httpServer.close();
    await prisma.$disconnect();
  });

  describe("GET /api/users/:userId", () => {
    it("404-et ad nem létező felhasználóra", async () => {
      const response = await request(app).get("/api/users/999999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PUT /api/users/profile", () => {
    it("401-et ad autentikáció nélkül", async () => {
      const response = await request(app)
        .put("/api/users/profile")
        .send({ full_name: "Teszt" });
      expect(response.status).toBe(401);
    });
  });

  describe("PUT /api/users/password", () => {
    it("401-et ad autentikáció nélkül", async () => {
      const response = await request(app)
        .put("/api/users/password")
        .send({ old_password: "asd", new_password: "asd123" });
      expect(response.status).toBe(401);
    });
  });
});
