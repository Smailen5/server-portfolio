import { beforeEach, describe, expect, it, vi } from "vitest";

const mockRateLimit = vi.fn(() => "rate-limit-middleware");

beforeEach(() => {
  vi.resetModules();
});

describe("rateLimiter middleware", () => {
  it("configura limiter con valori da env", async () => {
    vi.doMock("../config/env.js", () => ({
      env: {
        rateLimitWindow: "900000",
        rateLimitMax: "100",
      },
    }));
    vi.doMock("express-rate-limit", () => ({
      __esModule: true,
      default: mockRateLimit,
    }));

    const { limiter } = await import("./rateLimiter.js");

    expect(mockRateLimit).toHaveBeenCalledWith(
      expect.objectContaining({
        windowMs: 900000,
        max: 100,
      })
    );
    expect(limiter).toBe("rate-limit-middleware");
  });

  it("usa i valori di default per limiter quando env è vuoto", async () => {
    vi.doMock("../config/env.js", () => ({
      env: {},
    }));
    vi.doMock("express-rate-limit", () => ({
      __esModule: true,
      default: mockRateLimit,
    }));

    await import("./rateLimiter.js");

    expect(mockRateLimit).toHaveBeenCalledWith(
      expect.objectContaining({
        windowMs: 15 * 60 * 1000,
        max: 100,
      })
    );
  });

  it("configura loginLimiter con limiti più stretti", async () => {
    vi.doMock("../config/env.js", () => ({
      env: {},
    }));
    vi.doMock("express-rate-limit", () => ({
      __esModule: true,
      default: mockRateLimit,
    }));

    const { loginLimiter } = await import("./rateLimiter.js");

    expect(mockRateLimit).toHaveBeenCalledWith(
      expect.objectContaining({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: {
          success: false,
          message: "Troppi tentativi di accesso. Riprova più tardi.",
        },
        standardHeaders: true,
        legacyHeaders: false,
      })
    );
    expect(loginLimiter).toBe("rate-limit-middleware");
  });
});
