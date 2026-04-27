import request from "supertest";
import { app, httpServer } from "../server.js";
import prisma from "../config/db.js";

describe("Orders API Végpontok tesztelése", () => {
  afterAll(async () => {
    httpServer.close();
    await prisma.$disconnect();
  });

  describe("POST /api/orders", () => {
    it("401-et ad be nem jelentkezett felhasználónak", async () => {
      const response = await request(app)
        .post("/api/orders")
        .send({ item_id: 1 });
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/orders/my-orders", () => {
    it("401-et ad autentikáció nélkül", async () => {
      const response = await request(app).get("/api/orders/my-orders");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/orders/my-sales", () => {
    it("401-et ad autentikáció nélkül", async () => {
      const response = await request(app).get("/api/orders/my-sales");
      expect(response.status).toBe(401);
    });
  });
});
