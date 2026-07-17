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
        githubToken: "token",
        logFilePath: "/logs/app.log",
        errorLogFilePath: "/logs/error.log",
        corsOrigins: "https://example.com",
        devOrigin: "http://localhost:5173",
        rateLimitWindow: "900000",
        rateLimitMax: "100",
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
        githubToken: undefined,
        logFilePath: "/logs/app.log",
        errorLogFilePath: "/logs/error.log",
        corsOrigins: "https://example.com",
        devOrigin: "http://localhost:5173",
        rateLimitWindow: "900000",
        rateLimitMax: "100",
        apiKey: "api-key",
        jwtSecret: "secret",
        dbConnection: "mongodb://localhost",
        adminEmail: "admin@example.com",
        adminPassword: "password",
      },
    }));

    const { validateEnv } = await import("./validateEnv.js");
    expect(() => validateEnv()).toThrow(/githubToken/);
  });

  it("lancia errore con statusCode 500", async () => {
    vi.doMock("./env.js", () => ({
      env: {
        githubToken: "token",
        logFilePath: undefined,
        errorLogFilePath: "/logs/error.log",
        corsOrigins: "https://example.com",
        devOrigin: "http://localhost:5173",
        rateLimitWindow: "900000",
        rateLimitMax: "100",
        apiKey: "api-key",
        jwtSecret: "secret",
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
