import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCors = vi.fn(() => "cors-middleware");

beforeEach(() => {
  vi.resetModules();
});

describe("cors middleware", () => {
  it("configura CORS con origini, metodi e headers corretti", async () => {
    vi.doMock("../config/env.js", () => ({
      env: {
        corsOrigins: "https://smailenvargas.com",
        devOrigin: "https://localhost:5173",
      },
    }));
    vi.doMock("cors", () => ({
      __esModule: true,
      default: mockCors,
    }));

    const { corsOptions, corsMiddleware } = await import("./cors.js");

    expect(corsOptions.origin).toEqual([
      "https://smailenvargas.com",
      "https://localhost:5173",
    ]);
    expect(corsOptions.methods).toEqual(["GET", "POST", "PUT", "DELETE"]);
    expect(corsOptions.allowedHeaders).toEqual([
      "Content-Type",
      "Authorization",
      "x-api-key",
    ]);
    expect(mockCors).toHaveBeenCalledWith(corsOptions);
    expect(corsMiddleware).toBe("cors-middleware");
  });

  it("disabilita origin quando manca una delle origini", async () => {
    vi.doMock("../config/env.js", () => ({
      env: {
        corsOrigins: "https://smailenvargas.com",
        devOrigin: undefined,
      },
    }));
    vi.doMock("cors", () => ({
      __esModule: true,
      default: mockCors,
    }));

    const { corsOptions } = await import("./cors.js");

    expect(corsOptions.origin).toBe(false);
  });
});
