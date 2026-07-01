import { describe, expect, it, vi } from 'vitest'

// ──────────────────────────────────────────────
// Dati finti
// ──────────────────────────────────────────────
const mockProject = { _id: '1', name: 'Project A', description: 'First', technologies: ['React'] }

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// appLogger va mockato per primo: i controller importano
// validateRequest → errorHandler → appLogger, che in CI
// crasha perché i file path per i log non sono configurati.
vi.mock('../../config/appLogger', () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

const mockProjectService = vi.hoisted(() => ({
  create: vi.fn(),
  getAll: vi.fn(),
  getById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}))

// Il controller ora usa ProjectService.getById() invece di Project.findOne().
vi.mock('../../services/ProjectService', () => ({
  createProjectService: vi.fn(() => mockProjectService),
}))

// ──────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────
function mockReqRes() {
  const req = { params: {}, body: {} } as any
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as any
  const next = vi.fn()
  return { req, res, next }
}

// getProjectById è un array: [idValidator, validateRequest, handler].
// getHandler estrae l'ultimo elemento (il vero handler) saltando i middleware.
function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any
}

// ──────────────────────────────────────────────
// Test per getProjectById
// ──────────────────────────────────────────────

describe('getProjectById', () => {
  it('restituisce il progetto quando trovato', async () => {
    mockProjectService.getById.mockResolvedValue(mockProject as any)
    const mod = await import('./getProjectById')
    const handler = getHandler(mod.getProjectById)
    const { req, res, next } = mockReqRes()
    // Il controller legge req.params.id per cercare il progetto.
    // Nel flusso reale, idValidator lo convaliderebbe prima.
    req.params.id = '1'
    await handler(req, res, next)

    // Verifico che abbia cercato con l'id giusto
    expect(mockProjectService.getById).toHaveBeenCalledWith('1')
    expect(res.json).toHaveBeenCalledWith(mockProject)
  })

  it('risponde 404 quando il progetto non esiste', async () => {
    // getById restituisce null → progetto inesistente
    mockProjectService.getById.mockResolvedValue(null)
    const mod = await import('./getProjectById')
    const handler = getHandler(mod.getProjectById)
    const { req, res, next } = mockReqRes()
    req.params.id = 'nonexistent'
    await handler(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 404,
      message: 'Progetto non trovato',
    }))
  })
})
