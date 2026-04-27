import request from "supertest";
import { app, httpServer } from "../server.js";
import prisma from "../config/db.js";

describe("Reports API Végpontok tesztelése", () => {
  afterAll(async () => {
    httpServer.close();
    await prisma.$disconnect();
  });

  describe("POST /api/reports", () => {
    it("401-et ad be nem jelentkezett felhasználónak", async () => {
      const response = await request(app)
        .post("/api/reports")
        .send({ item_id: 1, reason: "Hamis termék" });
      expect(response.status).toBe(401);
    });
  });
});
