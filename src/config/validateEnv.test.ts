import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../middleware/index.js", () => ({
  AppError: class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

describe("validateEnv", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("non lancia errori quando tutte le variabili sono impostate", async () => {
    vi.doMock("./env.js", () => ({
      env: {
        apiKey: "api-key",
        jwtSecret: "secret",
        dbConnection: "mongodb://localhost",
        adminEmail: "admin@example.com",
        adminPassword: "password",
      },
    }));

    const { validateEnv } = await import("./validateEnv.js");
    expect(() => validateEnv()).not.toThrow();
  });

  it("lancia errore quando manca una variabile obbligatoria", async () => {
    vi.doMock("./env.js", () => ({
      env: {
        apiKey: undefined,
        jwtSecret: "secret",
        dbConnection: "mongodb://localhost",
        adminEmail: "admin@example.com",
        adminPassword: "password",
      },
    }));

    const { validateEnv } = await import("./validateEnv.js");
    expect(() => validateEnv()).toThrow(/apiKey/);
  });

  it("lancia errore con statusCode 500", async () => {
    vi.doMock("./env.js", () => ({
      env: {
        apiKey: "api-key",
        jwtSecret: undefined,
        dbConnection: "mongodb://localhost",
        adminEmail: "admin@example.com",
        adminPassword: "password",
      },
    }));

    const { validateEnv } = await import("./validateEnv.js");
    try {
      validateEnv();
    } catch (err: unknown) {
      expect((err as { statusCode: number }).statusCode).toBe(500);
    }
  });
});
