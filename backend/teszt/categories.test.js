import request from "supertest";
import { app, httpServer } from "../server.js";
import prisma from "../config/db.js";

describe("Categories API Végpontok tesztelése", () => {
  afterAll(async () => {
    httpServer.close();
    await prisma.$disconnect();
  });

  describe("GET /api/categories", () => {
    it("visszaadja a kategóriákat", async () => {
      const response = await request(app).get("/api/categories");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("categories");
      expect(Array.isArray(response.body.categories)).toBe(true);
    });
  });
});
