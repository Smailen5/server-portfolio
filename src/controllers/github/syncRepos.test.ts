import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../../middleware/errorHandler";

// ──────────────────────────────────────────────
// Dati finti
// ──────────────────────────────────────────────

const mockRepositories = [
  {
    name: "react-app",
    html_url: "https://github.com/repo/react-app",
    description: "React app repository",
  },
  {
    name: "vue-app",
    html_url: "https://github.com/repo/vue-app",
    description: "Vue app repository",
  },
];

const mockPackageJson = {
  name: "React App",
  description: "A React project",
  technologies: ["react", "vite"],
  createdAt: "2024-01-01",
};

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// syncRepos usa:
// - GitHubService: 4 metodi
// - ProjectService: upsert

// appLogger va mockato: syncRepos importa middleware che
// a loro volta importano errorHandler -> appLogger, che in
// CI crasha perché i file path dei log non sono configurati.
vi.mock("../../config/appLogger", () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

const mockEnv = {
  githubToken: "mock-token",
  projectPrefixes: ["fm-"],
  screenshotsDir: "./tmp/screenshots",
};

vi.mock("../../config", () => ({
  env: mockEnv,
}));

vi.mock("../../config/env", () => ({
  env: { apiKey: "valid-api-key", jwtSecret: "valid-jwt-secret" },
}));

const mockGitHubService = {
  getRepositories: vi.fn(),
  getPackageJson: vi.fn(),
  getScreenshots: vi.fn(),
  getReadme: vi.fn(),
};

vi.mock("../../services/GitHubService", () => ({
  createGitHubService: vi.fn(() => mockGitHubService),
}));

const mockProjectService = {
  upsert: vi.fn(),
};

vi.mock("../../services/ProjectService", () => ({
  createProjectService: vi.fn(() => mockProjectService),
}));

const mockImageService = {
  downloadAndConvert: vi.fn(),
};

vi.mock("../../services/ImageService", () => ({
  createImageService: vi.fn(() => mockImageService),
}));

const mockCache = {
  get: vi.fn(),
  set: vi.fn(),
  invalidate: vi.fn(),
  clear: vi.fn(),
};

vi.mock("../../utils/cache", () => ({
  cache: mockCache,
}));

import { createGitHubService } from "../../services/GitHubService";

// ──────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────

function mockReqRes() {
  const req = { headers: {}, body: {} } as any;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();
  return { req, res, next };
}

// syncRepos è un array: [syncValidator, validateRequest, authMiddleware, jwtAuth, handler].
// L'ultimo elemento è sempre il vero handler. Questa funzione lo estrae.
// In questo modo testiamo SOLO la logica del controller, saltando i middleware.
function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any;
}

// ──────────────────────────────────────────────
// Test per syncRepos
// ──────────────────────────────────────────────
// syncRepos è più complesso di getRepos:
// 1. Prende i progetti da GitHub (getProjectsFromGithub)
// 2. Per ognuno: screenshots, readme, package.json
// 3. Usa projectService.upsert() per salvare ogni progetto
// 4. Restituisce un riepilogo di quanti sincronizzati

