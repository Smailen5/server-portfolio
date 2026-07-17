import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFindOne = vi.fn();
const mockCreate = vi.fn();

vi.mock("../models/User.js", () => ({
  User: { findOne: mockFindOne, create: mockCreate },
}));

vi.mock("bcrypt", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed-password") },
}));

vi.mock("../config/appLogger.js", () => ({
  appLogger: { info: vi.fn(), error: vi.fn() },
}));

describe("createAdminUser", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it("crea un nuovo admin se non esiste", async () => {
    vi.doMock("../config/env.js", () => ({
      env: { adminEmail: "admin@test.com", adminPassword: "test-password" },
    }));
    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({});

    const { createAdminUser } = await import("./createAdminUser.js");
    await expect(createAdminUser()).resolves.not.toThrow();
    expect(mockFindOne).toHaveBeenCalledWith({ email: "admin@test.com" });
    expect(mockCreate).toHaveBeenCalledWith({
      name: "Admin",
      email: "admin@test.com",
      password: "hashed-password",
      role: "admin",
      isActive: true,
    });
  });

  it("non crea admin se gia esistente", async () => {
    vi.doMock("../config/env.js", () => ({
      env: { adminEmail: "admin@test.com", adminPassword: "test-password" },
    }));
    mockFindOne.mockResolvedValue({ email: "admin@test.com" });

    const { createAdminUser } = await import("./createAdminUser.js");
    await expect(createAdminUser()).resolves.not.toThrow();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("lancia errore se credenziali admin non configurate", async () => {
    vi.doMock("../config/env.js", () => ({
      env: { adminEmail: undefined, adminPassword: undefined },
    }));

    const { createAdminUser } = await import("./createAdminUser.js");
    await expect(createAdminUser()).rejects.toThrow(
      "Credenziali admin non configurate"
    );
  });
});
