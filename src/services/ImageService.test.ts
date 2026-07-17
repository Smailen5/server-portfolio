import path from "path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockExistsSync, mockMkdirSync } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockMkdirSync: vi.fn(),
}));

vi.mock("fs", () => ({
  default: {
    existsSync: mockExistsSync,
    mkdirSync: mockMkdirSync,
  },
}));

const { mockSharp, mockToFile } = vi.hoisted(() => {
  const toFile = vi.fn();
  const webp = vi.fn(() => ({ toFile }));
  const sharp = vi.fn(() => ({ webp }));
  return { mockSharp: sharp, mockToFile: toFile };
});

vi.mock("sharp", () => ({
  default: mockSharp,
}));

vi.mock("../config/appLogger.js", () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

const mockEnv = vi.hoisted(() => ({ screenshotsDir: "./tmp/screenshots" }));

vi.mock("../config/index.js", () => ({
  env: mockEnv,
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { createImageService } from "./ImageService.js";

describe("ImageService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it("crea la cartella screenshots se non esiste", () => {
    mockExistsSync.mockReturnValue(false);
    createImageService();

    expect(mockMkdirSync).toHaveBeenCalledWith(mockEnv.screenshotsDir, {
      recursive: true,
    });
  });

  it("non ricrea la cartella se esiste gia", () => {
    mockExistsSync.mockReturnValue(true);
    createImageService();

    expect(mockMkdirSync).not.toHaveBeenCalled();
  });

  it("ritorna URL locale senza riconvertire se file esiste gia", async () => {
    mockExistsSync.mockReturnValue(true);
    const service = createImageService();

    const url = await service.downloadAndConvert(
      "https://example.com/screenshot.png",
      "fm-test"
    );

    expect(url).toBe("/screenshots/fm-test-screenshot.webp");
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockSharp).not.toHaveBeenCalled();
  });

  it("scarica e converte l'immagine se non esiste", async () => {
    mockExistsSync.mockReturnValueOnce(false).mockReturnValueOnce(false);
    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(Buffer.from("image-data").buffer),
    });
    mockToFile.mockResolvedValue(undefined);

    const service = createImageService();
    const url = await service.downloadAndConvert(
      "https://example.com/screenshot.png",
      "fm-test"
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.com/screenshot.png"
    );
    expect(mockSharp).toHaveBeenCalledWith(expect.any(Buffer));
    expect(mockToFile).toHaveBeenCalledWith(
      path.join(mockEnv.screenshotsDir, "fm-test-screenshot.webp")
    );
    expect(url).toBe("/screenshots/fm-test-screenshot.webp");
  });

  it("ritorna null se il download fallisce", async () => {
    mockExistsSync.mockReturnValue(false);
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const service = createImageService();
    const url = await service.downloadAndConvert(
      "https://example.com/screenshot.png",
      "fm-test"
    );

    expect(url).toBeNull();
  });

  it("ritorna null se fetch lancia un errore", async () => {
    mockExistsSync.mockReturnValue(false);
    mockFetch.mockRejectedValue(new Error("Network error"));

    const service = createImageService();
    const url = await service.downloadAndConvert(
      "https://example.com/screenshot.png",
      "fm-test"
    );

    expect(url).toBeNull();
  });
});
