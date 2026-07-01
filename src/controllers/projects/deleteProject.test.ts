import { describe, expect, it, vi } from 'vitest'

// ──────────────────────────────────────────────
// Dati finti: simulano un documento Mongoose trovato
// ──────────────────────────────────────────────
// Con il passaggio a findOneAndDelete, il servizio restituisce
// direttamente il documento eliminato (o null se non trovato).
const existingProject = {
  _id: '1',
  name: 'To Delete',
}

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
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

// Il controller ora usa ProjectService.delete() invece di
// Project.findOne() + project.deleteOne() sull'istanza.
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

// deleteProject è un array: [idValidator, validateRequest,
// authMiddleware, jwtAuth, handler]. getHandler estrae il vero handler.
function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any
}

// ──────────────────────────────────────────────
// Test per deleteProject
// ──────────────────────────────────────────────

describe('deleteProject', () => {
  it('elimina e conferma la rimozione', async () => {
    // ProjectService.delete restituisce il documento eliminato
    mockProjectService.delete.mockResolvedValue(existingProject as any)
    const mod = await import('./deleteProject')
    const handler = getHandler(mod.deleteProject)
    const { req, res, next } = mockReqRes()
    req.params.id = '1'
    await handler(req, res, next)

    // Verifico che delete sia stato chiamato con l'id corretto
    expect(mockProjectService.delete).toHaveBeenCalledWith('1')
    expect(res.json).toHaveBeenCalledWith({ message: 'Project eliminato' })
  })

  it('risponde 404 quando il progetto non esiste', async () => {
    mockProjectService.delete.mockResolvedValue(null)
    const mod = await import('./deleteProject')
    const handler = getHandler(mod.deleteProject)
    const { req, res, next } = mockReqRes()
    req.params.id = 'nonexistent'
    await handler(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 404,
      message: 'Project non trovato',
    }))
  })
})
