import { describe, expect, it, vi } from "vitest";

const mockConnectMongo = vi.fn();
const mockCreateAdminUser = vi.fn();

vi.mock("./mongodb.js", () => ({
  connectMongo: mockConnectMongo,
}));

vi.mock("../seeders/createAdminUser.js", () => ({
  createAdminUser: mockCreateAdminUser,
}));

vi.mock("./appLogger.js", () => ({
  appLogger: { info: vi.fn(), error: vi.fn() },
}));

describe("initMongo", () => {
  it("inizializza MongoDB con successo", async () => {
    mockConnectMongo.mockResolvedValue(undefined);
    mockCreateAdminUser.mockResolvedValue(undefined);

    const initMongo = (await import("./initMongo.js")).default;
    await expect(initMongo()).resolves.not.toThrow();
    expect(mockConnectMongo).toHaveBeenCalled();
    expect(mockCreateAdminUser).toHaveBeenCalled();
  });

  it("lancia errore se connectMongo fallisce", async () => {
    mockConnectMongo.mockRejectedValue(new Error("Connection failed"));

    const initMongo = (await import("./initMongo.js")).default;
    await expect(initMongo()).rejects.toThrow("Connection failed");
  });

  it("lancia errore se createAdminUser fallisce", async () => {
    mockConnectMongo.mockResolvedValue(undefined);
    mockCreateAdminUser.mockRejectedValue(new Error("Admin creation failed"));

    const initMongo = (await import("./initMongo.js")).default;
    await expect(initMongo()).rejects.toThrow("Admin creation failed");
  });
});
