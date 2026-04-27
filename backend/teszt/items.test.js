import request from "supertest";
import { app, httpServer } from "../server.js";
import prisma from "../config/db.js";

describe("Items API Végpontok tesztelése", () => {
  afterAll(async () => {
    httpServer.close();
    await prisma.$disconnect();
  });

  describe("GET /api/items", () => {
    it("visszaadja az összes elérhető hirdetést", async () => {
      const response = await request(app).get("/api/items");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("items");
      expect(Array.isArray(response.body.items)).toBe(true);
    });
  });

  describe("GET /api/items/:id", () => {
    it("404-et ad nem létező hirdetésre", async () => {
      const response = await request(app).get("/api/items/999999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /api/items", () => {
    it("401-et ad be nem jelentkezett felhasználónak", async () => {
      const response = await request(app)
        .post("/api/items")
        .send({ title: "Teszt", price: 100 });
      expect(response.status).toBe(401);
    });
  });
});
