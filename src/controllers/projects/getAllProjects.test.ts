import { describe, expect, it, vi } from "vitest";

// ──────────────────────────────────────────────
// Dati finti: simulano documenti MongoDB
// ──────────────────────────────────────────────
const mockProjects = [
  {
    _id: "1",
    name: "Project A",
    description: "First",
    technologies: ["React"],
    images: [],
    repoUrl: "",
    version: "",
    createdAt: String(new Date("2026-01-01")),
    readme: "",
  },
  {
    _id: "2",
    name: "Project B",
    description: "Second",
    technologies: ["Vue"],
    images: [],
    repoUrl: "",
    version: "",
    createdAt: String(new Date("2026-01-02")),
    readme: "",
  },
];

// ──────────────────────────────────────────────
// Map dei dati
// ──────────────────────────────────────────────
const expectedResponse = mockProjects.map((project) => ({
  name: project.name,
  description: project.description,
  technologies: project.technologies,
  images: project.images,
  repoUrl: project.repoUrl,
  version: project.version,
  createdAt: project.createdAt,
  readmeContent: project.readme,
}));

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// getAllProjects usa solo ProjectService.getAll(), quindi
// mock solo quel metodo. Meno mock = test più leggibile.
const mockProjectService = vi.hoisted(() => ({
  create: vi.fn(),
  getAll: vi.fn(),
  getById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../../services/ProjectService", () => ({
  createProjectService: vi.fn(() => mockProjectService),
}));

// ──────────────────────────────────────────────
// Helper: crea req, res, next finti come Express
// ──────────────────────────────────────────────
function mockReqRes() {
  const req = { params: {}, body: {} } as any;
  // mockReturnThis() permette il chaining: res.status(500).json(...)
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  // next è il terzo parametro richiesto da RequestHandler
  const next = vi.fn();
  return { req, res, next };
}

// ──────────────────────────────────────────────
// Test per getAllProjects
// ──────────────────────────────────────────────
// getAllProjects è un controller semplice:
// chiama ProjectService.getAll() e restituisce i risultati.
// NON ha middleware, NON ha parametri dalla richiesta.

describe("getAllProjects", () => {
  it("restituisce tutti i progetti ordinati per createdAt desc", async () => {
    // Il servizio restituisce direttamente i dati (la logica di
    // Project.find().sort() è incapsulata nel service layer).
    mockProjectService.getAll.mockResolvedValue(mockProjects as any);
    const { req, res, next } = mockReqRes();

    // Import dinamico: i mock devono essere già attivi quando
    // il modulo viene caricato.
    const { getAllProjects } = await import("./getAllProjects");
    await getAllProjects(req, res, next);

    expect(mockProjectService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("risponde 500 in caso di errore", async () => {
    // mockRejectedValue simula un'eccezione (es. DB down)
    mockProjectService.getAll.mockRejectedValue(new Error("DB fail"));
    const { req, res, next } = mockReqRes();

    const { getAllProjects } = await import("./getAllProjects");
    await getAllProjects(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "DB fail",
      })
    );
  });
});
