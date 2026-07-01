import { describe, expect, it, vi } from 'vitest'

// ──────────────────────────────────────────────
// Dati finti: simulano il corpo della richiesta PUT
// ──────────────────────────────────────────────
const updateBody = {
  name: 'Updated',
  image: 'https://example.com/new.png',
  technologies: ['Node'],
  description: 'Updated desc',
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

// Il controller ora usa ProjectService.update() invece di Project.findOneAndUpdate().
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

// updateProject è un array: [updateProjectValidator, validateRequest,
// authMiddleware, jwtAuth, handler]. getHandler estrae il vero handler.
function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any
}

// ──────────────────────────────────────────────
// Test per updateProject
// ──────────────────────────────────────────────

describe('updateProject', () => {
  it('aggiorna e restituisce il progetto', async () => {
    // Simulo ProjectService.update che restituisce il documento aggiornato
    const updated = { _id: '1', ...updateBody }
    mockProjectService.update.mockResolvedValue(updated as any)
    const mod = await import('./updateProject')
    const handler = getHandler(mod.updateProject)
    const { req, res, next } = mockReqRes()
    req.params.id = '1'
    req.body = updateBody
    await handler(req, res, next)

    // Verifico TUTTI gli argomenti: id e dati. La logica { new: true }
    // è incapsulata nel service, non serve testarla qui.
    expect(mockProjectService.update).toHaveBeenCalledWith('1', updateBody)
    expect(res.json).toHaveBeenCalledWith(updated)
  })

  it('risponde 404 quando il progetto non esiste', async () => {
    // update restituisce null → progetto non trovato
    mockProjectService.update.mockResolvedValue(null)
    const mod = await import('./updateProject')
    const handler = getHandler(mod.updateProject)
    const { req, res, next } = mockReqRes()
    req.params.id = 'nonexistent'
    req.body = updateBody
    await handler(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 404,
      message: 'Project non trovato',
    }))
  })
})
