import { describe, expect, it, vi, beforeEach } from "vitest";
import { Octokit } from "octokit";

vi.mock("octokit", () => ({
  Octokit: vi.fn(),
}));

describe("getOctokitInstance", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("inizializza Octokit con il token quando GITHUB_TOKEN è configurato", async () => {
    vi.doMock("../config/index.js", () => ({
      env: { githubToken: "test-token" },
    }));
    const { getOctokitInstance } = await import("./octokit.js");

    const instance = getOctokitInstance();

    expect(Octokit).toHaveBeenCalledTimes(1);
    expect(Octokit).toHaveBeenCalledWith({ auth: "test-token" });
    expect(instance).toBeDefined();
  });

  it("inizializza Octokit senza token quando GITHUB_TOKEN non è configurato", async () => {
    vi.doMock("../config/index.js", () => ({
      env: { githubToken: undefined },
    }));
    const { getOctokitInstance } = await import("./octokit.js");

    const instance = getOctokitInstance();

    expect(Octokit).toHaveBeenCalledTimes(1);
    expect(Octokit).toHaveBeenCalledWith({});
    expect(instance).toBeDefined();
  });

  it("restituisce la stessa istanza alle chiamate successive", async () => {
    vi.doMock("../config/index.js", () => ({
      env: { githubToken: "test-token" },
    }));
    const { getOctokitInstance } = await import("./octokit.js");

    const firstInstance = getOctokitInstance();
    const secondInstance = getOctokitInstance();

    expect(Octokit).toHaveBeenCalledTimes(1);
    expect(firstInstance).toBe(secondInstance);
  });
});
