import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";

const { mockUserModel } = vi.hoisted(() => ({
  mockUserModel: {
    findOne: vi.fn(),
  },
}));

vi.mock("../../src/models/User.js", () => ({
  User: mockUserModel,
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

const mockEnv = vi.hoisted(() => ({
  apiKey: "test-api-key-1234567890",
  jwtSecret: "test-jwt-secret",
  githubToken: "test-github-token",
  projectPrefixes: ["fm-"],
  screenshotsDir: "./tmp/screenshots",
  port: 3000,
  mongoUri: "mongodb://localhost:27017/test",
  logLevel: "info",
  logDir: "./logs",
  rateLimitWindowMs: 900000,
  rateLimitMax: 100,
  corsOrigin: "*",
}));

vi.mock("../../src/config/index.js", () => ({
  env: mockEnv,
}));

vi.mock("../../src/config/env.js", () => ({
  env: mockEnv,
}));

vi.mock("../../src/config/appLogger.js", () => ({
  appLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import bcrypt from "bcrypt";
import { createTestApp } from "../helpers/testApp.js";

const mockUser = {
  _id: "test-user-id",
  email: "test@example.com",
  password: "$2b$10$hashedpassword",
  updateOne: vi.fn(),
};

const app = createTestApp();

describe("Route /api/users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/users/login", () => {
    it("effettua login con credenziali valide", async () => {
      mockUserModel.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      });
      (bcrypt.compare as any).mockResolvedValue(true);

      const response = await request(app).post("/api/users/login").send({
        email: "test@example.com",
        password: "correct-password",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    it("ritorna 401 per email non esistente", async () => {
      mockUserModel.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(null),
      });

      const response = await request(app).post("/api/users/login").send({
        email: "wrong@example.com",
        password: "password",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Credenziali non valide");
    });

    it("ritorna 401 per password errata", async () => {
      mockUserModel.findOne.mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      });
      (bcrypt.compare as any).mockResolvedValue(false);

      const response = await request(app).post("/api/users/login").send({
        email: "test@example.com",
        password: "wrong-password",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Credenziali non valide");
    });

    it("valida campi obbligatori", async () => {
      const response = await request(app).post("/api/users/login").send({});

      expect(response.status).toBe(400);
    });

    it("valida formato email", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "not-an-email",
        password: "password",
      });

      expect(response.status).toBe(400);
    });
  });
});
