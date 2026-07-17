import { describe, expect, it, vi } from "vitest";

const mockConnect = vi.fn();

vi.mock("mongoose", () => ({
  default: { connect: mockConnect },
}));

vi.mock("./appLogger.js", () => ({
  appLogger: { info: vi.fn(), error: vi.fn() },
}));

vi.mock("./env.js", () => ({
  env: { dbConnection: "mongodb://localhost/test" },
}));

describe("connectMongo", () => {
  it("si connette a MongoDB con successo", async () => {
    mockConnect.mockResolvedValue(undefined);

    const { connectMongo } = await import("./mongodb.js");
    await expect(connectMongo()).resolves.not.toThrow();
    expect(mockConnect).toHaveBeenCalledWith("mongodb://localhost/test");
  });

  it("lancia errore se la connessione fallisce", async () => {
    mockConnect.mockRejectedValue(new Error("Connection failed"));

    const { connectMongo } = await import("./mongodb.js");
    await expect(connectMongo()).rejects.toThrow("Connection failed");
  });
});
