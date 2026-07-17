import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("dotenv", () => ({
  default: { config: vi.fn() },
}));

describe("env", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("usa valori di default quando le variabili non sono impostate", async () => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.LOG_LEVEL;
    delete process.env.PROJECT_PREFIXES;
    delete process.env.SCREENSHOTS_DIR;

    const { env } = await import("./env.js");

    expect(env.nodeEnv).toBe("development");
    expect(env.isDevelopment).toBe(true);
    expect(env.isProduction).toBe(false);
    expect(env.port).toBe(3000);
    expect(env.logLevel).toBe("info");
    expect(env.projectPrefixes).toEqual(["fm-"]);
    expect(env.screenshotsDir).toBe("./public/screenshots");
  });

  it("usa valori da process.env quando impostati", async () => {
    process.env.NODE_ENV = "production";
    process.env.PORT = "8080";
    process.env.LOG_LEVEL = "debug";
    process.env.PROJECT_PREFIXES = "fm-,test-";
    process.env.SCREENSHOTS_DIR = "/custom/screenshots";

    const { env } = await import("./env.js");

    expect(env.nodeEnv).toBe("production");
    expect(env.isDevelopment).toBe(false);
    expect(env.isProduction).toBe(true);
    expect(env.port).toBe("8080");
    expect(env.logLevel).toBe("debug");
    expect(env.projectPrefixes).toEqual(["fm-", "test-"]);
    expect(env.screenshotsDir).toBe("/custom/screenshots");
  });

  it("mappa le variabili opzionali come undefined se mancanti", async () => {
    delete process.env.GITHUB_TOKEN;
    delete process.env.SERVER_API_KEY;
    delete process.env.LOG_FILE_PATH;
    delete process.env.ERROR_LOG_FILE_PATH;
    delete process.env.CORS_ORIGIN;
    delete process.env.CORS_DEV_ORIGIN;
    delete process.env.RATE_LIMIT_WINDOW_MS;
    delete process.env.RATE_LIMIT_MAX;
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.DB_CONNECTION;
    delete process.env.JWT_SECRET;

    const { env } = await import("./env.js");

    expect(env.githubToken).toBeUndefined();
    expect(env.apiKey).toBeUndefined();
    expect(env.logFilePath).toBeUndefined();
    expect(env.errorLogFilePath).toBeUndefined();
    expect(env.corsOrigins).toBeUndefined();
    expect(env.devOrigin).toBeUndefined();
    expect(env.rateLimitWindow).toBeUndefined();
    expect(env.rateLimitMax).toBeUndefined();
    expect(env.adminEmail).toBeUndefined();
    expect(env.adminPassword).toBeUndefined();
    expect(env.dbConnection).toBeUndefined();
    expect(env.jwtSecret).toBeUndefined();
  });
});