describe("syncRepos", () => {
  // Ogni test parte con i mock "puliti" — nessuna chiamata
  // precedente registrata. Evita che un test influenzi l'altro.
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.githubToken = "mock-token";
    mockImageService.downloadAndConvert.mockResolvedValue(null);
  });

  // Test 1: percorso felice — tutto funziona, upsert crea progetti nuovi
  it("sincronizza i progetti da GitHub al database", async () => {
    // Configuro TUTTI i mock per simulare uno scenario completo
    mockGitHubService.getRepositories.mockResolvedValue(mockRepositories);
    mockGitHubService.getPackageJson.mockResolvedValue(mockPackageJson);
    mockGitHubService.getScreenshots.mockResolvedValue([
      "https://example.com/screenshot.webp",
    ]);
    mockGitHubService.getReadme.mockResolvedValue("# Readme content");
    mockImageService.downloadAndConvert.mockResolvedValue(
      "/screenshots/react-app-screenshot.webp"
    );
    mockProjectService.upsert.mockResolvedValue({} as any);

    // Import dinamico dopo i mock
    const { syncRepos } = await import("./syncRepos");
    const handler = getHandler(syncRepos);
    const { req, res, next } = mockReqRes();

    await handler(req, res, next);

    // Verifico che tutte le funzioni GitHub siano state chiamate
    expect(createGitHubService).toHaveBeenCalled();
    expect(mockGitHubService.getScreenshots).toHaveBeenCalled();
    expect(mockGitHubService.getReadme).toHaveBeenCalled();
    expect(mockGitHubService.getPackageJson).toHaveBeenCalled();

    // 2 progetti -> 2 upsert
    expect(mockProjectService.upsert).toHaveBeenCalledTimes(2);

    // Uso expect.objectContaining per verificare SOLO le proprietà
    // che mi interessano, ignorando campi dinamici come errors[]
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        syncedProjects: 2,
        totalProjects: 2,
      })
    );
  });

  // Test 2: comportamento upsert (aggiorna o crea a seconda dei casi)
  it("usa upsert per aggiornare o creare progetti", async () => {
    mockGitHubService.getRepositories.mockResolvedValue(mockRepositories);
    mockGitHubService.getPackageJson.mockResolvedValue(mockPackageJson);
    mockGitHubService.getScreenshots.mockResolvedValue([
      "https://example.com/screenshot.webp",
    ]);
    mockGitHubService.getReadme.mockResolvedValue("# Readme");
    mockImageService.downloadAndConvert.mockResolvedValue(
      "/screenshots/react-app-screenshot.webp"
    );
    mockProjectService.upsert.mockResolvedValue({} as any);

    const { syncRepos } = await import("./syncRepos");
    const handler = getHandler(syncRepos);
    const { req, res, next } = mockReqRes();

    await handler(req, res, next);

    // upsert gestisce internamente create e update,
    // il controller chiama sempre upsert
    expect(mockProjectService.upsert).toHaveBeenCalled();
    expect(mockProjectService.upsert).toHaveBeenCalledTimes(2);
  });

  // Test 3: tutto fallisce — nessun progetto sincronizzato
  it("chiama next con AppError quando nessun progetto sincronizzato", async () => {
    mockGitHubService.getRepositories.mockResolvedValue(mockRepositories);
    mockGitHubService.getPackageJson.mockRejectedValue(new Error("Fail"));
    mockGitHubService.getScreenshots.mockRejectedValue(new Error("Fail"));

    const { syncRepos } = await import("./syncRepos");
    const handler = getHandler(syncRepos);
    const { req, res, next } = mockReqRes();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Nessun progetto è stato sincronizzato con successo",
        statusCode: 500,
      })
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  // Test 4: GitHub API non raggiungibile — errore totale
  it("chiama next con AppError quando la sincronizzazione fallisce del tutto", async () => {
    mockGitHubService.getRepositories.mockRejectedValue(
      new Error("GitHub down")
    );

    const { syncRepos } = await import("./syncRepos");
    const handler = getHandler(syncRepos);
    const { req, res, next } = mockReqRes();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "GitHub down",
        statusCode: 500,
      })
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  // Test 5: invalida cache getRepos dopo sincronizzazione riuscita
  it("invalida la cache getRepos dopo sincronizzazione", async () => {
    mockGitHubService.getRepositories.mockResolvedValue(mockRepositories);
    mockGitHubService.getPackageJson.mockResolvedValue(mockPackageJson);
    mockGitHubService.getScreenshots.mockResolvedValue([
      "https://example.com/screenshot.webp",
    ]);
    mockGitHubService.getReadme.mockResolvedValue("# Readme content");
    mockImageService.downloadAndConvert.mockResolvedValue(
      "/screenshots/react-app-screenshot.webp"
    );
    mockProjectService.upsert.mockResolvedValue({} as any);

    const { syncRepos } = await import("./syncRepos");
    const handler = getHandler(syncRepos);
    const { req, res, next } = mockReqRes();

    await handler(req, res, next);

    expect(mockCache.invalidate).toHaveBeenCalledWith("github:repos");
  });

  // Test 6: asset mancanti — screenshots, readme e package.json non trovati
  it("registra errori quando screenshots, readme e package.json mancano", async () => {
    mockGitHubService.getRepositories.mockResolvedValue(mockRepositories);
    mockGitHubService.getScreenshots.mockResolvedValue([]);
    mockGitHubService.getReadme.mockResolvedValue(null);
    mockGitHubService.getPackageJson.mockResolvedValue(null);

    mockProjectService.upsert.mockResolvedValue({} as any);

    const { syncRepos } = await import("./syncRepos");
    const handler = getHandler(syncRepos);
    const { req, res, next } = mockReqRes();

    await handler(req, res, next);

    expect(mockProjectService.upsert).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        syncedProjects: 2,
        errors: expect.arrayContaining([
          expect.stringContaining("Nessuna immagine di anteprima trovata"),
          expect.stringContaining("Nessun README.md trovato"),
          expect.stringContaining("Nessun package.json trovato"),
        ]),
      })
    );
  });

  // Test 7: token GitHub non configurato — handler deve restituire 500
  it("passa errore a next quando il token GitHub non è configurato", async () => {
    mockEnv.githubToken = "";

    const { syncRepos } = await import("./syncRepos");
    const handler = getHandler(syncRepos);
    const { req, res, next } = mockReqRes();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message:
          "Token GitHub non configurato. Aggiungi GITHUB_TOKEN nel file .env",
      })
    );
    expect(mockGitHubService.getRepositories).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  // Test 7: catena middleware nell'ordine corretto
  it("applica la catena middleware nell'ordine corretto", async () => {
    const { syncRepos } = await import("./syncRepos");
    const { authMiddleware, jwtAuth, syncValidator, validateRequest } =
      await import("../../middleware/index.js");

    expect(syncRepos).toHaveLength(5);
    expect(syncRepos[0]).toBe(syncValidator);
    expect(syncRepos[1]).toBe(validateRequest);
    expect(syncRepos[2]).toBe(authMiddleware);
    expect(syncRepos[3]).toBe(jwtAuth);
    expect(typeof syncRepos[4]).toBe("function");
  });

  // Test 8: richiesta senza autenticazione viene rifiutata con 401
  it("rifiuta richieste senza autenticazione con 401", async () => {
    const { syncRepos } = await import("./syncRepos");
    const authMiddleware = syncRepos[2] as any;
    const { req, res, next } = mockReqRes();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "API Key mancante",
      })
    );
  });

  // Test 9: errore su singola repo non blocca le altre
  it("continua la sincronizzazione quando una repo fallisce", async () => {
    mockGitHubService.getRepositories.mockResolvedValue(mockRepositories);
    mockGitHubService.getPackageJson.mockResolvedValue(mockPackageJson);
    mockGitHubService.getScreenshots.mockResolvedValue([
      "https://example.com/screenshot.webp",
    ]);
    mockGitHubService.getReadme.mockResolvedValue("# Readme content");
    mockImageService.downloadAndConvert.mockResolvedValue(
      "/screenshots/react-app-screenshot.webp"
    );

    // Prima repo fallisce, seconda riesce
    mockProjectService.upsert
      .mockRejectedValueOnce(new Error("DB error"))
      .mockResolvedValueOnce({} as any);

    const { syncRepos } = await import("./syncRepos");
    const handler = getHandler(syncRepos);
    const { req, res, next } = mockReqRes();

    await handler(req, res, next);

    // upsert chiamato 2 volte (una per repo)
    expect(mockProjectService.upsert).toHaveBeenCalledTimes(2);

    // 1 repo riuscita su 2
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        syncedProjects: 1,
        totalProjects: 2,
        errors: expect.arrayContaining([
          expect.stringContaining("Errore nel recupero dei dati"),
        ]),
      })
    );
  });
});
