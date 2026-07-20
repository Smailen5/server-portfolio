import { describe, expect, it, vi } from "vitest";

// ──────────────────────────────────────────────
// Dati finti: simulano il corpo della richiesta POST
// ──────────────────────────────────────────────
const validBody = {
  name: "New Project",
  link: "https://example.com",
  images: ["https://example.com/img.png"],
  technologies: ["React"],
  description: "New desc",
  readme: "# Readme",
};

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// mockProjectService viene definito con vi.hoisted() per essere
// disponibile prima di vi.mock() (vitest hoista i mock in cima).
const mockProjectService = vi.hoisted(() => ({
  create: vi.fn(),
  getAll: vi.fn(),
  getById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../../config/appLogger", () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

// Il controller ora usa ProjectService invece di Project direttamente.
vi.mock("../../services/ProjectService", () => ({
  createProjectService: vi.fn(() => mockProjectService),
}));

// ──────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────
function mockReqRes() {
  const req = { params: {}, body: {} } as any;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();
  return { req, res, next };
}

// createProject è un array: [createProjectValidator, validateRequest,
// authMiddleware, jwtAuth, handler]. getHandler estrae il vero handler.
function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any;
}

// ──────────────────────────────────────────────
// Test per createProject
// ──────────────────────────────────────────────

describe("createProject", () => {
  it("crea e restituisce il progetto", async () => {
    // Simulo ProjectService.create che restituisce il progetto con _id assegnato
    const created = { _id: "new", ...validBody };
    mockProjectService.create.mockResolvedValue(created as any);
    const mod = await import("./createProject");
    const handler = getHandler(mod.createProject);
    const { req, res, next } = mockReqRes();
    // Passo il body direttamente (i middleware di validazione sono saltati)
    req.body = validBody;
    await handler(req, res, next);

    // Verifico che create sia stato chiamato con i dati esatti
    expect(mockProjectService.create).toHaveBeenCalledWith(validBody);
    // 201 = Created, più preciso di 200 per le creazioni
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it("risponde 500 in caso di errore", async () => {
    // mockRejectedValue simula un errore del servizio
    mockProjectService.create.mockRejectedValue(new Error("Validation failed"));
    const mod = await import("./createProject");
    const handler = getHandler(mod.createProject);
    const { req, res, next } = mockReqRes();
    req.body = validBody;
    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Validation failed",
      })
    );
  });
});
